import type { Request, Response } from "express";   
import { LandlordModel } from "../../database/models/Landlord.model";
import { PropertyModel } from "../../database/models/Property.model";
import { emailInviteToTenant } from "../../utils/emailService";
import { normalizeAddress } from "../../utils/normalizeAddress";

export const inviteTenant = async (req: Request, res: Response) => {
  const { tenantName, tenantEmail, propertyId } = req.body;
  const userId = req.userId;

  if (!propertyId) {
    return res.status(400).json({ message: "Property is required." });
  }

  try {
    const landlord = await LandlordModel.findById(userId);

    if (!landlord) {
      return res.status(404).json({ message: "User not found!" });
    }

    const property = landlord.properties.find(
      (property) => property._id.toString() === propertyId,
    );

    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }

    const { street, city, state, zip, unit } = property.address;

    if (!street || !city || !state || !zip) {
      return res.status(400).json({ message: "Property address is incomplete." });
    }

    const normalizedAddress = normalizeAddress({
      street,
      city,
      state,
      zip,
      unit: unit ?? undefined,
    });
    const referralCode = property.referralCode;

    const existingProperty = await PropertyModel.findOne({
      "address.street": normalizedAddress.street,
      "address.city": normalizedAddress.city,
      "address.state": normalizedAddress.state,
      "address.zip": normalizedAddress.zip,
    });

    if (!existingProperty) {
      const newPropertyDoc = new PropertyModel({
        landlord: userId,
        address: normalizedAddress,
        taxYears: [],
      });
      await newPropertyDoc.save();
    }

    await emailInviteToTenant(referralCode, tenantName, tenantEmail);
    return res.status(200).json({ message: "Invite sent!" });
  } catch (err) {
    console.error("Unexpected Error:", err);
    return res.status(500).json({ message: "Unexpected Error" });
  }
};
