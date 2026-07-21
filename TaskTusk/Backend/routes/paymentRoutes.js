import express from 'express'
import { createPayment, confirmPayment, getPaymentByBookingId } from '../controllers/paymentController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)

router.post('/create', createPayment)
router.post('/confirm/:paymentId', confirmPayment)
router.get('/:bookingId', getPaymentByBookingId)

export default router
