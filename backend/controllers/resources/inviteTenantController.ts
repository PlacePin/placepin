import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config()

export const inviteTenantController = (req: Request, res: Response) => {
  const { tenantName, tenantAddress, tenantEmail, accessToken } = req.body

  const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN!


  try {
    const decoded = jwt.verify(accessToken, JWT_ACCESS_TOKEN);

    // extra defensive check
    if (!decoded || typeof decoded !== 'object') {
      return res.status(400).json({ message: "Invalid token format." });
    }

  } catch (err) {
    // all tampering / invalid signature / expired token lands here
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ message: err.message });
    } else {
      return console.error('Unexpected Error:', err);
    }
  }
  console.log(tenantAddress, tenantEmail, tenantName, accessToken)
}