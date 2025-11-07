import mongoose, { type InferSchemaType, type HydratedDocument } from 'mongoose';
import { generateReferralCode } from '../../utils/generateReferralCode';

// This is the shape of the landlord database object

const landlordSchema = new mongoose.Schema({
  accountType: String,
  address: {
    number: String,
    street: String,
    streetType: String,
    unit: { type: String, default: undefined },
    city: String,
    state: String,
    zip: String
  },
  createdAt: { type: Date, default: Date.now },
  dateOfBirth: Number,
  email: { type: String, required: true, unique: true, lowercase: true },
  fullName: String,
  gender: String,
  hasAcceptedPrivacyPolicy: Boolean,
  lastActive: { type: Date, default: null },
  password: { type: String, required: true },
  phoneNumber: Number,
  properties: [
    {
      name: String,
      address: {
        _id: false,
        type: {
          number: String,
          street: String,
          streetType: String,
          unit: { type: String, default: undefined },
          city: String,
          state: String,
          zip: String
        },
        required: true
      },
      referralCode: { type: String, default: generateReferralCode },
      numberOfUnits: Number,
      tenants: [
        {
          _id: false,
          tenantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tenants",
          },
          rentAmount: Number,
          monthPaid: { type: Boolean, default: false },
          referred: Boolean,
        },
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

// This is the type as a js object
export type LandlordType = InferSchemaType<typeof landlordSchema>;

// This is the type as a mongoose document
export type LandlordDocumentType = HydratedDocument<LandlordType>;
export const LandlordModel = mongoose.model('Landlords', landlordSchema)