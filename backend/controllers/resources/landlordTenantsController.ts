import type { Request, Response } from "express";
import mongoose from "mongoose";
import { LandlordModel } from "../../database/models/Landlord.model";
import { TenantModel } from "../../database/models/Tenant.model";

export const getLandlordTenants = async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const [tenants, landlord] = await Promise.all([
      LandlordModel.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(`${userId}`) } },
        { $unwind: '$properties' },
        { $unwind: '$properties.tenants' },
        {
          $lookup: {
            from: 'tenants',
            localField: 'properties.tenants.tenantId',
            foreignField: '_id',
            as: 'tenantData'
          }
        },
        {
          $unwind: {
            path: '$tenantData',
            preserveNullAndEmptyArrays: false
          }
        },
        {
          $project: {
            'tenantData.password': 0,
            'tenantData.__v': 0,
            'tenantData.referredByLandlord': 0,
            'tenantData.subscription.stripeCustomerId': 0,
            'tenantData.subscription.savedPaymentMethod': 0,
          },
        },
        {
          $addFields: {
            'tenantData.moveInDate': '$properties.tenants.moveInDate',
            'tenantData.rentAmountPaid': '$properties.tenants.rentAmountPaid',
            'tenantData.rentAmountExpected': '$properties.tenants.rentAmountExpected',
            'tenantData.monthPaid': '$properties.tenants.monthPaid',
            'tenantData.expenses': '$properties.tenants.expenses',
            'tenantData.referred': '$properties.tenants.referred',
          }
        },
        { $replaceRoot: { newRoot: '$tenantData' } },
      ]),

      // fetch just the snapshots in parallel
      LandlordModel.findById(userId).select('financialSnapshots').lean()
    ]);

    const snapshots = landlord?.financialSnapshots ?? [];
    const thisMonth = snapshots[snapshots.length - 1];
    const lastMonth = snapshots[snapshots.length - 2];

    function getMonthlyChange(current: number, previous: number) {
      if (!previous || previous === 0) return null;
      return Math.round(((current - previous) / previous) * 100);
    }

    const incomeChange = getMonthlyChange(thisMonth?.totalExpectedIncome, lastMonth?.totalExpectedIncome);
    const expensesChange = getMonthlyChange(thisMonth?.totalExpenses, lastMonth?.totalExpenses);
    const tenantChange = thisMonth && lastMonth
      ? thisMonth.tenantCount - lastMonth.tenantCount
      : null;

    return res.status(200).json({
      tenants,
      incomeChange,
      expensesChange,
      tenantChange
    });

  } catch (err) {
    return res.status(500).json({ message: 'Oops! Something went wrong!' });
  }
};

export const getLandlordTenantPaymentHistory = async (
  req: Request,
  res: Response,
) => {
  const { tenantId } = req.params;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Invalid User' })
  }

  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 15;

    const skip = (page - 1) * limit;

    const result = await TenantModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(tenantId) } },
      {
        $project: {
          rentPayment: 1,
          total: { $size: "$rentPayment" }
        }
      },
      { $unwind: "$rentPayment" },
      { $sort: { "rentPayment.monthPaid": -1 } }, // Database does the sorting
      { $skip: skip },
      { $limit: limit },
      {
        $group: {
          _id: "$_id",
          payments: { $push: "$rentPayment" },
          total: { $first: "$total" }
        }
      }
    ]);

    const data = result[0] || { payments: [], total: 0 };

    res.json({
      data: data.payments,
      page,
      totalPages: Math.ceil(data.total / limit),
      total: data.total
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unexpected server error' });
  }
};