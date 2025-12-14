import type { Request, Response } from "express";
import { PropertyModel } from "../../database/models/Property.model";

export const getReceipt = async (
  req: Request,
  res: Response
) => {
  const userId = req.userId;
  try {
    const properties = await PropertyModel.find({ landlord: userId }).select('address taxYears');
    return res.status(200).json({ properties: properties });
  } catch (err) {
    console.error('Error fetching properties:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const addReceipt = async (
  req: Request,
  res: Response
) => {
  const userId = req.userId;
  const { taxYear, propertyId, category, amount, date, description, paymentMethod } = req.body;

  try {
    // Validate required fields
    if (!taxYear || !propertyId || !category || !amount || !date || !paymentMethod) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Find the property and verify ownership
    const property = await PropertyModel.findOne({
      _id: propertyId,
      landlord: userId
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found or you do not have access' });
    }

    // Create the receipt object
    const newReceipt = {
      expenseCategory: category,
      amount: parseFloat(amount),
      date: new Date(date),
      paymentMethod,
      description: description || ''
    };

    // Check if the tax year already exists
    const existingTaxYearIndex = property.taxYears.findIndex(
      (ty) => ty.year === Number(taxYear)
    );

    if (existingTaxYearIndex !== -1) {
      // Tax year exists, add receipt to existing year
      await PropertyModel.updateOne(
        { _id: propertyId, 'taxYears.year': Number(taxYear) },
        {
          $push: {
            'taxYears.$.receipts': newReceipt
          }
        }
      );
    } else {
      // Tax year doesn't exist, create new tax year with receipt
      await PropertyModel.updateOne(
        { _id: propertyId },
        {
          $push: {
            taxYears: {
              year: parseInt(taxYear),
              receipts: [newReceipt]
            }
          }
        }
      );
    }
    return res.status(201).json({ message: 'Receipt added successfully' });
  } catch (err) {
    console.error('Error adding receipt:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateReceipt = async (
  req: Request,
  res: Response
) => {
  const userId = req.userId;
  const {
    taxYear,
    receiptId,
    category,
    propertyId,
    amount,
    date,
    description,
    paymentMethod
  } = req.body;

  console.log(taxYear,
    receiptId,
    category,
    propertyId,
    amount,
    date,
    description,
    paymentMethod)

  try {
    return res.status(200).json({ message: 'Success' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: `Internal Server error ${err}` })
  }
}