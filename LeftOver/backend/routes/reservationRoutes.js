import express from 'express';
import { createReservation, getUserReservations, cancelReservation } from '../controllers/reservationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createReservation);
router.get('/user', getUserReservations);
router.post('/cancel/:id', cancelReservation);

export default router;
