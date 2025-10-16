import type { Request, Response } from "express";

export const inviteTenantController = (req: Request, res: Response) => {
  const { tenantName, tenantAddress, tenantEmail } = req.body
  
  console.log(tenantAddress, tenantEmail, tenantName)
}