import mongoose, { type InferSchemaType, type HydratedDocument } from 'mongoose';

// This is the shape of the property collection object

const propertySchema = new mongoose.Schema({
  address: {
    street: String,
    unit: { type: String, default: undefined },
    city: String,
    state: String,
    zip: String
  },
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Landlords',
    required: true
  },
  taxYears: [{
    year: Number,
    receipts: [{
      expenseCategory: String,
      amount: Number,
      date: Date,
      paymentMethod: String,
      description: String,
    }]
  }]
});

// This is the type as a js object
export type PropertyType = InferSchemaType<typeof propertySchema>;

// This is the type as a mongoose document
export type PropertyDocumentType = HydratedDocument<PropertyType>;
export const PropertyModel = mongoose.model('Property', propertySchema)