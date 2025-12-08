import mongoose, { type InferSchemaType, type HydratedDocument } from 'mongoose';

// This is the shape of the property collection object

const propertySchema = new mongoose.Schema({

});

// This is the type as a js object
export type PropertyType = InferSchemaType<typeof propertySchema>;

// This is the type as a mongoose document
export type PropertyDocumentType = HydratedDocument<PropertyType>;
export const PropertyModel = mongoose.model('Property', propertySchema)