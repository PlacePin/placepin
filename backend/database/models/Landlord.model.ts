import mongoose, { type InferSchemaType, type HydratedDocument } from 'mongoose';
import { generateReferralCode } from '../../utils/generateReferralCode';

// This is the shape of the landlord database object

const landlordSchema = new mongoose.Schema({
  accountType: String,
  address: String,
  age: Number,
  createdAt: { type: Date, default: Date.now },
  email: { type: String, required: true, unique: true, lowercase: true },
  fullName: String,
  hasAcceptedDisclaimer: Boolean,
  password: { type: String, required: true },
  phoneNumber: Number,
  properties: [
    {
      name: String,
      address: { type: String, required: true },
      referralCode: { type: String, default: generateReferralCode },
      tenants: [
        {
          tenantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "tenants",
          },
          rentAmount: Number,
          monthPaid: { type: Boolean, default: false },
          referred: Boolean,
        }
      ],
    }
  ],
  subscription: {
    isSubscribed: { type: Boolean, default: false },
    savedPaymentMethod: { type: String, default: null },
    stripeCustomerId: { type: String, default: null },
  },
  username: { type: String, required: true },
});

export type LandlordType = InferSchemaType<typeof landlordSchema>;
export type LandlordDocumentType = HydratedDocument<LandlordType>;
export const LandlordModel = mongoose.model('Landlords', landlordSchema)