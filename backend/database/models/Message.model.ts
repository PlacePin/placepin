import mongoose from 'mongoose';

const actionSchema = new mongoose.Schema({
  type: { type: String, required: true },
  payload: { type: Object },
  completed: { type: Boolean, default: false },
}, { _id: false });

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'participantsModel',
    required: true,
  },
  content: { type: String, required: true },
  action: { type: actionSchema, required: false },
  sentAt: { type: Date, default: Date.now },
});

const directMessageSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'participantsModel',
    }
  ],
  participantsModel: {
    type: [String],
    required: true,
    enum: ['Landlords', 'Tenants', 'Tradesmen'],
  },
  messages: [messageSchema],
  lastUpdated: { type: Date, default: Date.now },
});

export const DirectMessageModel = mongoose.model('DirectMessages', directMessageSchema);
