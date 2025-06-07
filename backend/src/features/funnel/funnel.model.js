import mongoose from 'mongoose';

const FunnelStepSchema = new mongoose.Schema({
  type: { type: String, enum: ['url', 'event'], required: true },
  value: { type: String, required: true },
});

const FunnelSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
  websiteName: { type: String, required: true },
  funnelName: { type: String, required: true },
  steps: { type: [FunnelStepSchema], required: true, validate: v => Array.isArray(v) && v.length > 0 && v.length <= 5 },
}, { timestamps: true });

export const FunnelModel = mongoose.model('Funnel', FunnelSchema); 