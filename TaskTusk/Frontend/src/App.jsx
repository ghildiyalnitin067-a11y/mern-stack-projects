import { useState, useEffect } from 'react'
import { apiFetch } from './api'
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import Services from './pages/Services/Services'
import Testimonials from './pages/Testimonials/Testimonials'
import Auth from './pages/Auth/Auth'
import ServiceDetail from './pages/Service/ServiceDetail'
import CustomerDashboard from './pages/Customer/CustomerDashboard'
import MockCheckoutPage from './pages/Customer/MockCheckoutPage'
import ProviderDashboard from './pages/Provider/ProviderDashboard'
import PrivacyPolicy from './pages/Legal/PlatformPrivacy'
import TermsOfService from './pages/Legal/TermsOfService'
import Contact from './pages/Contact/Contact'
import NotFound from './pages/NotFound/NotFound'
import UserNotice from './components/UserNotice/UserNotice'
import Footer from './components/Footer/Footer'
import './App.css'

function AppContent() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)


  const checkAuth = async () => {
    try {
      const res = await apiFetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (err) {
      console.error('Session check failed:', err)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)

    if (userData.role === 'admin') {
      navigate('/admin/dashboard')
    } else if (userData.role === 'provider') {
      navigate('/provider/dashboard')
    } else {
      navigate('/customer/dashboard')
    }
  }

  const handleLogout = async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      navigate('/login')
    } catch (err) {
      console.error('Logout failed')
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="app">
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>

        <Route path="/" element={<Home user={user} />} />
        <Route path="/services" element={<Services />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/login" element={<Auth onLogin={handleLogin} mode="login" />} />
        <Route path="/signup" element={<Auth onLogin={handleLogin} mode="signup" />} />
        <Route path="/service/:id" element={<ServiceDetail user={user} />} />


        <Route
          path="/customer/dashboard"
          element={
            user && user.role === 'customer'
              ? <CustomerDashboard user={user} />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/checkout/:bookingId"
          element={
            user && user.role === 'customer'
              ? <MockCheckoutPage user={user} />
              : <Navigate to="/login" replace />
          }
        />


        <Route
          path="/provider/dashboard"
          element={
            user && user.role === 'provider'
              ? <ProviderDashboard user={user} />
              : <Navigate to="/login" replace />
          }
        />


        <Route path="*" element={<NotFound />} />
      </Routes>
      <UserNotice />
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "'Inter', sans-serif",
            fontSize: '14px',
            fontWeight: '500',
            borderRadius: '10px',
            padding: '12px 16px',
            boxShadow: '0 8px 24px rgba(9, 28, 53, 0.14)',
          },
          success: {
            iconTheme: { primary: '#006c47', secondary: '#fff' },
            style: { borderLeft: '4px solid #006c47' },
          },
          error: {
            iconTheme: { primary: '#ba1a1a', secondary: '#fff' },
            style: { borderLeft: '4px solid #ba1a1a' },
          },
        }}
      />
      <AppContent />
    </BrowserRouter>
  )
}

export default App
