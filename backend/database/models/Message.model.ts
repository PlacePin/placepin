import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'participantsModel',
    required: true,
  },
  content: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
}, { _id: false });

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
    enum: ['Landlords', 'Tenants'],
  },
  messages: [messageSchema],
  lastUpdated: { type: Date, default: Date.now },
});

export const DirectMessageModel = mongoose.model('DirectMessages', directMessageSchema);
