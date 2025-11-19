import mongoose from 'mongoose';

const contributionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    enum: ['monetary', 'time', 'resource'],
    required: true
  },
  payment_status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  transaction_code: {
    type: String,
    default: ''
  },
  payment_method: {
    type: String,
    default: 'manual_mpesa'
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes for better query performance
contributionSchema.index({ user_id: 1 });
contributionSchema.index({ project_id: 1 });

export default mongoose.model('Contribution', contributionSchema);