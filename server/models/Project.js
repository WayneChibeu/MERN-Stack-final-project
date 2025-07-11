import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  sdg_id: {
    type: Number,
    required: true,
    min: 1,
    max: 17
  },
  creator_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  target_amount: {
    type: Number,
    default: 0
  },
  current_amount: {
    type: Number,
    default: 0
  },
  image_url: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for better query performance
projectSchema.index({ sdg_id: 1 });
projectSchema.index({ creator_id: 1 });
projectSchema.index({ status: 1 });

export default mongoose.model('Project', projectSchema);