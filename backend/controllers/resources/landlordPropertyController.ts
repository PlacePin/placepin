import mongoose from "mongoose";
import type { Request, Response } from "express";
import { LandlordModel } from "../../database/models/Landlord.model";
import { PropertyModel } from "../../database/models/Property.model";

export const addProperty = async (req: Request, res: Response) => {
  const { propertyName, propertyAddress, unitAmount } = req.body; // Changed propertyAddress to address
  const userId = req.userId;

  try {
    // Normalize address fields for comparison
    const normalizedAddress = {
      street: propertyAddress.street.toLowerCase().trim(),
      unit: propertyAddress.unit?.toLowerCase().trim() || undefined,
      city: propertyAddress.city.toLowerCase().trim(),
      state: propertyAddress.state.toLowerCase().trim(),
      zip: propertyAddress.zip.trim()
    };

    // Check if property already exists in Property collection
    const existingProperty = await PropertyModel.findOne({
      'address.street': normalizedAddress.street,
      'address.city': normalizedAddress.city,
      'address.state': normalizedAddress.state,
      'address.zip': normalizedAddress.zip
    });

    if (existingProperty) {
      return res.status(409).json({ 
        message: 'This property address is already registered in our system.' 
      });
    }

    // Check if landlord already has this property in their embedded properties array
    const properties = await LandlordModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(`${userId}`) } },
      { $unwind: '$properties' },
      {
        $project: {
          _id: 0,
          address: {
            street: "$properties.address.street",
            unit: '$properties.address.unit',
            city: "$properties.address.city",
            state: "$properties.address.state",
            zip: "$properties.address.zip"
          },
        },
      },
    ]);

    // Check if this landlord already added this property
    for (const property of properties) {
      const propAddressNormalized = {
        street: property.address.street?.toLowerCase().trim(),
        unit: property.address.unit?.toLowerCase().trim() || undefined,
        city: property.address.city?.toLowerCase().trim(),
        state: property.address.state?.toLowerCase().trim(),
        zip: property.address.zip?.trim()
      };

      if (
        propAddressNormalized.street === normalizedAddress.street &&
        propAddressNormalized.city === normalizedAddress.city &&
        propAddressNormalized.state === normalizedAddress.state &&
        propAddressNormalized.zip === normalizedAddress.zip
      ) {
        return res.status(422).json({ message: 'You have already added this property!' });
      }
    }

    // Create new property in Property collection
    const newPropertyDoc = new PropertyModel({
      landlord: userId,
      address: normalizedAddress,
      taxYears: []
    });

    await newPropertyDoc.save();

    // Also add to landlord's embedded properties array (for backward compatibility)
    const newProperty = {
      name: propertyName,
      address: normalizedAddress,
      numberOfUnits: unitAmount,
    };

    await LandlordModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          properties: newProperty
        }
      },
    );

    return res.status(201).json({ message: "Property added!" });

  } catch (err: any) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updatePropertyInfo = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized.' });

  const { propertyId, propertyDetails } = req.body;

  try {
    // Build dot-notation $set paths so only sent fields are updated,
    // leaving all other propertyDetails fields untouched.
    const updateFields = Object.entries(propertyDetails).reduce<Record<string, unknown>>(
      (dotPaths, [field, fieldValue]) => {
        if (fieldValue == null) return dotPaths;

        if (typeof fieldValue === 'object' && !Array.isArray(fieldValue)) {
          for (const [subField, subFieldValue] of Object.entries(fieldValue as object)) {
            if (subFieldValue !== undefined) {
              dotPaths[`properties.$.propertyDetails.${field}.${subField}`] = subFieldValue;
            }
          }
        } else {
          dotPaths[`properties.$.propertyDetails.${field}`] = fieldValue;
        }
        return dotPaths;
      },
      {}
    );

    const updated = await LandlordModel.findOneAndUpdate(
      { _id: userId, 'properties._id': propertyId },
      { $set: updateFields },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    return res.status(200).json({ message: 'Property details updated!' });
  } catch (err) {
    console.error('Error updating property details:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getLandlordProperties = async (
  req: Request,
  res: Response
) => {
  const userId = req.userId;

  try {
    const properties = await LandlordModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      {
        $project: {
          properties: 1
        }
      },
      { $unwind: "$properties" },
      {
        $lookup: {
          from: "tenants",
          localField: "properties.tenants.tenantId",
          foreignField: "_id",
          as: "tenantData"
        }
      },
      {
        $project: {
          "properties._id": 1,
          "properties.name": 1,
          "properties.address": 1,
          "properties.numberOfUnits": 1,
          "properties.propertyDetails": 1,
          tenantCount: { $size: "$tenantData" }
        }
      }
    ]);

    return res.status(200).json({ properties });
  } catch (err) {
    console.error("Error fetching properties:", err);
    return res.status(500).json({ message: "Oops! Something went wrong!" });
  }
};
