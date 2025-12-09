import mongoose from "mongoose";
import type { Request, Response } from "express";
import { LandlordModel } from "../../database/models/Landlord.model";
import { parseAddress } from "../../utils/parseAddress";
import { addressesEqual } from "../../utils/addressEqual";

export const addProperty = async (req: Request, res: Response) => {
  const { propertyName, propertyAddress, unitAmount } = req.body;
  const userId = req.userId

  try {
    const parsedAddress = parseAddress(propertyAddress)
    console.log('pa', propertyAddress)


    const properties = await LandlordModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(`${userId}`) } },
      { $unwind: '$properties' },
      {
        $project: {
          _id: 0,
          address: {
            number: "$properties.address.number",
            street: "$properties.address.street",
            streetType: "$properties.address.streetType",
            unit: '$properties.address.unit',
            city: "$properties.address.city",
            state: "$properties.address.state",
            zip: "$properties.address.zip"
          },
        },
      },
    ]);

    for (let property of properties) {
      if (addressesEqual(property.address, parsedAddress)) {
        return res.status(422).json({ message: 'Property already exist!' })
      }
    }

    const newProperty = {
      name: propertyName,
      address: parsedAddress,
      numberOfUnits: unitAmount,
    }

    await LandlordModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          properties: newProperty
        }
      },
    )

    return res.status(201).json({ message: "Property added!" })

  } catch (err: any) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

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
          tenantCount: { $size: "$tenantData" }
        }
      }
    ]);

    return res.status(200).json({
      properties
    });
  } catch (err) {
    console.error("Error fetching properties:", err);
    return res.status(500).json({ message: "Oops! Something went wrong!" });
  }
};