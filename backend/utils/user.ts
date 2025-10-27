import { LandlordModel } from "../database/models/Landlord.model";
import { TenantModel } from "../database/models/Tenant.model";

export const excludeFields = '-password -__v -subscription.savedPaymentMethod -subscription.stripeCustomerId'

export const getUserById = async (userID: string, excludeFields: string) => {

  return (await TenantModel.findById(userID).select(excludeFields)) || 
  (await LandlordModel.findById(userID).select(excludeFields));
};

