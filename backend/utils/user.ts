import { LandlordModel } from "../database/models/Landlord.model";
import { TenantModel } from "../database/models/Tenant.model";
import { TradesmenModel } from "../database/models/Tradesmen.model";

export const excludeFields = '-password -__v -subscription.savedPaymentMethod -subscription.stripeCustomerId'

export const getUserById = async (userID: string, excludeFields: string) => {

  return (await TenantModel.findById(userID).select(excludeFields)) || 
  (await LandlordModel.findById(userID).select(excludeFields)) ||
  (await TradesmenModel.findById(userID).select(excludeFields));
};

export const updateUserById = async (userID: string, fields: Record<string, unknown>) => {
  return (
    (await TenantModel.findByIdAndUpdate(userID, fields, { new: true })) ||
    (await LandlordModel.findByIdAndUpdate(userID, fields, { new: true })) ||
    (await TradesmenModel.findByIdAndUpdate(userID, fields, { new: true }))
  );
};
