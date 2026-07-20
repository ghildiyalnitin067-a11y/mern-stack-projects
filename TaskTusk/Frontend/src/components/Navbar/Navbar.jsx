import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import toast from 'react-hot-toast'
import './Navbar.css'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignUp = () => {
    toast.success('Welcome! Redirecting to sign up…', { icon: '👋' })
  }

  const handleLogin = () => {
    toast('Redirecting to login…', { icon: '🔐' })
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <header>
      <nav className="navbar" role="navigation" aria-label="Main navigation">
        <div className="navbar__container">
          <div className="navbar__left">
            <a href="/" className="navbar__logo">TaskTusk</a>
            <div className="navbar__links">
              <a href="#services"     className="navbar__link active">Browse Services</a>
              <a href="#how-it-works" className="navbar__link">How It Works</a>
              <a href="/testimonials" className="navbar__link">Testimonials</a>
            </div>
          </div>

          <div className="navbar__right">
            <button className="navbar__btn navbar__btn--ghost"   onClick={handleLogin}>Log In</button>
            <button className="navbar__btn navbar__btn--primary" onClick={handleSignUp}>Sign Up</button>

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
                <a href="#services"     className="navbar__mobile-link" onClick={closeMenu}>Browse Services</a>
                <a href="#how-it-works" className="navbar__mobile-link" onClick={closeMenu}>How It Works</a>
                <a href="/testimonials" className="navbar__mobile-link" onClick={closeMenu}>Testimonials</a>

                <div className="navbar__mobile-actions">
                  <button className="navbar__btn navbar__btn--ghost"   onClick={() => { handleLogin();  closeMenu() }}>Log In</button>
                  <button className="navbar__btn navbar__btn--primary" onClick={() => { handleSignUp(); closeMenu() }}>Sign Up</button>
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
