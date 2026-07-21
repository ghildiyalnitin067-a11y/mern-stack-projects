import express from 'express'
import {
  getServices, getServiceById, createBooking, getBookings,
  createReview, getReviewsByService, createPaymentIntent, confirmPayment, updateProfile, cancelBooking
} from '../controllers/customerController.js'
import { protect } from '../middleware/authMiddleware.js'
import { authorize } from '../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/services', getServices)
router.get('/services/:id', getServiceById)
router.get('/reviews/service/:id', getReviewsByService)

router.post('/bookings', protect, authorize('customer'), createBooking)
router.get('/bookings', protect, authorize('customer'), getBookings)
router.delete('/bookings/:id', protect, authorize('customer'), cancelBooking)
router.post('/reviews', protect, authorize('customer'), createReview)
router.post('/payments/create-intent', protect, authorize('customer'), createPaymentIntent)
router.post('/payments/confirm', protect, authorize('customer'), confirmPayment)
router.post('/profile', protect, authorize('customer'), updateProfile)

export default router
