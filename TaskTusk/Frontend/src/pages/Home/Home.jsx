import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CountUpRaw from 'react-countup'
const CountUp = typeof CountUpRaw === 'function' ? CountUpRaw : (CountUpRaw.default || CountUpRaw)
import {
  Search, Wrench, Zap, Sparkles, GraduationCap, Hammer, Leaf,
  Star, Clock, MapPin, ArrowRight, ShieldCheck, Globe, Share2,
  ChevronDown,
} from 'lucide-react'
import toast from 'react-hot-toast'

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
  { icon: GraduationCap, label: 'Tutoring' },
  { icon: Hammer,        label: 'Carpentry' },
  { icon: Leaf,          label: 'Gardening' },
]

const PROVIDERS = [
  {
    id: 1,
    name: 'Elena Rodriguez',
    service: 'Premium Home Cleaning',
    rating: '5.0',
    available: 'Available Today',
    distance: '2.4 miles',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDP_mTWQGeBZ6Vr-y90OqRs8_aSejijFq6uUJ9q_3d3VCMrVA8ALr6d9aRNCsAFI4suu3HQNJaZK79XsGo5kVFkVBMf9i2rFcEHR_RbzV827O4tqSoyr08nziDh43o-mpqrkQ6fFjFL-thsKN04O2A-1zK1rNYesrdZDHnN4-r1l3dexmAUbPury4n5SkX2SPB_iwt9UDnkMejb5HOiODZWS2ozPXIoMUxc5_gzYYQZaqBSBk6qbxaunw',
  },
  {
    id: 2,
    name: 'Dr. James Wilson',
    service: 'Mathematics & Physics Tutor',
    rating: '4.9',
    available: 'Next: Mon 2 PM',
    distance: 'Online / In-person',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnYNaQn79aOJyolhvsUozCu0IOHYruu3FheNA1WuKOKh5tWHLWbRcK_Sk5RM_ynxsh7Py_ezv5OsMKFGpr0zOm975yregkCF1MEW2qDTLPS4OjiERGQ4_Kpo0R-nU9g4GKIJ7q7Q1VOnGSG7EgljJkD5Dwct40qjhxNwjsmNelOG9Lz-zwKjGsPBbOopWHi1tshrk4Tu8IaYx4_TBaIIm6-4Hjtx6ZGHHUTtCStBTXcDcdfdqTDM5YHA',
  },
  {
    id: 3,
    name: 'Mark Thompson',
    service: 'Certified Electrician',
    rating: '4.8',
    available: 'Emergency 24/7',
    distance: '5.1 miles',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGuV00TTh4RZQeXTTYOZaDUDGvWtwf5xLBJBfDcAEgZSvqMzQHs9-K4plJjuwDCmjqkAp-_fRZxGMXYCJG9T1e5dnagjbY-p2ZaNxc60LTjHRs-yEN_zxRTXHmAaTGBfqFV1WKet7C5yDSSYJYjmQTIBLHyS-bel3qiGq05zx3rURTdShyfEqwxM7ZFSAtQECkl6YvWou3ZdPBGN7xBfn79htwJKoOrdnfwes3napQQ0_YDYLFe-lV0g',
  },
]

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      toast.error('Please enter a service to search for')
      return
    }
    toast.loading(`Finding "${searchQuery}" providers near you…`, { duration: 2200 })
  }

  const handleBook = (name) => {
    toast.success(`Booking request sent to ${name}! 🎉`)
  }

  const handleJoinProvider = () => {
    toast.success(`Welcome! Let's get you set up as a provider.`, { icon: '🚀' })
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
              Trusted by 50,000+ customers
            </motion.span>

            <motion.h1 variants={heroItemVariants} className="hero__headline">
              Expert help for every{' '}
              <em>household task.</em>
            </motion.h1>

            <motion.p variants={heroItemVariants} className="hero__desc">
              Connect with local, verified service professionals for everything
              from emergency plumbing to academic tutoring.
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
                placeholder="What do you need help with?"
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
                    onClick={() => toast(`Browsing ${label} services…`, { icon: '🔍' })}
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
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_4K1Nc2muPe-aL3hccgZBnUDZvzltRXMEJ1ZyEH3foXcBHyyIBfyS7TnZlIUcRR2QKUnq5NNuRZvUNu_Mds9HcF0S1DH0ez7FTkXWsJZzM8Ulg5dbx2P0_M2IzKa-pqQuBVhGlKNMA5Jrcrd3-gzwosxtwzFs0XqKeli2hVhtq56CuqfkzFKIbyA6ZLDeQ1v0CEERDDDMjFejmbDHWInEFFD9YyeY5_Nf04sJYNy0UnCXxX6sDqshsA"
                    alt="David Miller"
                  />
                </div>
                <div>
                  <h3 className="bento-provider__name">David Miller</h3>
                  <p className="bento-provider__role">Master Plumber · 12 yrs exp.</p>
                </div>
                <div className="bento-provider__rating">
                  <Star size={17} fill="currentColor" strokeWidth={0} />
                  4.9 (248 reviews)
                </div>
              </div>
              <p className="bento-provider__review">
                "Fixed my leaking pipe in under an hour. Very professional and clean!"
              </p>
            </div>

            <div className="bento-stat">
              <span className="bento-stat__number">
                <CountUp end={15} suffix="k+" duration={2.5} enableScrollSpy scrollSpyOnce />
              </span>
              <p className="bento-stat__label">Verified Pros</p>
            </div>

            <div className="bento-image">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuALdfc2SyqSfEeSUqleW-WYkGAWBCf34oOqIHwmBInKKv3jdcALw3cLJRmyNIqlSAZ5fKa32yv8huvViEeoXlPClHGMaZZXfju1YV6HNNcZrGpLG7Be10kTix64En7Ax3ng6v9uZQmSogCmRhOYXJ5PeMYuPiaojtTXwi2NorlJTWDb-FiNKCGoSQk8ryjWj4vkQyw4c0uXs65fTHWJb89FjcKD-OsUQHdt3yodhbz2H3ziIeteZ1Vuqw"
                alt="Electrical tools"
              />
              <div className="bento-image__overlay">
                <p>Trusted Electrical Solutions</p>
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

      <section className="providers-section" id="services" aria-label="Top-rated providers">
        <div className="section-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease }}
          >
            <div>
              <h2 className="section-title">Top-Rated Pros Nearby</h2>
              <p className="section-subtitle">Hand-picked providers with exceptional track records.</p>
            </div>
            <a href="#" className="view-all-link">
              View all providers <ArrowRight size={16} />
            </a>
          </motion.div>

          <motion.div
            className="providers__grid"
            variants={cardContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {PROVIDERS.map((p) => (
              <motion.article
                key={p.id}
                className="provider-card"
                variants={cardVariants}
                whileHover={{ y: -6, boxShadow: '0 12px 32px rgba(9,28,53,0.14)' }}
                transition={{ duration: 0.25 }}
              >
                <div className="provider-card__img-wrap">
                  <img src={p.image} alt={p.name} />
                  <span className="verified-badge">
                    <span className="verified-badge__dot"></span>
                    Verified
                  </span>
                </div>

                <div className="provider-card__body">
                  <div className="provider-card__top">
                    <div>
                      <h3 className="provider-card__name">{p.name}</h3>
                      <p className="provider-card__service">{p.service}</p>
                    </div>
                    <div className="provider-card__rating">
                      <Star size={13} fill="currentColor" strokeWidth={0} />
                      {p.rating}
                    </div>
                  </div>

                  <div className="provider-card__meta">
                    <span className="provider-card__meta-row">
                      <Clock size={14} /> {p.available}
                    </span>
                    <span className="provider-card__meta-row">
                      <MapPin size={14} /> {p.distance}
                    </span>
                  </div>

                  <motion.button
                    className="provider-card__btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleBook(p.name)}
                    aria-label={`Book ${p.name}`}
                  >
                    Book Service
                  </motion.button>
                </div>
              </motion.article>
            ))}
          </motion.div>
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
                Ready to grow your service business?
              </h2>
              <p className="cta-banner__desc">
                Join thousands of professionals earning more through TaskTusk.
                Set your own rates, choose your schedule, and get paid securely.
              </p>
              <div className="cta-banner__actions">
                <motion.button
                  className="cta-btn cta-btn--green"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleJoinProvider}
                >
                  Join as a Provider
                </motion.button>
                <motion.button
                  className="cta-btn cta-btn--outline"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Learn How It Works
                </motion.button>
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
                  <p className="cta-lead-card__title">Kitchen Faucet Repair</p>
                </div>
              </div>

              <div className="cta-lead-card__details">
                <div className="cta-lead-card__row">
                  <span>Est. Earnings</span>
                  <span className="cta-lead-card__value">$120.00</span>
                </div>
                <div className="cta-lead-card__row">
                  <span>Distance</span>
                  <span>1.5 miles away</span>
                </div>
              </div>

              <button className="cta-lead-card__accept">Accept Task</button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      
    </main>
  )
}

export default Home
