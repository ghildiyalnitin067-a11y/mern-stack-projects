import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Phone, MapPin, Briefcase, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { apiFetch } from '../../api'
import './Auth.css'

const Auth = ({ onLogin, mode: initialMode }) => {
  const navigate = useNavigate()
  const [mode, setMode] = useState(initialMode || 'login')
  const [role, setRole] = useState('customer')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter email and password')
      return
    }

    if (mode === 'signup' && (!name || !role || !phone || !address)) {
      toast.error('Please fill in all registration fields')
      return
    }

    setLoading(true)
    const toastId = toast.loading(mode === 'login' ? 'Authenticating credentials...' : 'Creating your account...')

    try {
      const endpoint = mode === 'login' ? 'login' : 'register'
      const bodyData = mode === 'login'
        ? { email, password }
        : { name, email, password, role, phone, address }

      const res = await apiFetch(`/api/auth/${endpoint}`, {
        method: 'POST',
        body: JSON.stringify(bodyData)
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(mode === 'login' ? 'Logged in successfully!' : 'Account registered successfully!', { id: toastId })
        onLogin(data.user)
      } else {
        toast.error(data.error || 'Authentication failed', { id: toastId })
      }
    } catch (err) {
      toast.error('Connection error. Server is offline.', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'signup' : 'login')
    setName('')
    setEmail('')
    setPassword('')
    setPhone('')
    setAddress('')
  }

  return (
    <div className="auth-page">
      <div className="auth-blob blob-1" />
      <div className="auth-blob blob-2" />

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="auth-card__header">
          <h2>{mode === 'login' ? 'Welcome back' : 'Create an Account'}</h2>
          <p>{mode === 'login' ? 'Log in to manage your bookings and tasks' : 'Join TaskTusk as a customer or service provider'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <>

              <div className="auth-form__role-select">
                <label className="field-label">I want to register as a:</label>
                <div className="role-segments">
                  <button
                    type="button"
                    className={`role-seg-btn ${role === 'customer' ? 'active' : ''}`}
                    onClick={() => setRole('customer')}
                  >
                    <User size={15} />
                    <span>Customer</span>
                  </button>
                  <button
                    type="button"
                    className={`role-seg-btn ${role === 'provider' ? 'active' : ''}`}
                    onClick={() => setRole('provider')}
                  >
                    <Briefcase size={15} />
                    <span>Provider</span>
                  </button>
                </div>
              </div>

              <div className="auth-input-group">
                <label><User size={14} /> Full Name</label>
                <div className="input-with-icon">
                  <User size={16} className="input-icon" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Verma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          <div className="auth-input-group">
            <label><Mail size={14} /> Email Address</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label><Lock size={14} /> Password</label>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {mode === 'signup' && (
            <>
              <div className="auth-input-group">
                <label><Phone size={14} /> Phone Number</label>
                <div className="input-with-icon">
                  <Phone size={16} className="input-icon" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 99887 76655"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label><MapPin size={14} /> Primary Address</label>
                <div className="input-with-icon">
                  <MapPin size={16} className="input-icon" />
                  <input
                    type="text"
                    required
                    placeholder="Sector/Area, City, Pincode"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading
              ? 'Processing...'
              : mode === 'login' ? 'Log In to Dashboard' : 'Complete Registration'
            }
          </button>
        </form>

        <div className="auth-card__footer">
          <p>
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
            <button type="button" onClick={toggleMode} className="toggle-mode-btn">
              {mode === 'login' ? 'Sign up here' : 'Log in here'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Auth
