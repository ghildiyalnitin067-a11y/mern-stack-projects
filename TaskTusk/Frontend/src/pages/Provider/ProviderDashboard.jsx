import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, MapPin, Clock, CheckCircle2,
  XCircle, AlertCircle, Calendar, RefreshCw,
  Plus, Edit2, Trash2, Layers, Phone
} from 'lucide-react'
import toast from 'react-hot-toast'
import { io } from 'socket.io-client'
import { apiFetch, API_BASE } from '../../api'
import './ProviderDashboard.css'

const PROFESSIONS = [
  'AC Repair & Service',
  'Cleaning',
  'Electrical',
  'Salon & Beautician',
  'Carpentry',
  'Plumbing'
]

const ProviderDashboard = ({ user }) => {

  const [bookings, setBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')


  const [services, setServices] = useState([])
  const [loadingServices, setLoadingServices] = useState(true)

  const [showServiceForm, setShowServiceForm] = useState(false)
  const [editingServiceId, setEditingServiceId] = useState(null)
  const [serviceTitle, setServiceTitle] = useState('')
  const [serviceCategory, setServiceCategory] = useState(PROFESSIONS[0])
  const [servicePrice, setServicePrice] = useState('')
  const [serviceDesc, setServiceDesc] = useState('')
  const [serviceImg, setServiceImg] = useState('')
  const [savingService, setSavingService] = useState(false)


  const [phone, setPhone] = useState(user.phone || '')
  const [address, setAddress] = useState(user.address || '')
  const [savingProfile, setSavingProfile] = useState(false)


  const fetchBookings = async () => {
    try {
      const res = await apiFetch(`/api/provider/bookings`)
      if (res.ok) {
        const data = await res.json()
        setBookings(data)
        return true
      } else if (res.status === 401) {
        return false
      }
    } catch (err) {
      console.error('Error fetching bookings:', err)
    } finally {
      setLoadingBookings(false)
    }
  }

  const fetchServices = async () => {
    setLoadingServices(true)
    try {
      const res = await apiFetch(`/api/provider/services`)
      if (res.ok) {
        const data = await res.json()
        const providerServices = data.filter(s => s.providerId === user._id)
        setServices(providerServices)
      }
    } catch (err) {
      console.error('Error fetching provider services:', err)
    } finally {
      setLoadingServices(false)
    }
  }

  useEffect(() => {
    if (!user || !user._id) return

    fetchBookings()
    fetchServices()

    const socket = io(API_BASE)

    socket.emit('join', user._id)

    socket.on('payment_confirmed', (data) => {
      console.log('Realtime Notification Received:', data)
      toast.success(`🎉 ${data.message} Booking #${data.bookingId} is Paid! Payout: ₹${data.providerPayoutAmount}`, {
        duration: 8000
      })
      fetchBookings()
    })

    const timer = setInterval(async () => {
      const result = await fetchBookings()
      if (result === false) {
        clearInterval(timer)
      }
    }, 10000)

    return () => {
      clearInterval(timer)
      socket.disconnect()
    }
  }, [user])


  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    const toastId = toast.loading('Saving details...')

    try {
      const res = await apiFetch('/api/provider/profile', {
        method: 'POST',
        body: JSON.stringify({
          name: user.name,
          phone,
          profession: 'Professional Partner',
          price: 299,
          experience: 5,
          address
        })
      })

      if (res.ok) {
        toast.success('Provider contact & location saved! 🚀', { id: toastId })
      } else {
        toast.error('Failed to update provider profile')
      }
    } catch (err) {
      toast.error('Connection timeout', { id: toastId })
    } finally {
      setSavingProfile(false)
    }
  }


  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    const toastId = toast.loading('Updating booking state...')
    try {
      const res = await apiFetch(`/api/provider/bookings/${bookingId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      })

      if (res.ok) {
        toast.success(`Order marked as ${newStatus}! 🎉`, { id: toastId })
        fetchBookings()
      } else {
        const err = await res.json()
        toast.error(err.error || 'Failed to update order status', { id: toastId })
      }
    } catch (err) {
      toast.error('Connection error', { id: toastId })
    }
  }


  const handleSaveService = async (e) => {
    e.preventDefault()
    if (!serviceTitle || !servicePrice) {
      toast.error('Please enter service title and price')
      return
    }

    setSavingService(true)
    const label = editingServiceId ? 'Updating listing...' : 'Adding catalog listing...'
    const toastId = toast.loading(label)

    try {
      const path = editingServiceId
        ? `/api/provider/services/${editingServiceId}`
        : '/api/provider/services'

      const method = editingServiceId ? 'PUT' : 'POST'

      const res = await apiFetch(path, {
        method,
        body: JSON.stringify({
          title: serviceTitle,
          category: serviceCategory,
          price: Number(servicePrice),
          description: serviceDesc,
          image: serviceImg || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=200&auto=format&fit=crop'
        })
      })

      if (res.ok) {
        toast.success(editingServiceId ? 'Catalog listing updated! 🚀' : 'New service listing added! 🚀', { id: toastId })
        fetchServices()
        resetServiceForm()
      } else {
        const err = await res.json()
        toast.error(err.error || 'Failed to save listing', { id: toastId })
      }
    } catch (err) {
      toast.error('Network failure', { id: toastId })
    } finally {
      setSavingService(false)
    }
  }


  const handleEditClick = (s) => {
    setEditingServiceId(s._id)
    setServiceTitle(s.title)
    setServiceCategory(s.category)
    setServicePrice(s.price)
    setServiceDesc(s.description || '')
    setServiceImg(s.image || '')
    setShowServiceForm(true)
  }


  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return
    const toastId = toast.loading('Deleting service listing...')
    try {
      const res = await apiFetch(`/api/provider/services/${serviceId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        toast.success('Listing deleted successfully!', { id: toastId })
        fetchServices()
      } else {
        toast.error('Failed to delete listing', { id: toastId })
      }
    } catch (err) {
      toast.error('Connection error', { id: toastId })
    }
  }

  const resetServiceForm = () => {
    setEditingServiceId(null)
    setServiceTitle('')
    setServiceCategory(PROFESSIONS[0])
    setServicePrice('')
    setServiceDesc('')
    setServiceImg('')
    setShowServiceForm(false)
  }


  const pendingRequests = bookings.filter(b => b.status === 'pending')
  const activeJobs = bookings.filter(b => b.status === 'accepted')
  const jobHistory = bookings.filter(b => b.status === 'completed' || b.status === 'rejected')


  const totalEarnings = bookings
    .filter(b => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + (b.providerEarnings || b.price * 0.70), 0)
  const completedCount = bookings.filter(b => b.status === 'completed').length

  return (
    <div className="provider-hub">

      <section className="hub-banner" aria-label="Partner Banner">
        <div className="hub-banner__container">
          <div className="hub-banner__info">
            <span className="hub-badge">Provider Dashboard</span>
            <h1>Welcome, {user.name}!</h1>
            <p>Administer your catalog listings, accept incoming requests, and inspect earnings reports.</p>
          </div>

          <div className="hub-stats">
            <div className="hub-stat-card">
              <span className="hub-stat-label">Total Earnings</span>
              <span className="hub-stat-value">₹{totalEarnings}</span>
            </div>
            <div className="hub-stat-card">
              <span className="hub-stat-label">Completed Jobs</span>
              <span className="hub-stat-value">{completedCount}</span>
            </div>
            <div className="hub-stat-card">
              <span className="hub-stat-label">Catalog Listings</span>
              <span className="hub-stat-value">{services.length}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="hub-grid">

        <div className="hub-bookings-panel">
          <div className="bookings-header">
            <h2>Partner Operations Panel</h2>
            <button className="refresh-btn" onClick={() => { fetchBookings(); fetchServices() }} title="Refresh Lists">
              <RefreshCw size={15} />
            </button>
          </div>


          <div className="bookings-tabs">
            <button
              className={`booking-tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending Requests
              {pendingRequests.length > 0 && (
                <span className="tab-badge warning">{pendingRequests.length}</span>
              )}
            </button>
            <button
              className={`booking-tab-btn ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              Active Jobs
              {activeJobs.length > 0 && (
                <span className="tab-badge primary">{activeJobs.length}</span>
              )}
            </button>
            <button
              className={`booking-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              Job History
            </button>
            <button
              className={`booking-tab-btn ${activeTab === 'services' ? 'active' : ''}`}
              onClick={() => setActiveTab('services')}
            >
              Manage Listings
            </button>
          </div>

          <div className="bookings-content">
            {loadingBookings ? (
              <div className="loading-bookings">
                <div className="spinner"></div>
                <p>Retrieving platform data logs...</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {activeTab === 'pending' && (
                  <motion.div
                    key="pending-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bookings-list"
                  >
                    {pendingRequests.length === 0 ? (
                      <div className="empty-bookings">
                        <AlertCircle size={28} />
                        <p>No pending booking alerts.</p>
                        <span>Customer orders will appear here as soon as they select your schedule.</span>
                      </div>
                    ) : (
                      pendingRequests.map(b => (
                        <div key={b._id} className="booking-item pending-card animate-pulse-border">
                          <div className="booking-item__header">
                            <div>
                              <span className="booking-tag pending">Incoming Order</span>
                              <h3 className="customer-name">{b.customerName}</h3>
                              <p className="customer-phone">{b.customerPhone}</p>
                            </div>
                            <span className="booking-price">₹{b.price}</span>
                          </div>

                          <div className="booking-item__details">
                            <p className="detail-row"><Calendar size={14} /> <strong>Scheduled Date:</strong> {b.date}</p>
                            <p className="detail-row"><Clock size={14} /> <strong>Time slot:</strong> {b.timeSlot}</p>
                            <p className="detail-row"><MapPin size={14} /> <strong>Service Location:</strong> {b.customerAddress}</p>
                          </div>

                          <div className="booking-item__actions">
                            <button
                              className="action-btn action-btn--reject"
                              onClick={() => handleUpdateBookingStatus(b._id, 'rejected')}
                            >
                              <XCircle size={15} /> Decline
                            </button>
                            <button
                              className="action-btn action-btn--accept"
                              onClick={() => handleUpdateBookingStatus(b._id, 'accepted')}
                            >
                              <CheckCircle2 size={15} /> Accept Order
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </motion.div>
                )}

                {activeTab === 'active' && (
                  <motion.div
                    key="active-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bookings-list"
                  >
                    {activeJobs.length === 0 ? (
                      <div className="empty-bookings">
                        <AlertCircle size={28} />
                        <p>No active tasks in progress.</p>
                        <span>Accept incoming requests to generate earnings!</span>
                      </div>
                    ) : (
                      activeJobs.map(b => (
                        <div key={b._id} className="booking-item active-card">
                          <div className="booking-item__header">
                            <div>
                              <span className="booking-tag active">Task in progress</span>
                              {b.paymentStatus === 'paid' && <span className="booking-tag completed" style={{ marginLeft: '6px' }}>Paid</span>}
                              <h3 className="customer-name">{b.customerName}</h3>
                              <p className="customer-phone">{b.customerPhone}</p>
                            </div>
                            <span className="booking-price">₹{b.price}</span>
                          </div>

                          <div className="booking-item__details">
                            <p className="detail-row"><Calendar size={14} /> <strong>Scheduled Date:</strong> {b.date}</p>
                            <p className="detail-row"><Clock size={14} /> <strong>Selected Slot:</strong> {b.timeSlot}</p>
                            <p className="detail-row"><MapPin size={14} /> <strong>Customer Address:</strong> {b.customerAddress}</p>
                          </div>

                          <div className="booking-item__actions">
                            <button
                              className="action-btn action-btn--complete"
                              onClick={() => handleUpdateBookingStatus(b._id, 'completed')}
                              disabled={b.paymentStatus !== 'paid'}
                              title={b.paymentStatus !== 'paid' ? 'Customer must pay before completing task' : 'Mark task as completed'}
                            >
                              <CheckCircle2 size={15} /> Mark task as completed
                            </button>
                            {b.paymentStatus !== 'paid' && (
                              <p className="payment-warning-note">
                                <AlertCircle size={13} /> Waiting for customer payment to enable completion.
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </motion.div>
                )}

                {activeTab === 'history' && (
                  <motion.div
                    key="history-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bookings-list"
                  >
                    {jobHistory.length === 0 ? (
                      <div className="empty-bookings">
                        <AlertCircle size={28} />
                        <p>No platform booking history logs found.</p>
                      </div>
                    ) : (
                      jobHistory.map(b => (
                        <div key={b._id} className="booking-item history-card">
                          <div className="booking-item__header">
                            <div>
                              <span className={`booking-tag ${b.status}`}>{b.status === 'completed' ? 'Delivered' : 'Declined'}</span>
                              <h3 className="customer-name">{b.customerName}</h3>
                            </div>
                            <span className="booking-price">₹{b.price}</span>
                          </div>

                          <div className="booking-item__details">
                            <p className="detail-row"><Calendar size={14} /> <strong>Date:</strong> {b.date}</p>
                            <p className="detail-row"><Clock size={14} /> <strong>Time:</strong> {b.timeSlot}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </motion.div>
                )}

                {activeTab === 'services' && (
                  <motion.div
                    key="services-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="services-panel-sub"
                  >
                    <div className="services-action-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '800' }}>Your Service Catalog ({services.length})</h3>
                      {!showServiceForm && (
                        <button className="add-service-trigger-btn" onClick={() => setShowServiceForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--primary)', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 'var(--radius)', fontSize: '13px', fontWeight: '700' }}>
                          <Plus size={15} /> Add Service
                        </button>
                      )}
                    </div>

                    {showServiceForm && (
                      <form onSubmit={handleSaveService} className="add-service-inline-form" style={{ background: 'var(--surface-container-low)', border: '1px solid var(--outline-variant)', borderRadius: 'var(--radius-lg)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '800', borderBottom: '1px solid var(--outline-variant)', paddingBottom: '8px' }}>
                          {editingServiceId ? 'Edit Catalog Listing' : 'Create Service Listing'}
                        </h4>

                        <div className="form-group">
                          <label>Listing Title *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Split AC Condenser Cleaning"
                            value={serviceTitle}
                            onChange={(e) => setServiceTitle(e.target.value)}
                            style={{ padding: '10px', borderRadius: 'var(--radius)', border: '1px solid var(--outline-variant)', outline: 'none' }}
                          />
                        </div>

                        <div className="form-row" style={{ display: 'flex', gap: '12px' }}>
                          <div className="form-group flex-1" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label>Service Category *</label>
                            <select
                              value={serviceCategory}
                              onChange={(e) => setServiceCategory(e.target.value)}
                              style={{ padding: '10px', borderRadius: 'var(--radius)', border: '1px solid var(--outline-variant)', background: '#fff' }}
                            >
                              {PROFESSIONS.map(p => (
                                <option key={p} value={p}>{p}</option>
                              ))}
                            </select>
                          </div>

                          <div className="form-group flex-1" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label>Fixed Price (₹) *</label>
                            <input
                              type="number"
                              required
                              min="0"
                              placeholder="e.g. 349"
                              value={servicePrice}
                              onChange={(e) => setServicePrice(e.target.value)}
                              style={{ padding: '10px', borderRadius: 'var(--radius)', border: '1px solid var(--outline-variant)', outline: 'none' }}
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Service Description</label>
                          <textarea
                            rows={3}
                            placeholder="Provide a detailed description of what your service includes..."
                            value={serviceDesc}
                            onChange={(e) => setServiceDesc(e.target.value)}
                            style={{ padding: '10px', borderRadius: 'var(--radius)', border: '1px solid var(--outline-variant)', outline: 'none', resize: 'vertical' }}
                          />
                        </div>

                        <div className="form-group">
                          <label>Cover Photo URL</label>
                          <input
                            type="url"
                            placeholder="https://images.unsplash.com/... (optional)"
                            value={serviceImg}
                            onChange={(e) => setServiceImg(e.target.value)}
                            style={{ padding: '10px', borderRadius: 'var(--radius)', border: '1px solid var(--outline-variant)', outline: 'none' }}
                          />
                        </div>

                        <div className="form-actions-inline" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
                          <button type="button" onClick={resetServiceForm} style={{ padding: '10px 16px', borderRadius: 'var(--radius)', border: '1.5px solid var(--outline-variant)', background: '#fff', fontSize: '13px', fontWeight: '700' }}>Cancel</button>
                          <button type="submit" disabled={savingService} style={{ padding: '10px 18px', borderRadius: 'var(--radius)', background: 'var(--secondary)', color: '#fff', border: 'none', fontSize: '13px', fontWeight: '700' }}>
                            {savingService ? 'Saving...' : 'Save & Publish Listing'}
                          </button>
                        </div>
                      </form>
                    )}

                    {loadingServices ? (
                      <div className="loading-bookings"><div className="spinner"></div></div>
                    ) : services.length === 0 ? (
                      <div className="empty-bookings">
                        <Layers size={24} />
                        <p>Your catalog is empty.</p>
                        <span>Click "Add Service" above to publish your first service list!</span>
                      </div>
                    ) : (
                      <div className="services-crud-list" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {services.map(s => (
                          <div key={s._id} className="service-crud-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', border: '1px solid var(--outline-variant)', padding: '16px 20px', borderRadius: 'var(--radius-lg)' }}>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                              <img src={s.image} alt={s.title} style={{ width: '48px', height: '48px', borderRadius: 'var(--radius)', objectFit: 'cover', flexShrink: 0 }} />
                              <div>
                                <h4 style={{ fontSize: '15px', fontWeight: '750', margin: '0' }}>{s.title}</h4>
                                <span style={{ fontSize: '12px', background: 'var(--primary-light)', color: 'var(--primary)', padding: '1px 8px', borderRadius: '90px', fontWeight: '700', marginTop: '4px', display: 'inline-block' }}>
                                  {s.category}
                                </span>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                              <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--secondary-hover)' }}>₹{s.price}</span>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => handleEditClick(s)} style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--surface-container-low)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--on-surface-variant)', cursor: 'pointer' }} title="Edit Service">
                                  <Edit2 size={13} />
                                </button>
                                <button onClick={() => handleDeleteService(s._id)} style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fff0ee', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ba1a1a', cursor: 'pointer' }} title="Delete Service">
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>


        <div className="hub-profile-panel">
          <div className="profile-header">
            <h2>Contact &amp; Hub Details</h2>
            <p>These details are required for customers to route schedules to your workplace.</p>
          </div>

          <form onSubmit={handleSaveProfile} className="profile-form">
            <div className="form-group">
              <label><User size={14} /> Registered Partner Name</label>
              <input
                type="text"
                disabled
                value={user.name}
                style={{ background: 'var(--surface-container-low)', color: 'var(--outline)', cursor: 'not-allowed' }}
              />
            </div>

            <div className="form-group">
              <label><Phone size={14} /> Contact Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="e.g. +91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label><MapPin size={14} /> Service / Shop Address *</label>
              <textarea
                required
                rows={3}
                placeholder="e.g. Sector 12 Main market, Dwarka, Delhi"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="save-profile-btn"
              disabled={savingProfile}
            >
              {savingProfile ? 'Saving Details...' : 'Save Hub Settings'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProviderDashboard
