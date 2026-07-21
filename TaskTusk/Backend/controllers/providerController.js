import { Service } from '../models/Service.js'
import { Booking } from '../models/Booking.js'
import { User } from '../models/User.js'

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, city, pincode } = req.body

    if (!name || !phone || !address) {
      return res.status(400).json({ error: 'Missing required profile fields' })
    }

    const updated = await User.findByIdAndUpdate(req.user._id, {
      name, phone, address, city: city || '', pincode: pincode || ''
    })


    const services = await Service.find({ providerId: req.user._id.toString() })
    for (let s of services) {
      await Service.findByIdAndUpdate(s._id, { providerName: name })
    }

    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Failed to save provider profile: ' + error.message })
  }
}

export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ providerId: req.user._id.toString() })
    res.json(bookings)
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve provider bookings' })
  }
}

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body
    if (!['pending', 'accepted', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid booking status option' })
    }

    const booking = await Booking.findById(req.params.id)
    if (!booking) {
      return res.status(404).json({ error: 'Booking transaction not found' })
    }

    if (booking.providerId !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Forbidden: You do not own this service transaction' })
    }


    if (status === 'completed' && booking.paymentStatus !== 'paid') {
      return res.status(400).json({
        error: 'Cannot mark task as completed. Customer has not yet made the payment for this booking.'
      })
    }

    const updated = await Booking.findByIdAndUpdate(req.params.id, { status })
    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update booking status' })
  }
}

export const markNotificationsRead = async (req, res) => {
  try {
    await Booking.updateMany(
      { providerId: req.user._id.toString(), notificationStatus: 'unread' },
      { notificationStatus: 'read' }
    )
    res.json({ success: true, message: 'All notifications marked as read' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notifications read status' })
  }
}

export const createService = async (req, res) => {
  try {
    const { title, category, price, description, image } = req.body

    if (!title || !category || !price) {
      return res.status(400).json({ error: 'Title, category, and price are required fields' })
    }

    const service = await Service.create({
      providerId: req.user._id.toString(),
      providerName: req.user.name,
      title,
      category,
      price: Number(price),
      description: description || '',
      image: image || ''
    })

    res.status(201).json(service)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create listing: ' + error.message })
  }
}

export const updateService = async (req, res) => {
  try {
    const { title, category, price, description, image } = req.body

    let service = await Service.findById(req.params.id)
    if (!service) {
      return res.status(404).json({ error: 'Service listing not found' })
    }

    if (service.providerId !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Forbidden: You do not own this service listing' })
    }

    service = await Service.findByIdAndUpdate(req.params.id, {
      title, category, price: Number(price), description, image
    })

    res.json(service)
  } catch (error) {
    res.status(500).json({ error: 'Failed to edit service listing' })
  }
}

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
    if (!service) {
      return res.status(404).json({ error: 'Service listing not found' })
    }

    if (service.providerId !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Forbidden: You do not own this service listing' })
    }

    await Service.findByIdAndDelete(req.params.id)
    res.json({ message: 'Service listing deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete service listing' })
  }
}

export const getServices = async (req, res) => {
  try {
    const services = await Service.find({ providerId: req.user._id.toString() })
    res.json(services)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services list' })
  }
}
