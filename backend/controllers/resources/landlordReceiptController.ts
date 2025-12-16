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

  try {
    // Validate required fields
    if (!receiptId || !taxYear || !propertyId || !category || !amount || !date || !paymentMethod) {
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

    // Update the receipt using MongoDB's arrayFilters
    const result = await PropertyModel.updateOne(
      {
        _id: propertyId,
        landlord: userId,
        'taxYears.year': Number(taxYear),
        'taxYears.receipts._id': receiptId
      },
      {
        $set: {
          'taxYears.$[year].receipts.$[receipt].expenseCategory': category,
          'taxYears.$[year].receipts.$[receipt].amount': parseFloat(amount),
          'taxYears.$[year].receipts.$[receipt].date': new Date(date),
          'taxYears.$[year].receipts.$[receipt].paymentMethod': paymentMethod,
          'taxYears.$[year].receipts.$[receipt].description': description || ''
        }
      },
      {
        arrayFilters: [
          { 'year.year': Number(taxYear) },
          { 'receipt._id': receiptId }
        ]
      }
    );

    // Check if receipt was found and updated
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    if (result.modifiedCount === 0) {
      return res.status(200).json({ message: 'No changes made to receipt' });
    }

    return res.status(200).json({ message: 'Receipt updated successfully' });
  } catch (err) {
    console.error('Error updating receipt:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
