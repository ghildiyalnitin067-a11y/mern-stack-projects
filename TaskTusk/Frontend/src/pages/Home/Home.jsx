import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import CountUpRaw from 'react-countup'
const CountUp = typeof CountUpRaw === 'function' ? CountUpRaw : (CountUpRaw.default || CountUpRaw)
import {
  Search, Wrench, Zap, Sparkles, Snowflake, Hammer, Scissors,
  Star, MapPin, ShieldCheck, ChevronDown, Clock, ChevronRight
} from 'lucide-react'
import toast from 'react-hot-toast'
import { apiFetch } from '../../api'
import './Home.css'

const ease = [0.22, 1, 0.36, 1]

const heroTextVariants = {
  hidden:   {},
  visible:  { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
}

const heroItemVariants = {
  hidden:   { opacity: 0, y: 28 },
  visible:  { opacity: 1, y: 0,  transition: { duration: 0.65, ease } },
}

const heroBentoVariants = {
  hidden:   { opacity: 0, x: 48 },
  visible:  { opacity: 1, x: 0,  transition: { duration: 0.85, ease, delay: 0.25 } },
}

const cardContainerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const cardVariants = {
  hidden:   { opacity: 0, y: 36 },
  visible:  { opacity: 1, y: 0,  transition: { duration: 0.6, ease } },
}

const CATEGORIES = [
  { icon: Wrench,        label: 'Plumbing' },
  { icon: Zap,           label: 'Electrical' },
  { icon: Sparkles,      label: 'Cleaning' },
  { icon: Snowflake,     label: 'AC Repair & Service' },
  { icon: Hammer,        label: 'Carpentry' },
  { icon: Scissors,      label: 'Salon & Beautician' },
]

const Home = ({ user }) => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)


  const fetchFeaturedServices = async () => {
    setLoading(true)
    try {
      const res = await apiFetch('/api/customer/services')
      if (res.ok) {
        const data = await res.json()
        setServices(data.slice(0, 6))
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
    fetchFeaturedServices()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/services?q=${encodeURIComponent(searchQuery)}`)
    } else {
      navigate(`/services`)
    }
  }

  const handleCategorySelect = (category) => {

    navigate(`/services`)
  }

  return (
    <main>

      <section className="hero" aria-label="Hero">
        <div className="hero__grid">
          <motion.div
            className="hero__text"
            variants={heroTextVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.span variants={heroItemVariants} className="hero__eyebrow">
              <ShieldCheck size={15} />
              India's Most Trusted Home Services
            </motion.span>

            <motion.h1 variants={heroItemVariants} className="hero__headline">
              Expert help for every{' '}
              <em>household task.</em>
            </motion.h1>

            <motion.p variants={heroItemVariants} className="hero__desc">
              Connect with local, verified service professionals in India. AC repair,
              deep cleaning, plumbing, beauty services, and more at fixed prices.
            </motion.p>

            <motion.form
              variants={heroItemVariants}
              className="search-bar"
              onSubmit={handleSearch}
              role="search"
            >
              <Search size={20} className="search-bar__icon" />
              <input
                id="hero-search"
                type="text"
                className="search-bar__input"
                placeholder="Search for plumber, cleaner, beautician..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search for a service"
              />
              <motion.button
                type="submit"
                className="search-bar__btn"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Search
              </motion.button>
            </motion.form>

            <motion.div variants={heroItemVariants} className="categories">
              <p className="categories__label">Popular Categories</p>
              <div className="categories__pills">
                {CATEGORIES.map(({ icon: Icon, label }) => (
                  <motion.button
                    key={label}
                    className="category-pill"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCategorySelect(label)}
                    aria-label={`Browse ${label}`}
                  >
                    <Icon size={16} />
                    {label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero__bento"
            variants={heroBentoVariants}
            initial="hidden"
            animate="visible"
            aria-hidden="true"
          >
            <div className="bento-provider">
              <div className="bento-provider__top">
                <div className="bento-provider__avatar">
                  <img
                    src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=200&auto=format&fit=crop"
                    alt="Rajesh Kumar"
                  />
                </div>
                <div>
                  <h3 className="bento-provider__name">Rajesh Kumar</h3>
                  <p className="bento-provider__role">AC Specialist · 8 yrs exp.</p>
                </div>
                <div className="bento-provider__rating">
                  <Star size={17} fill="currentColor" strokeWidth={0} />
                  4.8 (142 reviews)
                </div>
              </div>
              <p className="bento-provider__review">
                "Repaired my split AC condenser fast and clean. Charge was ₹349. Highly recommended!"
              </p>
            </div>

            <div className="bento-stat">
              <span className="bento-stat__number">
                <CountUp end={5} suffix="k+" duration={2.5} enableScrollSpy scrollSpyOnce />
              </span>
              <p className="bento-stat__label">Verified Services</p>
            </div>

            <div className="bento-image">
              <img
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=300&auto=format&fit=crop"
                alt="Cleaning service in India"
              />
              <div className="bento-image__overlay">
                <p>Premium Home Cleaning</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="hero__scroll"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <ChevronDown size={22} />
        </motion.div>
      </section>


      <section className="providers-section" id="services" aria-label="Available services">
        <div className="section-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease }}
          >
            <div>
              <h2 className="section-title">Featured Service Listings</h2>
              <p className="section-subtitle">
                Fixed-price services from verified local experts.
              </p>
            </div>
            <Link to="/services" className="view-all-link">
              Explore All Services <ChevronRight size={16} />
            </Link>
          </motion.div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Fetching active catalog listings...</p>
            </div>
          ) : (
            <motion.div
              className="providers__grid"
              variants={cardContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              {services.map((s) => (
                <motion.article
                  key={s._id}
                  className="provider-card"
                  variants={cardVariants}
                  whileHover={{ y: -6, boxShadow: '0 12px 32px rgba(9,28,53,0.14)' }}
                  transition={{ duration: 0.25 }}
                  onClick={() => navigate(`/service/${s._id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="provider-card__img-wrap">
                    <img src={s.image || "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=200&auto=format&fit=crop"} alt={s.title} />
                    <span className="verified-badge">
                      <span className="verified-badge__dot"></span>
                      Verified
                    </span>
                  </div>

                  <div className="provider-card__body">
                    <div className="provider-card__top">
                      <div>
                        <h4 className="provider-card__service">{s.providerName}</h4>
                        <h3 className="provider-card__name" style={{ marginTop: '2px', fontSize: '16px' }}>{s.title}</h3>
                        <p className="provider-card__category" style={{ fontSize: '12px', color: 'var(--outline)', marginTop: '2px' }}>{s.category}</p>
                      </div>
                      <div className="provider-card__rating">
                        <Star size={13} fill="currentColor" strokeWidth={0} />
                        {s.rating ? s.rating.toFixed(1) : '5.0'}
                      </div>
                    </div>

                    <div className="provider-card__meta">
                      <p className="provider-desc-truncate" style={{ fontSize: '13px', color: 'var(--on-surface-variant)', height: '40px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {s.description}
                      </p>
                      <span className="provider-card__price-tag" style={{ display: 'block', marginTop: '10px' }}>
                        ₹{s.price} <span className="price-unit">/ visit</span>
                      </span>
                    </div>

                    <motion.button
                      className="provider-card__btn"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/service/${s._id}`)
                      }}
                      aria-label={`View details of ${s.title}`}
                    >
                      View Details &amp; Book
                    </motion.button>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </section>


      <section className="cta-section" aria-label="Join as a provider">
        <div className="section-container">
          <motion.div
            className="cta-banner"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease }}
          >
            <div className="cta-banner__blob" aria-hidden="true" />

            <div className="cta-banner__text">
              <h2 className="cta-banner__headline">
                Grow your services business in India
              </h2>
              <p className="cta-banner__desc">
                Register as an AC specialist, cleaning partner, electrician, or beautician to receive
                local booking requests. Set your rates, choose your schedule, and get paid securely.
              </p>
              <div className="cta-banner__actions">
                <Link to="/signup" className="cta-btn cta-btn--green">
                  Register as a Partner
                </Link>
                <Link to="/login" className="cta-btn cta-btn--outline">
                  Partner Log In
                </Link>
              </div>
            </div>

            <motion.div
              className="cta-lead-card"
              whileHover={{ rotate: 0, y: -6 }}
              transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              aria-hidden="true"
            >
              <div className="cta-lead-card__header">
                <div className="cta-lead-card__icon">
                  <Wrench size={22} />
                </div>
                <div>
                  <p className="cta-lead-card__tag">New Lead</p>
                  <p className="cta-lead-card__title">Bathroom Leakage Repair</p>
                </div>
              </div>

              <div className="cta-lead-card__details">
                <div className="cta-lead-card__row">
                  <span>Fixed Payout</span>
                  <span className="cta-lead-card__value">₹249.00</span>
                </div>
                <div className="cta-lead-card__row">
                  <span>Distance</span>
                  <span>1.2 km away</span>
                </div>
              </div>

              <button className="cta-lead-card__accept">Accept Job</button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

export default Home
