import { User } from '../models/User.js'
import { Booking } from '../models/Booking.js'
import { Payment } from '../models/Payment.js'

export const getAdminRevenue = async (req, res) => {
  try {
    const completedPayments = await Payment.find({ status: 'completed' })
    const totalPlatformRevenue = completedPayments.reduce((sum, p) => sum + (p.platformFeeAmount || 0), 0)
    const totalProviderPayouts = completedPayments.reduce((sum, p) => sum + (p.providerPayoutAmount || 0), 0)

    res.json({
      totalPlatformRevenue: parseFloat(totalPlatformRevenue.toFixed(2)),
      totalProviderPayouts: parseFloat(totalProviderPayouts.toFixed(2)),
      paymentCount: completedPayments.length
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to aggregate revenue statistics: ' + error.message })
  }
}

export const getAnalytics = async (req, res) => {
  try {
    const users = await User.find()
    const bookings = await Booking.find()

    const customersCount = users.filter(u => u.role === 'customer').length
    const providersCount = users.filter(u => u.role === 'provider').length
    const completedTasks = bookings.filter(b => b.status === 'completed').length
    const activeTasks = bookings.filter(b => b.status === 'accepted').length

    const platformRevenue = bookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + (b.adminFee || 0), 0)

    res.json({
      totalCustomers: customersCount,
      totalProviders: providersCount,
      totalBookings: bookings.length,
      completedTasks,
      activeTasks,
      totalRevenue: platformRevenue
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to aggregate admin statistics' })
  }
}

export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve accounts directory' })
  }
}

export const toggleSuspension = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ error: 'Account not found' })
    }

    if (user.role === 'admin') {
      return res.status(400).json({ error: 'Platform security violation: Cannot suspend another administrator' })
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      isSuspended: !user.isSuspended
    })

    res.json({
      success: true,
      message: `User ${updatedUser.name} has been ${!user.isSuspended ? 'SUSPENDED' : 'UNSUSPENDED'}`
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to modify account state' })
  }
}

export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
    res.json(bookings)
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve all bookings' })
  }
}

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body
    const updated = await Booking.findByIdAndUpdate(req.params.id, { status })
    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update booking status' })
  }
}

