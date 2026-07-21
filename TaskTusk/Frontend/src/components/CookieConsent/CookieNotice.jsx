import React, { useState, useEffect } from 'react'
import { ShieldCheck, X } from 'lucide-react'
import './CookieConsent.css'

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('tasktusk_cookie_consent')
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('tasktusk_cookie_consent', 'accepted')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="cookie-banner">
      <div className="cookie-content">
        <ShieldCheck size={22} className="cookie-icon" />
        <p>
          We use essential cookies to maintain your login session and enhance your marketplace experience. By continuing to browse, you agree to our privacy policy.
        </p>
      </div>
      <div className="cookie-actions">
        <button onClick={acceptCookies} className="accept-cookie-btn">Accept Cookies</button>
        <button onClick={() => setShowBanner(false)} className="close-cookie-btn" aria-label="Dismiss cookie banner">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

export default CookieConsent
