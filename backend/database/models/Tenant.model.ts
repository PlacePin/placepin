import mongoose from 'mongoose';

// This is the shape of the tenant database object

const tenantSchema = new mongoose.Schema({
  accountType: String,
  address: String,
  age: Number,
  createdAt: { type: Date, default: Date.now },
  email: {type: String, required: true, unique: true, 
  lowercase: true},
  fullName: String,
  hasAcceptedDisclaimer: Boolean,
  landlordReferral: String,
  password: {type: String, required: true},
  phoneNumber: Number,
  referredByLandlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "landlords",
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

export const TenantModel = mongoose.model('Tenants', tenantSchema)