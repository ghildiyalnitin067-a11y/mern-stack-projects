import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Wrench, Zap, Sparkles, Snowflake, Hammer, Scissors,
  Star, MapPin, ChevronRight, X
} from 'lucide-react'
import toast from 'react-hot-toast'
import { apiFetch } from '../../api'
import './Services.css'

const CATEGORIES = [
  { icon: Wrench,        label: 'Plumbing' },
  { icon: Zap,           label: 'Electrical' },
  { icon: Sparkles,      label: 'Cleaning' },
  { icon: Snowflake,     label: 'AC Repair & Service' },
  { icon: Hammer,        label: 'Carpentry' },
  { icon: Scissors,      label: 'Salon & Beautician' },
]

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchServices = async () => {
    setLoading(true)
    try {
      let path = `/api/customer/services?q=${encodeURIComponent(searchQuery)}`
      if (selectedCategory !== 'All') {
        path += `&category=${encodeURIComponent(selectedCategory)}`
      }
      const res = await apiFetch(path)
      if (res.ok) {
        const data = await res.json()
        setServices(data)
      } else {
        toast.error('Failed to load services')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()

    if (searchQuery) {
      setSearchParams({ q: searchQuery })
    } else {
      setSearchParams({})
    }
  }, [selectedCategory])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchParams(searchQuery ? { q: searchQuery } : {})
    fetchServices()
  }

  const handleCategorySelect = (category) => {
    const nextCategory = selectedCategory === category ? 'All' : category
    setSelectedCategory(nextCategory)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchParams({})

    setTimeout(() => {
      fetchServices()
    }, 0)
  }

  return (
    <main className="services-page">
      <section className="services-header">
        <div className="services-header__inner">
          <h1>Browse All Services</h1>
          <p>Find trusted local professionals for any household task.</p>

          <form className="services-search" onSubmit={handleSearch}>
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search for plumber, cleaner, beautician..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button type="button" className="clear-search-btn" onClick={clearSearch}>
                <X size={18} />
              </button>
            )}
            <button type="submit" className="search-submit">Search</button>
          </form>

          <div className="services-categories">
            {CATEGORIES.map(({ icon: Icon, label }) => (
              <button
                key={label}
                className={`category-pill ${selectedCategory === label ? 'active' : ''}`}
                onClick={() => handleCategorySelect(label)}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="services-content">
        <div className="services-content__header">
          <h2>
            {selectedCategory === 'All' ? 'All Available Services' : `${selectedCategory} Services`}
            {searchQuery && ` matching "${searchQuery}"`}
          </h2>
          <span className="results-count">{services.length} providers found</span>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading catalog...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="empty-state">
            <h3>No services found</h3>
            <p>We couldn't find any partners matching your criteria. Try adjusting your filters.</p>
            <button className="reset-btn" onClick={() => { setSelectedCategory('All'); clearSearch(); }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="services-grid">
            {services.map(service => (
              <motion.div
                key={service._id}
                className="service-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="service-card__img">
                  <img src={service.image || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=400&auto=format&fit=crop"} alt={service.title} />
                  <div className="service-card__category">{service.category}</div>
                </div>
                <div className="service-card__body">
                  <h3>{service.title}</h3>
                  <div className="service-card__provider">
                    <Star size={14} fill="var(--tertiary)" stroke="var(--tertiary)" />
                    <span>{service.providerName}</span>
                  </div>
                  <p className="service-card__desc">
                    {service.description.substring(0, 80)}...
                  </p>
                  <div className="service-card__footer">
                    <span className="price">₹{service.price}</span>
                    <Link to={`/service/${service._id}`} className="book-btn">
                      Book Now <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Services
