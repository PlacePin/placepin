import type { Request, Response } from "express";
import { LandlordModel } from "../../database/models/Landlord.model";
import { PropertyModel } from "../../database/models/Property.model";
import { generateReferralCode } from "../../utils/generateReferralCode";
import { emailInviteToTenant } from "../../utils/emailService";
import { normalizeAddress, addressesEqual } from "../../utils/normalizeAddress";

export const inviteTenant = async (req: Request, res: Response) => {
  const { tenantName, tenantAddress, tenantEmail } = req.body;
  const userId = req.userId;

  if (
    !tenantAddress?.street ||
    !tenantAddress?.city ||
    !tenantAddress?.state ||
    !tenantAddress?.zip
  ) {
    return res.status(400).json({ message: "Property address is required." });
  }

  let referralCode: string | undefined;

  // Normalize the tenant address for comparison
  const normalizedAddress = normalizeAddress(tenantAddress);

  try {
    const landlord = await LandlordModel.findById(userId);

    if (!landlord) {
      return res.status(404).json({ message: 'User not found!' });
    }

    // Check if property exists in Property collection
    const existingProperty = await PropertyModel.findOne({
      'address.street': tenantAddress.street,
      'address.city': tenantAddress.city,
      'address.state': tenantAddress.state,
      'address.zip': tenantAddress.zip
    });

    if (!existingProperty) {
      const newPropertyDoc = new PropertyModel({
        landlord: userId,
        address: normalizedAddress,
        taxYears: []
      });
      await newPropertyDoc.save();
    }

    if (landlord?.properties.length === 0) {
      const updatedLandlord = await LandlordModel.findByIdAndUpdate(
        userId,
        {
          $push: {
            properties: {
              name: "",
              address: normalizedAddress,
              referralCode: generateReferralCode(),
              tenants: []
            }
          }
        },
        { new: true }
      );

      referralCode = updatedLandlord?.properties[0].referralCode!;
      await emailInviteToTenant(referralCode, tenantName, tenantEmail);
      return res.status(200).json({ message: 'Email sent! Your first invite!' });
    } else {
      // Check if property already exists using addressesEqual
      for (const property of landlord.properties) {
        if (addressesEqual(property.address, normalizedAddress)) {
          referralCode = property.referralCode;
          await emailInviteToTenant(referralCode, tenantName, tenantEmail);
          return res.status(200).json({ message: 'Invite sent!' });
        }
      }

      return res.status(400).json({
        message: "Selected property not found on your account.",
      });
    }

  } catch (err) {
    console.error('Unexpected Error:', err);
    return res.status(500).json({ message: 'Unexpected Error' });
  }
};
