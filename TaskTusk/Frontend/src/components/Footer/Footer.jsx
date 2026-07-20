import './Footer.css'
import { Globe, Share2, Send } from 'lucide-react'

export default function Footer() {
  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <footer className="footer">
      <div className="section-container">
        
        <div className="footer__grid">
          <div className="footer__col footer__col--brand">
            <span className="footer__logo">TaskTusk</span>
            <p className="footer__desc">
              Connecting local expertise with immediate needs through a seamless, trusted platform.
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
              <a href="#" className="footer__link">Find Services</a>
              <a href="#" className="footer__link">Become a Provider</a>
              <a href="#" className="footer__link">Pricing</a>
              <a href="#" className="footer__link">Safety</a>
            </nav>
          </div>

          <div className="footer__col">
            <h4 className="footer__header">Company</h4>
            <nav className="footer__links">
              <a href="#" className="footer__link">About Us</a>
              <a href="#" className="footer__link">Support</a>
              <a href="#" className="footer__link">Contact</a>
              <a href="#" className="footer__link">Privacy Policy</a>
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
            <a href="#" className="footer__bottom-link">Terms of Service</a>
            <a href="#" className="footer__bottom-link">Privacy Policy</a>
          </div>
        </div>

      </div>
    </footer>
  )
}