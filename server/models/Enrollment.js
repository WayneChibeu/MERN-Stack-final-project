import mongoose from 'mongoose';

const EnrollmentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  enrollment_date: {
    type: Date,
    default: Date.now
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
  completion_date: {
    type: Date,
    default: null
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completed_lessons: {
    type: Number,
    default: 0
  },
  total_lessons: {
    type: Number,
    default: 0
  },
  grade: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'dropped'],
    default: 'active'
  },
  time_spent: {
    type: Number,
    default: 0 // in minutes
  },
  last_accessed: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound unique index to prevent duplicate enrollments
EnrollmentSchema.index({ user_id: 1, course_id: 1 }, { unique: true });

const Enrollment = mongoose.model('Enrollment', EnrollmentSchema);
export default Enrollment;
