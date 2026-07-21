import React, { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import './Contact.css'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.')
      return
    }

    setSubmitting(true)
    const toastId = toast.loading('Sending your message...')

    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
      toast.success('Thank you! Your message has been received.', { id: toastId })
    }, 1000)
  }

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-info-card">
          <span className="contact-badge">Support &amp; Inquiries</span>
          <h1>Get in Touch</h1>
          <p>Have questions about TaskTusk marketplace, provider onboarding, or booking support? We are here to help.</p>

          <div className="info-items">
            <div className="info-item">
              <Mail className="info-icon" size={20} />
              <div>
                <h4>Email Support</h4>
                <p>support@tasktusk.com</p>
              </div>
            </div>
            <div className="info-item">
              <Phone className="info-icon" size={20} />
              <div>
                <h4>Helpdesk Hotline</h4>
                <p>+91 1800 123 4567</p>
              </div>
            </div>
            <div className="info-item">
              <MapPin className="info-icon" size={20} />
              <div>
                <h4>Headquarters</h4>
                <p>Tech Park, Indiranagar, Bengaluru, India</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-card">
          {submitted ? (
            <div className="contact-success">
              <CheckCircle2 size={48} className="success-icon" />
              <h2>Message Sent!</h2>
              <p>Our team will get back to your email ({formData.email}) within 24 hours.</p>
              <button onClick={() => setSubmitted(false)} className="reset-btn">Send Another Message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <h2>Send us a Message</h2>
              <div className="form-group">
                <label>Your Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Ananya Roy"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Inquiry Topic</label>
                <select name="subject" value={formData.subject} onChange={handleChange}>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Customer Booking Support">Customer Booking Support</option>
                  <option value="Provider Registration">Provider Registration</option>
                  <option value="Platform Billing / Revenue">Platform Billing / Revenue</option>
                </select>
              </div>

              <div className="form-group">
                <label>Your Message *</label>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we assist you today?"
                  required
                />
              </div>

              <button type="submit" className="submit-contact-btn" disabled={submitting}>
                {submitting ? 'Sending...' : <><Send size={16} /> Submit Message</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default Contact
