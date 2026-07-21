import React from 'react'
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react'
import './Legal.css'

const PlatformPrivacy = () => {
  return (
    <div className="legal-page">
      <header className="legal-header">
        <span className="legal-badge"><ShieldCheck size={14} /> Trust & Transparency</span>
        <h1>Privacy Policy</h1>
        <p>Last updated: July 2026</p>
      </header>

      <div className="legal-container">
        <section className="legal-section">
          <h2><Lock size={18} /> 1. Information We Collect</h2>
          <p>TaskTusk collects personal information necessary to deliver home marketplace services, including:</p>
          <ul>
            <li>Contact details: Name, email address, phone number, and service location.</li>
            <li>Account credentials: Authenticated tokens and encrypted login credentials.</li>
            <li>Booking history: Completed service requests, ratings, and written reviews.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2><Eye size={18} /> 2. How We Use Your Data</h2>
          <p>Your data is strictly utilized to facilitate seamless local service fulfillment:</p>
          <ul>
            <li>Connecting customer requests with verified local service providers.</li>
            <li>Processing platform payments and transparent 30% / 70% payout transactions.</li>
            <li>Sending real-time order updates via Socket.io notifications.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2><FileText size={18} /> 3. Data Protection &amp; Sessions</h2>
          <p>We use secure httpOnly cookies for authenticating active sessions. We never sell customer or partner data to third-party advertisers.</p>
        </section>
      </div>
    </div>
  )
}

export default PlatformPrivacy
