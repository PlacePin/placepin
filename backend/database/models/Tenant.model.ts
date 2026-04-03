import mongoose, { type HydratedDocument, type InferSchemaType } from 'mongoose';

// This is the shape of the tenant database object

const tenantSchema = new mongoose.Schema({
  accountType: String,
  address: {
    street: String,
    unit: { type: String, default: undefined },
    city: String,
    state: String,
    zip: String
  },
  age: { type: Date, default: null },
  career: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  dateOfBirth: Number,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  fullName: String,
  gender: String,
  governmentAssistance: {
    type: String,
    enum: ['none', 'section8', 'voucher', 'subsidized', 'other'],
    default: 'none'
  },
  hasAcceptedPrivacyPolicy: Boolean,
  income: { type: Number, default: 0 },
  landlordReferral: String,
  lastActive: { type: Date, default: null },
  maintenanceRequest: {
    electrician: { type: Number, default: 0 },
    plumber: { type: Number, default: 0 },
    carpenter: { type: Number, default: 0 },
    other: { type: Number, default: 0 },
  },
  password: { type: String, required: true },
  passwordReset: {
    token: { type: String, default: null },
    expires: { type: Date, default: null },
  },
  perkPatterns: {
    food: [{
      month: { type: Number, required: true },
      year: { type: Number, required: true },
      count: { type: Number, default: 0 }
    }],
    laundry: [{
      month: { type: Number, required: true },
      year: { type: Number, required: true },
      count: { type: Number, default: 0 }
    }],
    housekeeping: [{
      month: { type: Number, required: true },
      year: { type: Number, required: true },
      count: { type: Number, default: 0 }
    }],
    other: [{
      month: { type: Number, required: true },
      year: { type: Number, required: true },
      count: { type: Number, default: 0 }
    }]
  },
  phoneNumber: Number,
  profilePic: {
    type: String,
    default: "",
  },
  referredByLandlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Landlords",
    default: null,
  },
  rentPayment: [
    {
      _id: false,
      rentAmount: Number,
      monthPaid: Date,
      rentDue: Date,
    }
  ],
  subscription: {
    isSubscribed: { type: Boolean, default: false },
    savedPaymentMethod: { type: String, default: null },
    stripeCustomerId: { type: String, default: null },
    tier: { type: String, default: "Landlord-Sponsored" },
    stripeSubscriptionId: { type: String, default: null },
  },
  username: { type: String, required: true },
})

// This is the type as a js object
export type TenantType = InferSchemaType<typeof tenantSchema>;

// This is the type as a mongoose document
export type TenantDocumentType = HydratedDocument<TenantType>;
export const TenantModel = mongoose.model('Tenants', tenantSchema)