import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['Bakery', 'Veggies', 'Cooked', 'Dessert', 'Fruits', 'Dairy'],
    required: true
  },
  distance: {
    type: Number,
    default: 0.5
  },
  expiresIn: {
    type: String,
    required: true
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  donor: {
    name: { type: String, required: true },
    avatar: { type: String },
    rating: { type: Number, default: 4.9 },
    totalDonations: { type: Number, default: 1 }
  },
  images: [{
    type: String
  }],
  dietary: [{
    type: String
  }],
  ingredients: [{
    type: String
  }],
  allergenNote: {
    type: String
  },
  description: {
    type: String,
    required: true
  },
  pickupWindow: {
    type: String,
    required: true
  },
  pickupInstructions: {
    type: String
  },
  address: {
    type: String,
    required: true
  },
  lat: { type: Number, default: 47.606209 },
  lng: { type: Number, default: -122.332071 },
  status: {
    type: String,
    enum: ['Available', 'Reserved', 'Collected'],
    default: 'Available'
  }
}, {
  timestamps: true
});

const Food = mongoose.models.Food || mongoose.model('Food', foodSchema);
export default Food;
