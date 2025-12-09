import type { Request, Response } from "express";
import { LandlordModel } from "../../database/models/Landlord.model";
import { generateReferralCode } from "../../utils/generateReferralCode";
import { emailInviteToTenant } from "../../utils/emailService";

export const inviteTenant = async (req: Request, res: Response) => {
  const { tenantName, tenantAddress, tenantEmail } = req.body;
  const userId = req.userId;

  let referralCode: string | undefined;

  // Normalize the tenant address for comparison
  const normalizedAddress = {
    street: tenantAddress.street.toLowerCase().trim(),
    unit: tenantAddress.unit?.toLowerCase().trim() || undefined,
    city: tenantAddress.city.toLowerCase().trim(),
    state: tenantAddress.state.toLowerCase().trim(),
    zip: tenantAddress.zip.trim()
  };

  try {
    const landlord = await LandlordModel.findById(userId);

    if (!landlord) {
      return res.status(404).json({ message: 'User not found!' });
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

      emailInviteToTenant(referralCode, tenantName, tenantEmail);

      return res.status(200).json({ message: 'Email sent! Your first invite!' });
    } else {
      // Check if property already exists
      for (let property of landlord.properties) {
        const propAddressNormalized = {
          street: property.address.street?.toLowerCase().trim(),
          unit: property.address.unit?.toLowerCase().trim() || undefined,
          city: property.address.city?.toLowerCase().trim(),
          state: property.address.state?.toLowerCase().trim(),
          zip: property.address.zip?.trim()
        };

        // Compare addresses
        if (
          propAddressNormalized.street === normalizedAddress.street &&
          propAddressNormalized.city === normalizedAddress.city &&
          propAddressNormalized.state === normalizedAddress.state &&
          propAddressNormalized.zip === normalizedAddress.zip
        ) {
          referralCode = property.referralCode;

          emailInviteToTenant(referralCode, tenantName, tenantEmail);

          return res.status(200).json({ message: 'Invite sent!' });
        }
      }

      // If no matching property, create a new one
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

      const updatedPropertyListLength = updatedLandlord?.properties.length! - 1;
      referralCode = updatedLandlord?.properties[updatedPropertyListLength].referralCode!;

      emailInviteToTenant(referralCode, tenantName, tenantEmail);

      return res.status(200).json({ message: 'Email invite sent!' });
    }

  } catch (err) {
    console.error('Unexpected Error:', err);
    return res.status(500).json({ message: 'Unexpected Error' });
  }
};
