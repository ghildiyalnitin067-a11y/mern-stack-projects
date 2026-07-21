import React from 'react'
import { ShieldAlert, Scale, CheckCircle2 } from 'lucide-react'
import './Legal.css'

const TermsOfService = () => {
  return (
    <div className="legal-page">
      <header className="legal-header">
        <span className="legal-badge"><Scale size={14} /> Legal Agreement</span>
        <h1>Terms of Service</h1>
        <p>Last updated: July 2026</p>
      </header>

      <div className="legal-container">
        <section className="legal-section">
          <h2><CheckCircle2 size={18} /> 1. Marketplace Facilitation</h2>
          <p>TaskTusk provides a digital platform connecting local service professionals with customer requests. TaskTusk verifies listed service providers to promote safety and quality.</p>
        </section>

        <section className="legal-section">
          <h2><Scale size={18} /> 2. Booking & Revenue Terms</h2>
          <p>All platform transactions adhere to standard marketplace fee distribution:</p>
          <ul>
            <li>30% platform administration and service fee.</li>
            <li>70% direct provider payout upon customer task confirmation.</li>
            <li>Payments must be confirmed prior to marking service tasks complete.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2><ShieldAlert size={18} /> 3. Cancellations & Disputes</h2>
          <p>Customers may cancel pending bookings free of charge before provider acceptance. Service issues or quality concerns may be escalated to platform administration.</p>
        </section>
      </div>
    </div>
  )
}

export default TermsOfService
