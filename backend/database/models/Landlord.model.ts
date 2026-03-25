import mongoose, { type InferSchemaType, type HydratedDocument } from 'mongoose';
import { generateReferralCode } from '../../utils/generateReferralCode';

// This is the shape of the landlord collection object

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
  passwordReset: {
    token: { type: String, default: null },
    expires: { type: Date, default: null },
  },
  phoneNumber: Number,
  profilePic: {
    type: String,
    default: "",
  },
  properties: [
    {
      name: String,
      address: {
        _id: false,
        type: {
          street: String,
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
          rentAmountExpected: { type: Number, default: 0 },
          monthPaid: { type: Boolean, default: false },
          referred: Boolean,
          moveInDate: { type: Date, required: true },
          expenses: { type: Number, default: 0 },
          rentAmountPaid: { type: Number, default: 0 },
        },
      ],
      propertyDetails: {
        lotSize: Number,
        trashPickup: String,
        electricianLastUpdate: Date,
        boilerLastUpdated: Date,
        closestPublicCommutes: String,
        averageUnitSize: Number,
        financials: {
          outstandingPrincipal: Number,
          mortgage: Number,
          interestRate: Number,
          projectedEquity: Number
        }
      }
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