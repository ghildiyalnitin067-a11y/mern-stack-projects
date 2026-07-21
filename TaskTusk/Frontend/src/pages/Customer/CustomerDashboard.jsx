import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, Clock, MapPin, CreditCard, ShieldCheck, Star,
  AlertCircle, ChevronRight, X, Phone, User, XCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import { apiFetch } from '../../api'
import PaymentStatusBadge from '../../components/PaymentStatusBadge/PaymentStatusBadge'
import './CustomerDashboard.css'

const CustomerDashboard = ({ user }) => {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)


  const [phone, setPhone] = useState(user.phone || '')
  const [address, setAddress] = useState(user.address || '')
  const [savingProfile, setSavingProfile] = useState(false)


  const [activeReviewBooking, setActiveReviewBooking] = useState(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  const fetchBookings = async () => {
    try {
      const res = await apiFetch('/api/customer/bookings')
      if (res.ok) {
        const data = await res.json()
        setBookings(data)
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load bookings log')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()

    const timer = setInterval(fetchBookings, 6000)
    return () => clearInterval(timer)
  }, [])


  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    const toastId = toast.loading('Saving details...')

    try {
      const res = await apiFetch('/api/customer/profile', {
        method: 'POST',
        body: JSON.stringify({ name: user.name, phone, address })
      })

      if (res.ok) {
        toast.success('Service profile details updated! 🚀', { id: toastId })
      } else {
        toast.error('Failed to save profile details', { id: toastId })
      }
    } catch (err) {
      toast.error('Server offline', { id: toastId })
    } finally {
      setSavingProfile(false)
    }
  }


  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return
    const toastId = toast.loading('Cancelling booking...')
    try {
      const res = await apiFetch(`/api/customer/bookings/${bookingId}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        toast.success('Booking cancelled successfully.', { id: toastId })
        fetchBookings()
      } else {
        const err = await res.json()
        toast.error(err.error || 'Failed to cancel booking', { id: toastId })
      }
    } catch (err) {
      toast.error('Connection error', { id: toastId })
    }
  }


  const triggerReviewForm = (booking) => {
    setActiveReviewBooking(booking)
    setRating(5)
    setComment('')
  }


  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    setSubmittingReview(true)
    const toastId = toast.loading('Posting your verification review...')

    try {
      const res = await apiFetch('/api/customer/reviews', {
        method: 'POST',
        body: JSON.stringify({
          bookingId: activeReviewBooking._id,
          rating,
          comment
        })
      })

      if (res.ok) {
        toast.success('Thank you! Review saved on partner listing. ⭐', { id: toastId })

        setBookings(prev => prev.map(b => b._id === activeReviewBooking._id ? { ...b, reviewed: true } : b))
        setActiveReviewBooking(null)
      } else {
        const err = await res.json()
        toast.error(err.error || 'Failed to submit review', { id: toastId })
      }
    } catch (err) {
      toast.error('Error posting review details', { id: toastId })
    } finally {
      setSubmittingReview(false)
    }
  }

  return (
    <div className="customer-portal">

      <section className="portal-banner" aria-label="Customer Banner">
        <div className="portal-banner__container">
          <div className="portal-banner__info">
            <span className="portal-badge">Customer Dashboard</span>
            <h1>Hello, {user.name}!</h1>
            <p>Track your local home service orders, approve pending payments, and review completed work.</p>
          </div>
        </div>
      </section>

      <div className="portal-grid">

        <div className="bookings-tracker">
          <h2>Order History &amp; Tracking</h2>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Syncing booking transactions...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="empty-state">
              <AlertCircle size={28} />
              <p>You have no active orders yet.</p>
              <span>Explore services on our landing page and select a slot to book.</span>
            </div>
          ) : (
            <div className="bookings-cards-list">
              {bookings.map(b => (
                <div key={b._id} className="booking-card">
                  <div className="booking-card__top">
                    <div>
                      <span className={`status-tag ${b.status}`}>{b.status}</span>
                      <PaymentStatusBadge status={b.paymentStatus} />
                      <h3 className="service-title-text">{b.providerProfession}</h3>
                      <p className="provider-name-text">Partner: <strong>{b.providerName}</strong></p>
                    </div>
                    <span className="rate-text">₹{b.price}</span>
                  </div>

                  <div className="booking-card__body">
                    <p className="card-detail-row"><Calendar size={14} /> <strong>Scheduled Date:</strong> {b.date}</p>
                    <p className="card-detail-row"><Clock size={14} /> <strong>Time Frame:</strong> {b.timeSlot}</p>
                    <p className="card-detail-row"><MapPin size={14} /> <strong>Service Location:</strong> {b.customerAddress}</p>
                  </div>


                  <div className="booking-card__actions">
                    {b.status === 'pending' && (
                      <div className="action-row-flex">
                        <span className="action-note info"><Clock size={13} /> Waiting for partner confirmation...</span>
                        <button
                          className="dashboard-action-btn cancel"
                          onClick={() => handleCancelBooking(b._id)}
                          title="Cancel this booking"
                        >
                          <XCircle size={14} /> Cancel Booking
                        </button>
                      </div>
                    )}
                    {b.status === 'accepted' && b.paymentStatus === 'pending' && (
                      <button className="dashboard-action-btn pay" onClick={() => navigate(`/checkout/${b._id}`)}>
                        <CreditCard size={15} /> Confirm &amp; Pay Now
                      </button>
                    )}
                    {b.status === 'accepted' && b.paymentStatus === 'paid' && (
                      <span className="action-note success"><ShieldCheck size={13} /> Paid &amp; Confirmed • Partner is on the way</span>
                    )}
                    {b.status === 'completed' && (
                      <>
                        {!b.reviewed ? (
                          <button className="dashboard-action-btn review" onClick={() => triggerReviewForm(b)}>
                            <Star size={15} fill="currentColor" strokeWidth={0} /> Rate &amp; Write Review
                          </button>
                        ) : (
                          <span className="action-note done"><ShieldCheck size={13} /> Order completed &amp; reviewed</span>
                        )}
                      </>
                    )}
                    {b.status === 'rejected' && (
                      <span className="action-note error"><X size={13} /> Declined or Cancelled by Partner</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


        <div className="settings-panel">
          <h2>Default Service Details</h2>
          <p>These details will pre-populate your checkout sheets during booking selection.</p>

          <form onSubmit={handleSaveProfile} className="settings-form">
            <div className="form-group">
              <label><Phone size={14} /> Contact Phone Number</label>
              <input
                type="tel"
                required
                placeholder="e.g. +91 99887 76655"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label><MapPin size={14} /> Service Address</label>
              <textarea
                required
                rows={3}
                placeholder="e.g. Flat 101, Prestige Heights, HSR Layout, Bengaluru"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="save-settings-btn"
              disabled={savingProfile}
            >
              {savingProfile ? 'Saving Details...' : 'Save Service Details'}
            </button>
          </form>
        </div>
      </div>


      <AnimatePresence>
        {activeReviewBooking && (
          <div className="modal-overlay" onClick={() => setActiveReviewBooking(null)}>
            <motion.div
              className="review-modal"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              <div className="review-modal__header">
                <h2>Review Service Delivery</h2>
                <button className="close-btn" onClick={() => setActiveReviewBooking(null)}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleReviewSubmit} className="review-modal__content">
                <p className="summary-desc">You are rating service transaction #{activeReviewBooking._id} delivered by <strong>{activeReviewBooking.providerName}</strong>.</p>

                <div className="rating-field-group">
                  <label>Service Rating Quality:</label>
                  <div className="interactive-stars">
                    {[1, 2, 3, 4, 5].map(val => (
                      <button
                        key={val}
                        type="button"
                        className="star-val-btn"
                        onClick={() => setRating(val)}
                      >
                        <Star
                          size={28}
                          fill={val <= rating ? 'var(--tertiary)' : 'transparent'}
                          stroke="var(--tertiary)"
                          strokeWidth={val <= rating ? 0 : 1.5}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Add Written Feedback</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe your service quality experience (punctuality, clean desk, work quality...)"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                <div className="review-modal__footer">
                  <button
                    type="button"
                    className="modal-btn modal-btn--outline"
                    onClick={() => setActiveReviewBooking(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="modal-btn modal-btn--primary"
                    disabled={submittingReview}
                  >
                    {submittingReview ? 'Posting...' : 'Submit Rating'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CustomerDashboard
