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
  hasAcceptedPrivacyPolicy: Boolean,
  landlordReferral: String,
  lastActive: { type: Date, default: null },
  password: { type: String, required: true },
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
  subscription: {
    isSubscribed: { type: Boolean, default: false },
    savedPaymentMethod: { type: String, default: null },
    stripeCustomerId: { type: String, default: null },
    tier: { type: String, default: "free" },
  },
  username: { type: String, required: true },
})

// This is the type as a js object
export type TenantType = InferSchemaType<typeof tenantSchema>;

// This is the type as a mongoose document
export type TenantDocumentType = HydratedDocument<TenantType>;
export const TenantModel = mongoose.model('Tenants', tenantSchema)