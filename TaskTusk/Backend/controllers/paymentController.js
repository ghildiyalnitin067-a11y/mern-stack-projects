import { Payment } from '../models/Payment.js'
import { Booking } from '../models/Booking.js'
import { User } from '../models/User.js'
import { getIO } from '../socket.js'


export const createPaymentRecord = async (bookingId, customerId) => {
  const booking = await Booking.findById(bookingId)
  if (!booking) {
    throw new Error('Booking not found')
  }


  if (booking.customerId !== customerId) {
    throw new Error('Forbidden: Customer mismatch')
  }


  const totalAmount = booking.price
  if (!totalAmount || totalAmount <= 0) {
    throw new Error('Invalid booking price')
  }


  const platformFeeAmount = parseFloat((totalAmount * 0.30).toFixed(2))
  const providerPayoutAmount = parseFloat((totalAmount * 0.70).toFixed(2))


  const payment = await Payment.create({
    bookingId,
    customerId,
    providerId: booking.providerId,
    totalAmount,
    platformFeeAmount,
    providerPayoutAmount,
    status: 'pending',
    method: 'mock'
  })

  return payment
}


export const processPayment = async (paymentId) => {
  const payment = await Payment.findById(paymentId)
  if (!payment) {
    throw new Error('Payment record not found')
  }

  if (payment.status === 'completed') {
    throw new Error('Payment is already completed')
  }


  const updatedPayment = await Payment.findByIdAndUpdate(paymentId, {
    status: 'completed'
  })


  const updatedBooking = await Booking.findByIdAndUpdate(payment.bookingId, {
    paymentStatus: 'paid',
    status: 'accepted',
    adminFee: payment.platformFeeAmount,
    providerEarnings: payment.providerPayoutAmount
  })


  const provider = await User.findById(payment.providerId)
  if (provider) {
    const newWallet = (provider.walletBalance || 0) + payment.providerPayoutAmount
    const newEarnings = (provider.totalEarnings || 0) + payment.providerPayoutAmount
    await User.findByIdAndUpdate(payment.providerId, {
      walletBalance: newWallet,
      totalEarnings: newEarnings
    })
  }


  const admin = await User.findOne({ role: 'admin' })
  if (admin) {
    const newAdminWallet = (admin.walletBalance || 0) + payment.platformFeeAmount
    const newAdminEarnings = (admin.totalEarnings || 0) + payment.platformFeeAmount
    await User.findByIdAndUpdate(admin._id, {
      walletBalance: newAdminWallet,
      totalEarnings: newAdminEarnings
    })
  }


  try {
    const io = getIO()
    io.to(payment.providerId).emit('payment_confirmed', {
      message: 'New paid booking confirmed!',
      bookingId: payment.bookingId,
      paymentId: payment._id,
      totalAmount: payment.totalAmount,
      providerPayoutAmount: payment.providerPayoutAmount
    })
  } catch (socketError) {
    console.error('Failed to emit Socket.io event:', socketError.message)
  }

  return { payment: updatedPayment, booking: updatedBooking }
}


export const createPayment = async (req, res) => {
  try {
    const { bookingId } = req.body
    if (!bookingId) {
      return res.status(400).json({ error: 'bookingId is required' })
    }

    const payment = await createPaymentRecord(bookingId, req.user._id.toString())
    res.status(201).json({
      message: 'Mock payment created successfully',
      paymentId: payment._id,
      totalAmount: payment.totalAmount
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}


export const confirmPayment = async (req, res) => {
  try {
    const { paymentId } = req.params

    if (!paymentId) {
      return res.status(400).json({ error: 'paymentId is required' })
    }


    await new Promise((resolve) => setTimeout(resolve, 1500))

    const result = await processPayment(paymentId)

    res.json({
      success: true,
      message: 'Mock payment confirmed and revenue split successfully processed',
      data: result
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}


export const getPaymentByBookingId = async (req, res) => {
  try {
    const { bookingId } = req.params
    const payment = await Payment.findOne({ bookingId })
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found for this booking' })
    }
    res.json(payment)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
