import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, CreditCard, Calendar, Clock, MapPin, User, ChevronRight, CheckCircle, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { apiFetch } from '../../api'
import './MockCheckoutPage.css'

const MockCheckoutPage = ({ user }) => {
  const { bookingId } = useParams()
  const navigate = useNavigate()

  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paymentStatus, setPaymentStatus] = useState('idle')
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const res = await apiFetch('/api/customer/bookings')
        if (res.ok) {
          const bookings = await res.json()
          const matched = bookings.find(b => b._id === bookingId)
          if (matched) {
            setBooking(matched)

            setCardName(user.name || '')
          } else {
            toast.error('Booking not found')
            navigate('/customer/dashboard')
          }
        } else {
          toast.error('Failed to retrieve bookings')
        }
      } catch (err) {
        console.error(err)
        toast.error('Connection error fetching booking details')
      } finally {
        setLoading(false)
      }
    }

    if (bookingId) {
      fetchBookingDetails()
    }
  }, [bookingId, navigate, user])

  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16)
    val = val.replace(/(\d{4})/g, '$1 ').trim()
    setCardNumber(val)
  }

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4)
    if (val.length >= 3) {
      val = `${val.substring(0, 2)}/${val.substring(2, 4)}`
    }
    setCardExpiry(val)
  }

  const handleCvvChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').substring(0, 3)
    setCardCvv(val)
  }

  const handleSimulatePayment = async (e) => {
    e.preventDefault()
    if (!booking) return

    setPaymentStatus('creating')
    const toastId = toast.loading('Initiating secure payment simulation...')

    try {

      const createRes = await apiFetch('/api/payments/create', {
        method: 'POST',
        body: JSON.stringify({ bookingId: booking._id })
      })

      if (!createRes.ok) {
        const errorData = await createRes.json()
        throw new Error(errorData.error || 'Failed to create payment intent')
      }

      const paymentData = await createRes.json()
      const paymentId = paymentData.paymentId

      setPaymentStatus('processing')
      toast.loading('Processing payment through mock gateway (1.5s delay)...', { id: toastId })


      const confirmRes = await apiFetch(`/api/payments/confirm/${paymentId}`, {
        method: 'POST'
      })

      if (!confirmRes.ok) {
        const errorData = await confirmRes.json()
        throw new Error(errorData.error || 'Mock transaction declined')
      }

      toast.success('Mock payment successful! Revenue split executed.', { id: toastId })
      setPaymentStatus('success')


      setTimeout(() => {
        navigate('/customer/dashboard')
      }, 2500)

    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Payment simulation failed', { id: toastId })
      setPaymentStatus('error')
    }
  }

  if (loading) {
    return (
      <div className="checkout-loading-screen">
        <div className="spinner"></div>
        <p>Loading booking summary...</p>
      </div>
    )
  }

  if (!booking) return null

  return (
    <div className="checkout-page-container">
      <div className="checkout-back-link">
        <button onClick={() => navigate('/customer/dashboard')} className="back-btn">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      </div>

      <div className="checkout-grid">

        <div className="checkout-summary-card">
          <div className="summary-card-header">
            <h2>Booking Summary</h2>
            <span className="secure-badge">
              <ShieldCheck size={14} /> 256-bit Encryption
            </span>
          </div>

          <div className="summary-card-body">
            <div className="service-header-info">
              <h3 className="summary-title">{booking.providerProfession}</h3>
              <p className="summary-subtitle">Provider: <strong>{booking.providerName}</strong></p>
            </div>

            <hr className="summary-divider" />

            <div className="booking-meta-details">
              <div className="meta-item">
                <Calendar size={16} className="meta-icon" />
                <div>
                  <span className="meta-label">Service Date</span>
                  <span className="meta-value">{booking.date}</span>
                </div>
              </div>

              <div className="meta-item">
                <Clock size={16} className="meta-icon" />
                <div>
                  <span className="meta-label">Scheduled Time Slot</span>
                  <span className="meta-value">{booking.timeSlot}</span>
                </div>
              </div>

              <div className="meta-item">
                <MapPin size={16} className="meta-icon" />
                <div>
                  <span className="meta-label">Location Address</span>
                  <span className="meta-value">{booking.customerAddress}</span>
                </div>
              </div>
            </div>

            <hr className="summary-divider" />

            <div className="total-calculation-row">
              <div className="split-explanation">
                <span>Subtotal</span>
                <span>₹{booking.price}</span>
              </div>
              <div className="split-explanation pt-1">
                <span>Platform Payout Split (Mocking 30/70)</span>
                <span>₹{(booking.price * 0.30).toFixed(0)} Admin Fee + ₹{(booking.price * 0.70).toFixed(0)} Provider</span>
              </div>
              <div className="grand-total-row">
                <span>Grand Total</span>
                <span className="total-price">₹{booking.price}</span>
              </div>
            </div>
          </div>
        </div>


        <div className="checkout-payment-portal">
          <AnimatePresence mode="wait">
            {paymentStatus === 'success' ? (
              <motion.div
                className="success-state-container"
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="success-animation-wrapper">
                  <CheckCircle size={72} className="success-checkmark-icon" />
                </div>
                <h2>Payment Successful!</h2>
                <p>₹{booking.price} paid successfully to TaskTusk platform.</p>
                <p className="subtext-alert">A 30% split (₹{(booking.price * 0.30).toFixed(2)}) has been credited to Admin, and 70% (₹{(booking.price * 0.70).toFixed(2)}) to {booking.providerName}.</p>
                <div className="loader-bar-wrapper">
                  <div className="loader-bar-fill"></div>
                </div>
                <p className="redirecting-text">Redirecting to Dashboard...</p>
              </motion.div>
            ) : (
              <motion.div
                className="payment-form-wrapper"
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="payment-form-header">
                  <h3>Select Payment Method</h3>
                  <div className="payment-logos">
                    <span className="mock-logo-badge">MOCK GATEWAY</span>
                  </div>
                </div>

                <form onSubmit={handleSimulatePayment} className="mock-card-form">
                  <div className="form-group-field">
                    <label>Cardholder Name</label>
                    <div className="input-with-icon">
                      <User size={16} className="input-field-icon" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Verma"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        disabled={paymentStatus === 'creating' || paymentStatus === 'processing'}
                      />
                    </div>
                  </div>

                  <div className="form-group-field">
                    <label>Card Number</label>
                    <div className="input-with-icon">
                      <CreditCard size={16} className="input-field-icon" />
                      <input
                        type="text"
                        required
                        placeholder="4242 4242 4242 4242"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        disabled={paymentStatus === 'creating' || paymentStatus === 'processing'}
                      />
                    </div>
                  </div>

                  <div className="form-grid-row">
                    <div className="form-group-field">
                      <label>Expiration Date</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        disabled={paymentStatus === 'creating' || paymentStatus === 'processing'}
                      />
                    </div>
                    <div className="form-group-field">
                      <label>CVV / CVC</label>
                      <input
                        type="password"
                        required
                        placeholder="•••"
                        value={cardCvv}
                        onChange={handleCvvChange}
                        disabled={paymentStatus === 'creating' || paymentStatus === 'processing'}
                      />
                    </div>
                  </div>

                  <div className="mock-sandbox-notice">
                    <strong>DEVELOPMENT SANDBOX:</strong> You can enter any mock card credentials to proceed. No actual funds will be charged.
                  </div>

                  <button
                    type="submit"
                    className="payment-action-submit-btn"
                    disabled={paymentStatus === 'creating' || paymentStatus === 'processing' || cardNumber.length < 19 || cardExpiry.length < 5 || cardCvv.length < 3}
                  >
                    {paymentStatus === 'creating' || paymentStatus === 'processing' ? (
                      <span className="processing-loader-indicator">
                        <span className="spinner-mini"></span> Processing Simulation...
                      </span>
                    ) : (
                      `Simulate Payment • ₹${booking.price}`
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default MockCheckoutPage
