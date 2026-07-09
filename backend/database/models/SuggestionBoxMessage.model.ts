import mongoose from 'mongoose';

const suggestionBoxMessageSchema = new mongoose.Schema({
  landlordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Landlords',
    required: true,
    index: true,
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenants',
    required: true,
  },
  message: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  readAt: {
    type: Date,
    default: null,
  },
});

suggestionBoxMessageSchema.index({ landlordId: 1, sentAt: -1 });

export const SuggestionBoxMessageModel = mongoose.model('SuggestionBoxMessages', suggestionBoxMessageSchema);
