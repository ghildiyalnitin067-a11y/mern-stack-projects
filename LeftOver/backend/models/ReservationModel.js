import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  foodId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  claimCode: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Ready for Pickup', 'Completed', 'Cancelled'],
    default: 'Ready for Pickup'
  }
}, {
  timestamps: true
});

const Reservation = mongoose.models.Reservation || mongoose.model('Reservation', reservationSchema);
export default Reservation;
