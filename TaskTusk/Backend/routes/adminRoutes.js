import express from 'express'
import { getAnalytics, getUsers, toggleSuspension, getBookings, updateBookingStatus, getAdminRevenue } from '../controllers/adminController.js'
import { protect } from '../middleware/authMiddleware.js'
import { authorize } from '../middleware/roleMiddleware.js'

const router = express.Router()

router.use(protect)
router.use(authorize('admin'))

router.get('/analytics', getAnalytics)
router.get('/revenue', getAdminRevenue)
router.get('/users', getUsers)
router.patch('/users/:id/suspend', toggleSuspension)
router.get('/bookings', getBookings)
router.patch('/bookings/:id/status', updateBookingStatus)

export default router
