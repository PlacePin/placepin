import { LandlordModel } from "../database/models/Landlord.model";
import { TenantModel } from "../database/models/Tenant.model";

export const getUserById = async (userID: string) => {

  const excludeFields = '-password -__v -subscription.savedPaymentMethod -subscription.stripeCustomerId'
  return (await TenantModel.findById(userID).select(excludeFields)) || 
  (await LandlordModel.findById(userID).select(excludeFields));
};

