import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  foodId: {
    type: String,
    required: true
  },
  foodTitle: {
    type: String,
    required: true
  },
  donorName: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  submittedBy: {
    type: String,
    default: 'Community Rescuer'
  },
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Resolved', 'Dismissed'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);
export default Report;
