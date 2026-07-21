import './Footer.css'
import { Link } from 'react-router-dom'
import { Globe, Share2, Send } from 'lucide-react'
import logo from '../../assets/logo1.png'

export default function Footer() {
  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <footer className="footer">
      <div className="section-container">

        <div className="footer__grid">
          <div className="footer__col footer__col--brand">
            <img src={logo} alt="TaskTusk Logo" style={{ height: '40px', objectFit: 'contain' }} className="footer__logo" />
            <p className="footer__desc">
              Connecting local expertise with immediate needs through a trusted platform.
            </p>
            <div className="footer__social">
              <a href="#" className="footer__social-btn" aria-label="Website">
                <Globe size={18} />
              </a>
              <a href="#" className="footer__social-btn" aria-label="Share">
                <Share2 size={18} />
              </a>
            </div>
          </div>

          <div className="footer__col">
            <h4 className="footer__header">Platform</h4>
            <nav className="footer__links">
              <Link to="/services" className="footer__link">Find Services</Link>
              <Link to="/signup" className="footer__link">Become a Provider</Link>
              <Link to="/contact" className="footer__link">Support</Link>
            </nav>
          </div>

          <div className="footer__col">
            <h4 className="footer__header">Company</h4>
            <nav className="footer__links">
              <Link to="/contact" className="footer__link">Contact Us</Link>
              <Link to="/privacy" className="footer__link">Privacy Policy</Link>
              <Link to="/terms" className="footer__link">Terms of Service</Link>
            </nav>
          </div>

          <div className="footer__col">
            <h4 className="footer__header">Newsletter</h4>
            <p className="footer__desc">Stay updated with the latest service trends.</p>
            <form className="footer__newsletter" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                className="footer__input"
                aria-label="Email address"
                required
              />
              <button type="submit" className="footer__submit-btn" aria-label="Subscribe">
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        <hr className="footer__divider" />

        <div className="footer__bottom">
          <p className="footer__copy">
            © 2026 TaskTusk. Connecting local expertise with immediate needs.
          </p>
          <div className="footer__bottom-links">
            <Link to="/terms" className="footer__bottom-link">Terms of Service</Link>
            <Link to="/privacy" className="footer__bottom-link">Privacy Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}