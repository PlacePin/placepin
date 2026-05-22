import type { Request, Response } from "express";
import { LandlordModel } from "../../database/models/Landlord.model";

export const referralPreviewController = async (
  req: Request,
  res: Response,
) => {
  const code = typeof req.query.code === "string" ? req.query.code.trim() : "";

  if (!code) {
    return res.status(400).json({ message: "Referral code is required." });
  }

  try {
    const landlord = await LandlordModel.findOne({
      "properties.referralCode": code,
    }).select("properties");

    if (!landlord) {
      return res.status(404).json({ message: "Invalid referral code." });
    }

    const property = landlord.properties.find(
      (p) => p.referralCode === code,
    );

    if (!property) {
      return res.status(404).json({ message: "Invalid referral code." });
    }

    return res.status(200).json({
      address: property.address,
    });
  } catch (err) {
    console.error("referralPreviewController error:", err);
    return res.status(500).json({ message: "Unexpected error." });
  }
};
