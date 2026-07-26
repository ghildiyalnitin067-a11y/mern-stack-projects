import { isConnectedToMongo } from '../config/db.js';
import Reservation from '../models/ReservationModel.js';

let mockReservations = [
  {
    id: 'res-1',
    foodId: 'food-1',
    userId: 'user-1',
    claimCode: '#LO-FD1',
    status: 'Ready for Pickup',
    createdAt: new Date().toISOString()
  }
];

// @desc Create new food reservation
// @route POST /api/reservations
export const createReservation = async (req, res) => {
  try {
    const { foodId } = req.body;
    const userId = req.user?.id || 'user-1';

    if (!foodId) {
      return res.status(400).json({ success: false, message: 'foodId is required.' });
    }

    const claimCode = `#LO-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    if (isConnectedToMongo) {
      const reservation = await Reservation.create({
        foodId,
        userId,
        claimCode,
        status: 'Ready for Pickup'
      });
      return res.status(201).json({ success: true, data: reservation });
    } else {
      const newRes = {
        id: `res-${Date.now()}`,
        foodId,
        userId,
        claimCode,
        status: 'Ready for Pickup',
        createdAt: new Date().toISOString()
      };
      mockReservations.push(newRes);
      return res.status(201).json({ success: true, data: newRes });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get user reservations
// @route GET /api/reservations/user
export const getUserReservations = async (req, res) => {
  try {
    const userId = req.user?.id || 'user-1';
    if (isConnectedToMongo) {
      const userRes = await Reservation.find({ userId });
      return res.json({ success: true, data: userRes });
    } else {
      const userRes = mockReservations.filter(r => r.userId === userId);
      return res.json({ success: true, data: userRes });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Cancel reservation
// @route POST /api/reservations/cancel/:id
export const cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    if (isConnectedToMongo) {
      await Reservation.findByIdAndDelete(id);
    } else {
      mockReservations = mockReservations.filter(r => r.id !== id && r.foodId !== id);
    }
    res.json({ success: true, message: 'Reservation cancelled.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
