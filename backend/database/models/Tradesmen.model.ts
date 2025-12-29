import mongoose, { type HydratedDocument, type InferSchemaType } from "mongoose";

// This is the shape of the tradesmen database object

const tradesmenSchema = new mongoose.Schema({
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
  lastActive: { type: Date, default: null },
  password: { type: String, required: true },
  phoneNumber: Number,
  profilePic: {
    type: String,
    default: "",
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
export type TradesmenType = InferSchemaType<typeof tradesmenSchema>

// This is the type as a mongoose document
export type TradesmenDocumentType = HydratedDocument<TradesmenType>;
export const TradesmenModel = mongoose.model('Tradesmen', tradesmenSchema)