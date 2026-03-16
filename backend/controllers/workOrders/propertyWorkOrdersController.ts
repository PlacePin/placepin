import type { Request, Response } from "express";
import { WorkOrderModel } from "../../database/models/WorkOrders.model";

export const getPropertyWorkOrders = async (
  req: Request,
  res: Response) => {

  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const { landlordId, propertyId } = req.params;

  try {
    const workOrders = await WorkOrderModel.find({ landlordId, propertyId }).sort({ date: -1 });
    return res.status(200).json(workOrders);
  } catch (err) {
    console.error('Unexpected Error', err);
    return res.status(500).json({ message: 'Oops! Something went wrong!' })
  }
}