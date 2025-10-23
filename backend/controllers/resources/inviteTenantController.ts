import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { LandlordModel } from "../../database/models/Landlord.model";
import { generateReferralCode } from "../../utils/generateReferralCode";
import { emailInviteToTenant } from "../../utils/emailService";
import { parseAddress } from "../../utils/parseAddress";
import { addressesEqual } from "../../utils/addressEqual";

dotenv.config()

export const inviteTenantController = async (req: Request, res: Response) => {
  const { tenantName, tenantAddress, tenantEmail, accessToken } = req.body

  const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN!

  let referralCode: string | undefined;

  const parsedAddress = parseAddress(tenantAddress)

  try {
    const decoded = jwt.verify(accessToken, JWT_ACCESS_TOKEN);

    // extra defensive check
    if (!decoded || typeof decoded !== 'object') {
      return res.status(400).json({ message: "Invalid token format." });
    }

    const landlord = await LandlordModel.findById(decoded.userID)

    if (!landlord) {
      return res.status(404).json({ message: 'User not found!' })
    }

    if (landlord?.properties.length === 0) {
      const updatedLandlord = await LandlordModel.findByIdAndUpdate(
        decoded.userID,
        {
          $push: {
            properties: {
              name: "",
              address: parsedAddress,
              referralCode: generateReferralCode(),
              tenants: []
            }
          }
        },
        { new: true }
      );

      referralCode = updatedLandlord?.properties[0].referralCode!

      emailInviteToTenant(referralCode, tenantName, tenantEmail)

      return res.status(200).json({ message: 'Email sent! Your first invite!' })
      // if at least one property exist run the else condition
    } else {
      for (let property of landlord.properties) {
        // if there is a matching property run this condition
        
        if (addressesEqual(property.address, parsedAddress)) {
          referralCode = property.referralCode

          emailInviteToTenant(referralCode, tenantName, tenantEmail)
          
          return res.status(200).json({ message: 'Invite sent!' })
        }
      }
      // if there are properties but none match run this condition
      const updatedLandlord = await LandlordModel.findByIdAndUpdate(
        decoded.userID,
        {
          $push: {
            properties: {
              name: "",
              address: parsedAddress,
              referralCode: generateReferralCode(),
              tenants: []
            }
          }
        },
        { new: true }
      );

      const updatedPropertyListLength = updatedLandlord?.properties.length! - 1
      referralCode = updatedLandlord?.properties[updatedPropertyListLength].referralCode!

      emailInviteToTenant(referralCode, tenantName, tenantEmail)

      return res.status(200).json({ message: 'Email invite sent!' })
    }

  } catch (err) {
    // all tampering / invalid signature / expired token lands here
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ message: err.message });
    } else {
      console.error('Unexpected Error:', err);
      return res.status(500).json({ message: 'Unexpected Error' })
    }
  }
}