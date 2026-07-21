import { useState } from 'react'
import { ShieldAlert, Key, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import { apiFetch } from '../api'
import './AdminLogin.css'

const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const toastId = toast.loading('Authenticating credentials...')

    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })

      if (res.ok) {
        const data = await res.json()
        const user = data.user

        if (user.role !== 'admin') {
          toast.error('Access Denied: Not authorized as Administrator', { id: toastId })

          await apiFetch('/api/auth/logout')
          setSubmitting(false)
          return
        }

        toast.success('Login successful!', { id: toastId })
        onLoginSuccess(user)
      } else {
        const err = await res.json()
        toast.error(err.error || 'Authentication failed', { id: toastId })
      }
    } catch (err) {
      toast.error('Connection to auth server failed', { id: toastId })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-card__header">
          <div className="admin-logo-circle">
            <ShieldAlert size={28} />
          </div>
          <h2>Admin Login</h2>
          <p>Please sign in to the admin dashboard.</p>
        </div>

        <form onSubmit={handleLoginSubmit} className="admin-login-form">
          <div className="form-group">
            <label><Mail size={14} /> Admin Email Address</label>
            <input
              type="email"
              required
              placeholder="e.g. admin@tasktusk.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label><Key size={14} /> Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="admin-login-submit"
            disabled={submitting}
          >
            {submitting ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="admin-login-card__footer">
          <span>Admin Access Only</span>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
