import type { Request, Response } from "express";
import mongoose from "mongoose";
import { WorkOrderModel } from "../../database/models/WorkOrders.model";

async function getWorkOrdersByMonth(landlordId: string, propertyId: string, year: number) {
  const startOfYear = new Date(`${year}-01-01`);
  const startOfNextYear = new Date(`${year + 1}-01-01`);

  const workOrdersPerMonth = await WorkOrderModel.aggregate([
    {
      $match: {
        landlordId: new mongoose.Types.ObjectId(landlordId),
        propertyId: new mongoose.Types.ObjectId(propertyId),
        date: { $gte: startOfYear, $lt: startOfNextYear }
      }
    },
    { $group: { _id: { $month: "$date" }, orders: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, i) => {
    const monthNumber = i + 1;
    const matchedMonth = workOrdersPerMonth.find(workOrder => workOrder._id === monthNumber);
    return {
      month,
      orders: matchedMonth?.count ?? 0
    }
  });
}

export const getMonthlyWorkOrders = async (
  req: Request,
  res: Response) => {
    
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const { landlordId, propertyId } = req.params;
  const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();

  try {
    const data = await getWorkOrdersByMonth(landlordId, propertyId, year);
    return res.status(200).json(data);
  } catch (err) {
    console.error('Unexpected Error', err);
    return res.status(500).json({ message: 'Oops! Something went wrong!' })
  }
}