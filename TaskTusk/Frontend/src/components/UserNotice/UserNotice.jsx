import React, { useState, useEffect } from 'react'
import { ShieldCheck, X } from 'lucide-react'
import './UserNotice.css'

const UserNotice = () => {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('tasktusk_user_consent')
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const acceptConsent = () => {
    localStorage.setItem('tasktusk_user_consent', 'accepted')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="user-notice-banner">
      <div className="user-notice-content">
        <ShieldCheck size={22} className="notice-icon" />
        <p>
          We use essential session tokens to maintain your login and enhance your marketplace experience. By continuing to browse, you agree to our platform terms.
        </p>
      </div>
      <div className="notice-actions">
        <button onClick={acceptConsent} className="accept-notice-btn">Accept</button>
        <button onClick={() => setShowBanner(false)} className="close-notice-btn" aria-label="Dismiss banner">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

export default UserNotice
