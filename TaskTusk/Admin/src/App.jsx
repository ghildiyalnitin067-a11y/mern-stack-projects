import { useState, useEffect } from 'react'
import { apiFetch } from './api'
import { Toaster } from 'react-hot-toast'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  const [adminUser, setAdminUser] = useState(null)
  const [checkingSession, setCheckingSession] = useState(true)

  const verifyAdminSession = async () => {
    try {
      const res = await apiFetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        if (data.user && data.user.role === 'admin') {
          setAdminUser(data.user)
        }
      }
    } catch (err) {
      console.error('Session verify failed:', err)
    } finally {
      setCheckingSession(false)
    }
  }

  const handleAdminLogout = async () => {
    try {
      const res = await apiFetch('/api/auth/logout', {
        method: 'POST'
      })
      if (res.ok) {
        setAdminUser(null)
      }
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  useEffect(() => {
    verifyAdminSession()
  }, [])

  if (checkingSession) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f9f9ff',
        gap: '16px'
      }}>
        <div className="spinner"></div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#434654', fontWeight: 600 }}>
          Verifying Admin Access...
        </p>
      </div>
    )
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      {adminUser ? (
        <AdminDashboard onLogout={handleAdminLogout} />
      ) : (
        <AdminLogin onLoginSuccess={setAdminUser} />
      )}
    </>
  )
}

export default App
