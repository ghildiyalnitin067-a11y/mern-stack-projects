import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, Clock, Star, MapPin, ShieldCheck, ArrowLeft,
  X, Check, AlertCircle, ShoppingBag, User
} from 'lucide-react'
import toast from 'react-hot-toast'
import { apiFetch } from '../../api'
import './ServiceDetail.css'

const ServiceDetail = ({ user }) => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [service, setService] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)


  const [bookingOpen, setBookingOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [submittingBooking, setSubmittingBooking] = useState(false)

  const [availableDates, setAvailableDates] = useState([])

  const TIME_SLOTS = [
    '09:00 AM - 11:00 AM',
    '11:00 AM - 01:00 PM',
    '02:00 PM - 04:00 PM',
    '04:00 PM - 06:00 PM',
    '06:00 PM - 08:00 PM'
  ]

  const fetchServiceAndReviews = async () => {
    try {
      const [serviceRes, reviewsRes] = await Promise.all([
        apiFetch(`/api/customer/services/${id}`),
        apiFetch(`/api/customer/reviews/service/${id}`)
      ])

      if (serviceRes.ok) {
        const serviceData = await serviceRes.json()
        setService(serviceData)
      } else {
        toast.error('Service listing not found')
        navigate('/')
      }

      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json()
        setReviews(reviewsData)
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load page specifications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServiceAndReviews()


    const today = new Date().toISOString().split('T')[0]
    setSelectedDate(today)
    setSelectedSlot(TIME_SLOTS[0])
  }, [id])

  const handleBookTrigger = () => {
    if (!user) {
      toast('Please log in to book this service', { icon: '🔐' })
      navigate('/login')
      return
    }
    if (user.role !== 'customer') {
      toast.error('Only Customer accounts can book services!')
      return
    }
    setBookingOpen(true)
  }

  const handleConfirmBooking = async (e) => {
    e.preventDefault()
    setSubmittingBooking(true)
    const toastId = toast.loading('Booking your service...')

    try {
      const res = await apiFetch('/api/customer/bookings', {
        method: 'POST',
        body: JSON.stringify({
          serviceId: service._id,
          date: selectedDate,
          timeSlot: selectedSlot
        })
      })

      if (res.ok) {
        toast.success('Service booked! Accept & pay on dashboard. 🎉', { id: toastId })
        setBookingOpen(false)
        navigate('/customer/dashboard')
      } else {
        const err = await res.json()
        toast.error(err.error || 'Failed to submit booking', { id: toastId })
      }
    } catch (err) {
      toast.error('Connection error', { id: toastId })
    } finally {
      setSubmittingBooking(false)
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading service specs...</p>
      </div>
    )
  }

  if (!service) return null


  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : (service.rating || 5.0).toFixed(1)

  return (
    <div className="detail-page">
      <Link to="/" className="back-link"><ArrowLeft size={16} /> Back to services</Link>

      <div className="detail-layout">

        <div className="detail-left">
          <div className="service-banner-wrap">
            <img
              src={service.image || "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop"}
              alt={service.title}
              className="service-banner-img"
            />
          </div>

          <div className="service-desc-card">
            <span className="category-tag">{service.category}</span>
            <h1 className="service-title">{service.title}</h1>

            <div className="service-meta-stats">
              <span className="stat-item rating">
                <Star size={15} fill="currentColor" strokeWidth={0} />
                {avgRating} ({reviews.length} reviews)
              </span>
              <span className="stat-item"><User size={15} /> Partner: <strong>{service.providerName}</strong></span>
            </div>

            <h3 className="section-title">About the Service</h3>
            <p className="description-text">{service.description || 'No description provided for this catalog listing.'}</p>

            <div className="trust-badges-row">
              <div className="badge-item"><ShieldCheck size={18} /> Verified Professional</div>
              <div className="badge-item"><Check size={18} /> No-contact Service</div>
              <div className="badge-item"><Clock size={18} /> Reschedule Any Time</div>
            </div>
          </div>


          <div className="reviews-section-card">
            <div className="reviews-header">
              <h2>Customer Reviews</h2>
              <div className="avg-badge-large">
                <span className="avg-num">{avgRating}</span>
                <span className="avg-lbl">Out of 5 stars</span>
              </div>
            </div>

            <div className="reviews-list">
              {reviews.length === 0 ? (
                <div className="empty-reviews-state">
                  <AlertCircle size={22} />
                  <p>No reviews posted yet.</p>
                  <span>Book this service to be the first to leave a review!</span>
                </div>
              ) : (
                reviews.map(r => (
                  <div key={r._id} className="review-item">
                    <div className="review-item__header">
                      <div className="reviewer-info">
                        <span className="reviewer-avatar">{r.customerName.charAt(0)}</span>
                        <div>
                          <h4 className="reviewer-name">{r.customerName}</h4>
                          <span className="review-date">{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                      </div>
                      <div className="stars-row">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < r.rating ? 'var(--tertiary)' : 'transparent'}
                            stroke="var(--tertiary)"
                            strokeWidth={i < r.rating ? 0 : 1.5}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="review-comment">{r.comment || 'No comment provided.'}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>


        <div className="detail-right">
          <div className="checkout-card">
            <div className="checkout-card__header">
              <span className="price-label">Price per visit</span>
              <span className="price-val">₹{service.price}</span>
            </div>

            <div className="checkout-card__body">
              <p className="includes-tag">Package includes:</p>
              <ul className="includes-list">
                <li>✓ Professional equipment service</li>
                <li>✓ Local logistics and transit coverage</li>
                <li>✓ 30-day TaskTusk warranty protection</li>
              </ul>
            </div>

            <button className="book-now-btn" onClick={handleBookTrigger}>
              <ShoppingBag size={16} /> Book Now
            </button>
            <p className="checkout-sub-note">No pre-payment required. Pay only on dashboard approval.</p>
          </div>
        </div>
      </div>


      <AnimatePresence>
        {bookingOpen && (
          <div className="modal-overlay" onClick={() => setBookingOpen(false)}>
            <motion.div
              className="booking-modal"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
            >
              <div className="booking-modal__header">
                <div className="booking-modal__header-title">
                  <Calendar size={20} className="title-icon" />
                  <h2>Select Date &amp; Time</h2>
                </div>
                <button className="close-btn" onClick={() => setBookingOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleConfirmBooking} className="booking-modal__content">
                <div className="booking-field">
                  <label className="field-label">Choose Date</label>
                  <div className="date-picker-container">
                    <input
                      type="date"
                      className="native-date-picker"
                      value={selectedDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="booking-field">
                  <label className="field-label">Available Slots</label>
                  <div className="slots-grid">
                    {TIME_SLOTS.map(slot => (
                      <button
                        key={slot}
                        type="button"
                        className={`slot-card ${selectedSlot === slot ? 'selected' : ''}`}
                        onClick={() => setSelectedSlot(slot)}
                      >
                        <Clock size={13} />
                        <span>{slot}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="booking-modal__footer">
                  <button
                    type="button"
                    className="modal-btn modal-btn--outline"
                    onClick={() => setBookingOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="modal-btn modal-btn--primary"
                    disabled={submittingBooking}
                  >
                    {submittingBooking ? 'Confirming...' : `Confirm Booking • ₹${service.price}`}
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

export default ServiceDetail
