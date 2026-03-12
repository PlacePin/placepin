import mongoose, { type InferSchemaType, type HydratedDocument } from 'mongoose';

// This is the shape of the workorders collection object

const workOrderSchema = new mongoose.Schema({
  landlordId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Landlords', 
    required: true 
  },
  propertyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  date: { type: Date, required: true, default: Date.now },
  amountPrice: { type: Number, required: true },
  repairDescription: { type: String, required: true },
  tradesmanType: { type: String, required: true }, 
  status: { 
    type: String, 
    enum: ['pending', 'in_progress', 'completed'], 
    default: 'pending' 
  },
});

export type WorkOrderType = InferSchemaType<typeof workOrderSchema>;
export type WorkOrderDocumentType = HydratedDocument<WorkOrderType>;
export const WorkOrderModel = mongoose.model('WorkOrders', workOrderSchema);