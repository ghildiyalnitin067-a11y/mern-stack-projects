import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import Testimonials from './pages/Testimonials/Testimonials'
import './App.css'
import Footer from './components/Footer/Footer'

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
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

      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/footer" element={<Footer/> }/>
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
