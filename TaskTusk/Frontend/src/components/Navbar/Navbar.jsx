import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Briefcase, LogOut, LayoutDashboard, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { apiFetch } from '../../api'
import './Navbar.css'

const Navbar = ({ user, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const location = useLocation()
  const closeMenu = () => setMenuOpen(false)


  useEffect(() => {
    if (!user || user.role !== 'provider') {
      setUnreadCount(0)
      return
    }

    const fetchNotifications = async () => {
      try {
        const res = await apiFetch('/api/provider/bookings')
        if (res.ok) {
          const bookings = await res.json()

          const pending = bookings.filter(b => b.status === 'pending').length
          setUnreadCount(pending)
        }
      } catch (err) {

      }
    }

    fetchNotifications()
    const timer = setInterval(fetchNotifications, 5000)
    return () => clearInterval(timer)
  }, [user])

  const getActiveLinkClass = (path) => {
    return location.pathname === path ? 'navbar__link active' : 'navbar__link'
  }

  return (
    <header>
      <nav className="navbar" role="navigation" aria-label="Main navigation">
        <div className="navbar__container">
          <div className="navbar__left">
            <Link to="/" className="navbar__logo">
              TaskTusk
            </Link>

            <div className="navbar__links">
              <Link to="/" className={getActiveLinkClass('/')}>Home</Link>
              <Link to="/services" className={getActiveLinkClass('/services')}>Services</Link>
              <Link to="/testimonials" className={getActiveLinkClass('/testimonials')}>Testimonials</Link>
              <Link to="/contact" className={getActiveLinkClass('/contact')}>Contact</Link>

              {user && (
                <>
                  {user.role === 'customer' && (
                    <Link to="/customer/dashboard" className={getActiveLinkClass('/customer/dashboard')}>
                      My Bookings
                    </Link>
                  )}
                  {user.role === 'provider' && (
                    <Link to="/provider/dashboard" className={getActiveLinkClass('/provider/dashboard')}>
                      Partner Portal
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <a href="http://localhost:5174/" className="navbar__link">
                      Admin Operations
                    </a>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="navbar__right">
            {user ? (
              <div className="user-profile-menu">
                <span className="user-info">
                  <User size={14} />
                  <span className="user-name">{user.name}</span>
                  <span className={`user-role-badge ${user.role}`}>
                    {user.role}
                  </span>
                </span>

                {user.role === 'provider' && unreadCount > 0 && (
                  <Link to="/provider/dashboard" className="navbar__badge-wrap" title="New Bookings Received">
                    <Briefcase size={16} />
                    <span className="navbar__badge animate-pulse">{unreadCount}</span>
                  </Link>
                )}

                <button
                  className="navbar__btn navbar__btn--ghost logout-btn"
                  onClick={onLogout}
                >
                  <LogOut size={15} />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="navbar__actions">
                <Link to="/login" className="navbar__btn navbar__btn--ghost">Log In</Link>
                <Link to="/signup" className="navbar__btn navbar__btn--primary">Sign Up</Link>
              </div>
            )}

            <button
              className="navbar__hamburger"
              onClick={() => setMenuOpen(prev => !prev)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {menuOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0,   opacity: 1 }}
                    exit={{   rotate:  90,  opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <X size={22} strokeWidth={2} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ rotate:  90, opacity: 0 }}
                    animate={{ rotate:  0,  opacity: 1 }}
                    exit={{   rotate: -90,  opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Menu size={22} strokeWidth={2} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>


        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="mobile-menu"
              className="navbar__mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{   opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              aria-hidden={!menuOpen}
            >
              <div className="navbar__mobile-inner">
                <Link to="/" className="navbar__mobile-link" onClick={closeMenu}>Home</Link>
                <Link to="/services" className="navbar__mobile-link" onClick={closeMenu}>Services</Link>
                <Link to="/testimonials" className="navbar__mobile-link" onClick={closeMenu}>Testimonials</Link>

                {user && (
                  <>
                    {user.role === 'customer' && (
                      <Link to="/customer/dashboard" className="navbar__mobile-link" onClick={closeMenu}>My Bookings</Link>
                    )}
                    {user.role === 'provider' && (
                      <Link to="/provider/dashboard" className="navbar__mobile-link" onClick={closeMenu}>Partner Portal</Link>
                    )}
                    {user.role === 'admin' && (
                      <a href="http://localhost:5174/" className="navbar__mobile-link" onClick={closeMenu}>Admin Operations</a>
                    )}
                  </>
                )}

                <div className="mobile-actions-wrapper">
                  {user ? (
                    <button
                      className="navbar__btn navbar__btn--ghost logout-btn mobile-logout"
                      onClick={() => { onLogout(); closeMenu() }}
                    >
                      <LogOut size={15} /> Log Out
                    </button>
                  ) : (
                    <div className="mobile-auth-buttons">
                      <Link to="/login" className="navbar__btn navbar__btn--ghost" onClick={closeMenu}>Log In</Link>
                      <Link to="/signup" className="navbar__btn navbar__btn--primary" onClick={closeMenu}>Sign Up</Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}

export default Navbar
