import express from 'express'
import {
  updateProfile, getBookings, updateBookingStatus, markNotificationsRead,
  createService, updateService, deleteService, getServices
} from '../controllers/providerController.js'
import { protect } from '../middleware/authMiddleware.js'
import { authorize } from '../middleware/roleMiddleware.js'

const router = express.Router()

router.use(protect)
router.use(authorize('provider'))

router.post('/profile', updateProfile)
router.get('/bookings', getBookings)
router.patch('/bookings/:id/status', updateBookingStatus)
router.patch('/bookings/read', markNotificationsRead)

router.get('/services', getServices)
router.post('/services', createService)
router.put('/services/:id', updateService)
router.delete('/services/:id', deleteService)

export default router
