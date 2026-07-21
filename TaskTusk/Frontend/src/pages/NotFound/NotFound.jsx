import React from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react'
import './NotFound.css'

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <div className="not-found-icon">
          <AlertTriangle size={48} />
        </div>
        <span className="error-code">404</span>
        <h1>Page Not Found</h1>
        <p>The service location or page you are looking for doesn't exist or has been moved.</p>

        <div className="not-found-actions">
          <Link to="/" className="nf-btn primary">
            <Home size={16} /> Back to Homepage
          </Link>
          <Link to="/services" className="nf-btn secondary">
            <ArrowLeft size={16} /> Explore Services
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
