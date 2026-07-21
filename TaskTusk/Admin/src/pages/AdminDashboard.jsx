import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users, Briefcase, Calendar, CheckCircle2, TrendingUp,
  Search, ShieldAlert, Sparkles, Filter, Check, Clock, X,
  Play, Pause, LogOut
} from 'lucide-react'
import toast from 'react-hot-toast'
import { apiFetch } from '../api'
import logo from '../assets/logo1.png'
import './AdminDashboard.css'

const AdminDashboard = ({ onLogout }) => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalProviders: 0,
    totalBookings: 0,
    completedTasks: 0,
    activeTasks: 0,
    totalRevenue: 0
  })

  const [bookings, setBookings] = useState([])
  const [users, setUsers] = useState([])

  const [loading, setLoading] = useState(true)
  const [activeListTab, setActiveListTab] = useState('bookings')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')


  const fetchAdminData = async () => {
    try {
      const [statsRes, bookingsRes, usersRes, revenueRes] = await Promise.all([
        apiFetch('/api/admin/analytics'),
        apiFetch('/api/admin/bookings'),
        apiFetch('/api/admin/users'),
        apiFetch('/api/admin/revenue')
      ])

      if (statsRes.status === 401 || bookingsRes.status === 401) {
        return false
      }

      if (statsRes.ok && bookingsRes.ok && usersRes.ok) {
        const statsData = await statsRes.json()
        const bookingsData = await bookingsRes.json()
        const usersData = await usersRes.json()
        let revenueData = { totalPlatformRevenue: 0, totalProviderPayouts: 0 }

        if (revenueRes && revenueRes.ok) {
          revenueData = await revenueRes.json()
        }

        setStats({
          ...statsData,
          totalPlatformRevenue: revenueData.totalPlatformRevenue,
          totalProviderPayouts: revenueData.totalProviderPayouts
        })
        setBookings(bookingsData)
        setUsers(usersData)
        return true
      }
    } catch (err) {
      console.error('Error fetching admin data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdminData()
    const timer = setInterval(async () => {
      const result = await fetchAdminData()
      if (result === false) {
        clearInterval(timer)
      }
    }, 10000)
    return () => clearInterval(timer)
  }, [])


  const handleUpdateBookingStatus = async (id, newStatus) => {
    const toastId = toast.loading('Modifying booking state...')
    try {
      const res = await apiFetch(`/api/admin/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        toast.success(`Booking status changed to ${newStatus}`, { id: toastId })
        fetchAdminData()
      } else {
        toast.error('Failed to change booking status', { id: toastId })
      }
    } catch (err) {
      toast.error('Server error', { id: toastId })
    }
  }


  const handleToggleSuspension = async (userId, name, currentlySuspended) => {
    const toastId = toast.loading(`Toggling account state for ${name}...`)

    try {
      const res = await apiFetch(`/api/admin/users/${userId}/suspend`, {
        method: 'PATCH'
      })

      if (res.ok) {
        toast.success(`Account details for ${name} updated successfully!`, { id: toastId })
        fetchAdminData()
      } else {
        const err = await res.json()
        toast.error(err.error || 'Failed to modify account state', { id: toastId })
      }
    } catch (err) {
      toast.error('Server error updating account state', { id: toastId })
    }
  }


  const getCategoryChartData = () => {
    const categoriesMap = {
      'Plumbing': 0,
      'Electrical': 0,
      'Cleaning': 0,
      'AC Repair & Service': 0,
      'Carpentry': 0,
      'Salon & Beautician': 0
    }

    bookings.forEach(b => {
      if (categoriesMap[b.providerProfession] !== undefined) {
        categoriesMap[b.providerProfession]++
      }
    })

    return Object.keys(categoriesMap).map(key => ({
      category: key,
      count: categoriesMap[key]
    }))
  }

  const chartData = getCategoryChartData()
  const maxCount = Math.max(...chartData.map(d => d.count), 1)


  const providersList = users.filter(u => u.role === 'provider')
  const customersList = users.filter(u => u.role === 'customer')


  const filteredBookings = bookings.filter(b => {
    const matchesSearch =
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.providerProfession.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b._id.includes(searchQuery)

    const matchesStatus = statusFilter === 'All' || b.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const filteredProviders = providersList.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery)
  )

  const filteredCustomers = customersList.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  )

  return (
    <div className="admin-console">

      <section className="admin-banner" aria-label="Admin Banner">
        <div className="admin-banner__container">
          <div className="admin-banner__info">
            <span className="admin-badge">
              <img src={logo} alt="TaskTusk Logo" style={{ height: '24px', objectFit: 'contain' }} />
            </span>
            <h1>Admin Dashboard</h1>
            <p>Monitor platform services, providers, bookings, and analytics.</p>
          </div>
          <button onClick={onLogout} className="admin-logout-btn" title="Sign Out">
            <LogOut size={16} /> Sign Out Admin
          </button>
        </div>
      </section>

      {loading ? (
        <div className="admin-loading">
          <div className="spinner"></div>
          <p>Loading data...</p>
        </div>
      ) : (
        <>

          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-card__header">
                <Users size={20} className="icon-blue" />
                <span className="metric-title">Customers</span>
              </div>
              <span className="metric-value">{stats.totalCustomers}</span>
              <span className="metric-sub">Registered customers</span>
            </div>

            <div className="metric-card">
              <div className="metric-card__header">
                <Briefcase size={20} className="icon-green" />
                <span className="metric-title">Service Providers</span>
              </div>
              <span className="metric-value">{stats.totalProviders}</span>
              <span className="metric-sub">Registered service providers</span>
            </div>

            <div className="metric-card">
              <div className="metric-card__header">
                <Calendar size={20} className="icon-orange" />
                <span className="metric-title">Total Bookings</span>
              </div>
              <span className="metric-value">{stats.totalBookings}</span>
              <span className="metric-sub">Processed transactions overall</span>
            </div>

            <div className="metric-card">
              <div className="metric-card__header">
                <CheckCircle2 size={20} className="icon-teal" />
                <span className="metric-title">Completed Tasks</span>
              </div>
              <span className="metric-value">{stats.completedTasks}</span>
              <span className="metric-sub">{((stats.completedTasks / (stats.totalBookings || 1)) * 100).toFixed(0)}% Completion rate</span>
            </div>

            <div className="metric-card">
              <div className="metric-card__header">
                <TrendingUp size={20} className="icon-purple" />
                <span className="metric-title">Platform Revenue (30%)</span>
              </div>
              <span className="metric-value">₹{stats.totalPlatformRevenue || 0}</span>
              <span className="metric-sub">Aggregated platform fee volume</span>
            </div>

            <div className="metric-card">
              <div className="metric-card__header">
                <TrendingUp size={20} className="icon-teal" />
                <span className="metric-title">Provider Payouts (70%)</span>
              </div>
              <span className="metric-value">₹{stats.totalProviderPayouts || 0}</span>
              <span className="metric-sub">Aggregated payouts to partners</span>
            </div>
          </div>


          <div className="analytics-section">
            <div className="chart-panel">
              <div className="chart-header">
                <h3>Bookings by Category</h3>
                <span className="chart-tag">Live stats</span>
              </div>


              <div className="svg-chart-container">
                <svg viewBox="0 0 600 240" className="svg-chart">

                  <line x1="60" y1="20" x2="560" y2="20" stroke="var(--outline-variant)" strokeDasharray="4 4" />
                  <line x1="60" y1="70" x2="560" y2="70" stroke="var(--outline-variant)" strokeDasharray="4 4" />
                  <line x1="60" y1="120" x2="560" y2="120" stroke="var(--outline-variant)" strokeDasharray="4 4" />
                  <line x1="60" y1="170" x2="560" y2="170" stroke="var(--outline-variant)" strokeDasharray="4 4" />


                  <line x1="60" y1="20" x2="60" y2="170" stroke="var(--outline)" strokeWidth="1.5" />
                  <line x1="60" y1="170" x2="560" y2="170" stroke="var(--outline)" strokeWidth="1.5" />


                  <text x="50" y="24" textAnchor="end" fill="var(--on-surface-variant)" fontSize="10">{Math.ceil(maxCount)}</text>
                  <text x="50" y="99" textAnchor="end" fill="var(--on-surface-variant)" fontSize="10">{Math.ceil(maxCount / 2)}</text>
                  <text x="50" y="174" textAnchor="end" fill="var(--on-surface-variant)" fontSize="10">0</text>


                  {chartData.map((d, index) => {
                    const barWidth = 40
                    const gap = 45
                    const startX = 90 + index * (barWidth + gap)
                    const heightPercent = d.count / maxCount
                    const barHeight = heightPercent * 130
                    const startY = 170 - barHeight

                    return (
                      <g key={d.category}>
                        <motion.rect
                          x={startX}
                          width={barWidth}
                          fill="url(#chartGrad)"
                          rx="4"
                          initial={{ y: 170, height: 0 }}
                          animate={{ y: startY, height: barHeight }}
                          transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.05 }}
                        />

                        <text
                          x={startX + barWidth / 2}
                          y={startY - 8}
                          textAnchor="middle"
                          fill="var(--on-surface)"
                          fontSize="11"
                          fontWeight="700"
                        >
                          {d.count}
                        </text>

                        <text
                          x={startX + barWidth / 2}
                          y="190"
                          textAnchor="middle"
                          fill="var(--on-surface-variant)"
                          fontSize="9.5"
                          fontWeight="600"
                          transform={`rotate(-12 ${startX + barWidth / 2} 190)`}
                        >
                          {d.category.split(' ')[0]}
                        </text>
                      </g>
                    )
                  })}

                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#003d9b" />
                      <stop offset="100%" stopColor="#0052cc" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>


            <div className="completion-panel">
              <h3>System Delivery Status</h3>
              <div className="circular-progress-container">
                <svg viewBox="0 0 100 100" className="circular-progress">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--outline-variant)" strokeWidth="8" />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="var(--secondary)"
                    strokeWidth="8"
                    initial={{ strokeDasharray: `0 251.2` }}
                    animate={{ strokeDasharray: `${(stats.completedTasks / (stats.totalBookings || 1)) * 251.2} 251.2` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="progress-value">
                  <span className="val">{((stats.completedTasks / (stats.totalBookings || 1)) * 100).toFixed(0)}%</span>
                  <span className="lbl">Completed Tasks</span>
                </div>
              </div>
              <div className="progress-legend">
                <div className="legend-item"><span className="legend-dot green"></span> Completed Jobs ({stats.completedTasks})</div>
                <div className="legend-item"><span className="legend-dot blue"></span> Active Jobs ({stats.activeTasks})</div>
                <div className="legend-item"><span className="legend-dot orange"></span> Pending/Declined ({stats.totalBookings - stats.completedTasks - stats.activeTasks})</div>
              </div>
            </div>
          </div>


          <div className="records-panel">
            <div className="records-header-row">

              <div className="records-tabs">
                <button
                  className={`records-tab-btn ${activeListTab === 'bookings' ? 'active' : ''}`}
                  onClick={() => { setActiveListTab('bookings'); setSearchQuery('') }}
                >
                  Bookings Log
                </button>
                <button
                  className={`records-tab-btn ${activeListTab === 'providers' ? 'active' : ''}`}
                  onClick={() => { setActiveListTab('providers'); setSearchQuery('') }}
                >
                  Service Providers
                </button>
                <button
                  className={`records-tab-btn ${activeListTab === 'customers' ? 'active' : ''}`}
                  onClick={() => { setActiveListTab('customers'); setSearchQuery('') }}
                >
                  Customers
                </button>
              </div>


              <div className="records-controls">
                {activeListTab === 'bookings' && (
                  <div className="filter-dropdown">
                    <Filter size={14} className="control-icon" />
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                      <option value="All">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="completed">Completed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                )}

                <div className="search-box">
                  <Search size={14} className="control-icon" />
                  <input
                    type="text"
                    placeholder={`Search ${activeListTab}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>


            <div className="table-wrapper">
              {activeListTab === 'bookings' && (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Customer Details</th>
                      <th>Partner Details</th>
                      <th>Scheduled Slot</th>
                      <th>Rate</th>
                      <th>Status</th>
                      <th>Ops Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="empty-table-row">No bookings match your criteria.</td>
                      </tr>
                    ) : (
                      filteredBookings.map(b => (
                        <tr key={b._id}>
                          <td className="booking-id-cell">#{b._id}</td>
                          <td>
                            <div className="table-cell-bold">{b.customerName}</div>
                            <div className="table-cell-sub">{b.customerPhone}</div>
                          </td>
                          <td>
                            <div className="table-cell-bold">{b.providerName}</div>
                            <div className="table-cell-sub">{b.providerProfession}</div>
                          </td>
                          <td>
                            <div className="table-cell-bold">{b.date}</div>
                            <div className="table-cell-sub">{b.timeSlot}</div>
                          </td>
                          <td className="table-cell-bold">₹{b.price}</td>
                          <td>
                            <span className={`status-pill ${b.status}`}>
                              {b.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-row">
                              {b.status === 'pending' && (
                                <>
                                  <button
                                    className="table-action-btn check"
                                    title="Approve booking"
                                    onClick={() => handleUpdateBookingStatus(b._id, 'accepted')}
                                  >
                                    <Check size={13} />
                                  </button>
                                  <button
                                    className="table-action-btn close"
                                    title="Decline booking"
                                    onClick={() => handleUpdateBookingStatus(b._id, 'rejected')}
                                  >
                                    <X size={13} />
                                  </button>
                                </>
                              )}
                              {b.status === 'accepted' && (
                                <button
                                  className="table-action-btn check text-green"
                                  title="Mark as completed"
                                  onClick={() => handleUpdateBookingStatus(b._id, 'completed')}
                                >
                                  <CheckCircle2 size={13} />
                                </button>
                              )}
                              {(b.status === 'completed' || b.status === 'rejected') && (
                                <span className="action-locked"><Clock size={12} /> Logs locked</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {activeListTab === 'providers' && (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Partner Name</th>
                      <th>Email ID</th>
                      <th>Contact Phone</th>
                      <th>Service Base Location</th>
                      <th>Account State</th>
                      <th>Security Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProviders.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="empty-table-row">No service partners match search query.</td>
                      </tr>
                    ) : (
                      filteredProviders.map(p => (
                        <tr key={p._id}>
                          <td className="table-cell-bold">{p.name}</td>
                          <td>{p.email}</td>
                          <td className="table-cell-bold">{p.phone || 'N/A'}</td>
                          <td>{p.address || 'Delhi'}</td>
                          <td>
                            <span className={`status-pill ${p.isSuspended ? 'rejected' : 'completed'}`}>
                              {p.isSuspended ? 'Suspended' : 'Active'}
                            </span>
                          </td>
                          <td>
                            <button
                              className={`action-btn ${p.isSuspended ? 'action-btn--accept' : 'action-btn--reject'}`}
                              onClick={() => handleToggleSuspension(p._id, p.name, p.isSuspended)}
                              style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '4px', width: 'fit-content' }}
                            >
                              {p.isSuspended ? (
                                <><Play size={11} /> Activate</>
                              ) : (
                                <><Pause size={11} /> Suspend</>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {activeListTab === 'customers' && (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>Email ID</th>
                      <th>Contact Phone</th>
                      <th>Billing Location Address</th>
                      <th>Account State</th>
                      <th>Security Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="empty-table-row">No customer records match search query.</td>
                      </tr>
                    ) : (
                      filteredCustomers.map(c => (
                        <tr key={c._id}>
                          <td className="table-cell-bold">{c.name}</td>
                          <td>{c.email}</td>
                          <td className="table-cell-bold">{c.phone || 'N/A'}</td>
                          <td>{c.address || 'Address not registered'}</td>
                          <td>
                            <span className={`status-pill ${c.isSuspended ? 'rejected' : 'completed'}`}>
                              {c.isSuspended ? 'Suspended' : 'Active'}
                            </span>
                          </td>
                          <td>
                            <button
                              className={`action-btn ${c.isSuspended ? 'action-btn--accept' : 'action-btn--reject'}`}
                              onClick={() => handleToggleSuspension(c._id, c.name, c.isSuspended)}
                              style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '4px', width: 'fit-content' }}
                            >
                              {c.isSuspended ? (
                                <><Play size={11} /> Activate</>
                              ) : (
                                <><Pause size={11} /> Suspend</>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminDashboard
