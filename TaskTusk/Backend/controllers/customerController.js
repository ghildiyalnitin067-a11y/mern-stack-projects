import { Service } from '../models/Service.js'
import { Booking } from '../models/Booking.js'
import { Review } from '../models/Review.js'
import { User } from '../models/User.js'

export const getServices = async (req, res) => {
  try {
    const { q, category } = req.query
    let services = await Service.find()

    if (category && category !== 'All') {
      services = services.filter(s => s.category.toLowerCase() === category.toLowerCase())
    }

    if (q) {
      const queryStr = q.toLowerCase()
      services = services.filter(s =>
        s.title.toLowerCase().includes(queryStr) ||
        s.description.toLowerCase().includes(queryStr) ||
        s.providerName.toLowerCase().includes(queryStr)
      )
    }

    res.json(services)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services: ' + error.message })
  }
}

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
    if (!service) {
      return res.status(404).json({ error: 'Service listing not found' })
    }

    const provider = await User.findById(service.providerId)
    const rating = provider ? (provider.rating || 5.0) : 5.0
    const reviewsCount = provider ? (provider.reviewsCount || 0) : 0

    res.json({ ...service, rating, reviewsCount })
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve service' })
  }
}

export const createBooking = async (req, res) => {
  try {
    const { serviceId, date, timeSlot } = req.body

    if (!serviceId || !date || !timeSlot) {
      return res.status(400).json({ error: 'Service, date, and time slot are required' })
    }

    const service = await Service.findById(serviceId)
    if (!service) {
      return res.status(404).json({ error: 'Service listing not found' })
    }

    const booking = await Booking.create({
      customerId: req.user._id,
      customerName: req.user.name,
      customerPhone: req.user.phone || '+91 99999 99999',
      customerAddress: req.user.address || 'Registered Location Address',
      providerId: service.providerId,
      providerName: service.providerName,
      providerProfession: service.category,
      serviceId: service._id,
      price: service.price,
      date,
      timeSlot,
      status: 'pending',
      paymentStatus: 'pending',
      notificationStatus: 'unread'
    })

    res.status(201).json(booking)
  } catch (error) {
    res.status(500).json({ error: 'Failed to book service: ' + error.message })
  }
}

export const getBookings = async (req, res) => {
  try {
    const customerId = req.user._id.toString()
    const bookings = await Booking.find({ customerId })
    const reviews = await Review.find({ customerId })
    const reviewedBookingIds = new Set(reviews.map(r => r.bookingId))

    const bookingsWithReviewed = bookings.map(b => {

      const bObj = b.toObject ? b.toObject() : { ...b }
      return {
        ...bObj,
        reviewed: reviewedBookingIds.has(b._id)
      }
    })

    res.json(bookingsWithReviewed)
  } catch (error) {
    console.error('Failed to load bookings:', error)
    res.status(500).json({ error: 'Failed to load bookings' })
  }
}

export const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body

    if (!bookingId || !rating) {
      return res.status(400).json({ error: 'Booking ID and star rating are required' })
    }

    const booking = await Booking.findById(bookingId)
    if (!booking) {
      return res.status(404).json({ error: 'Associated booking not found' })
    }

    if (booking.customerId !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Forbidden: Account mismatch' })
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ error: 'Forbidden: You cannot review a service until the task is completed' })
    }

    const existingReviews = await Review.find({ bookingId })
    if (existingReviews && existingReviews.length > 0) {
      return res.status(400).json({ error: 'You have already submitted a review for this service booking' })
    }

    const review = await Review.create({
      bookingId,
      customerId: req.user._id,
      customerName: req.user.name,
      rating: Number(rating),
      comment: comment || '',
      serviceId: booking.serviceId
    })

    res.status(201).json(review)
  } catch (error) {
    res.status(500).json({ error: 'Review submission failed: ' + error.message })
  }
}

export const getReviewsByService = async (req, res) => {
  try {
    const reviews = await Review.find({ serviceId: req.params.id })
    res.json(reviews)
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve reviews' })
  }
}

export const createPaymentIntent = async (req, res) => {
  try {
    const { bookingId } = req.body
    const booking = await Booking.findById(bookingId)
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    if (booking.customerId !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Forbidden: Customer mismatch' })
    }

    res.json({
      clientSecret: `pi_mock_intent_${bookingId}_${Date.now()}`,
      amount: booking.price,
      currency: 'INR'
    })
  } catch (error) {
    res.status(500).json({ error: 'Payment intent failed: ' + error.message })
  }
}

export const confirmPayment = async (req, res) => {
  try {
    const { bookingId } = req.body
    const booking = await Booking.findById(bookingId)
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ error: 'Booking is already paid' })
    }


    const price = booking.price || 0
    const adminFee = parseFloat((price * 0.30).toFixed(2))
    const providerEarnings = parseFloat((price * 0.70).toFixed(2))


    await Booking.findByIdAndUpdate(bookingId, {
      paymentStatus: 'paid',
      status: 'accepted',
      adminFee,
      providerEarnings
    })


    const provider = await User.findById(booking.providerId)
    if (provider) {
      const newWallet = (provider.walletBalance || 0) + providerEarnings
      const newEarnings = (provider.totalEarnings || 0) + providerEarnings
      await User.findByIdAndUpdate(booking.providerId, {
        walletBalance: newWallet,
        totalEarnings: newEarnings
      })
    }



    const admin = await User.findOne({ role: 'admin' })
    if (admin) {
      const newAdminWallet = (admin.walletBalance || 0) + adminFee
      const newAdminEarnings = (admin.totalEarnings || 0) + adminFee
      await User.findByIdAndUpdate(admin._id, {
        walletBalance: newAdminWallet,
        totalEarnings: newAdminEarnings
      })
    }

    res.json({ success: true, message: 'Payment simulated successfully and split 30/70.' })
  } catch (error) {
    res.status(500).json({ error: 'Payment confirmation failed' })
  }
}

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    if (booking.customerId !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Forbidden: You do not own this booking' })
    }


    if (!['pending'].includes(booking.status)) {
      return res.status(400).json({ error: 'Booking cannot be cancelled once it has been accepted or paid. Contact support.' })
    }

    await Booking.findByIdAndUpdate(req.params.id, { status: 'rejected' })
    res.json({ success: true, message: 'Booking cancelled successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel booking: ' + error.message })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { phone, address } = req.body
    const updated = await User.findByIdAndUpdate(req.user._id, { phone, address })
    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings profile' })
  }
}
