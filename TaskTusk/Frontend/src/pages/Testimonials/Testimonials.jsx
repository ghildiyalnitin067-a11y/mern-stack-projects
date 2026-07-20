import { Link } from 'react-router-dom'
import { Star, ArrowLeft, Quote } from 'lucide-react'
import './Testimonials.css'

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'Busy Parent & Marketing Executive',
    quote: '"TaskTusk has been a lifesaver. I found a fantastic tutor for my daughter within hours. The vetting process makes me feel so much safer than other sites."',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmGkgLv5z7NQaOjIBxoxu5WnKjW2-rzq6n7LcsbqkqIlDyybiCz6rN6C5kmxECkWDP1brafw7kHiuGc3C_6T0pnqcI8DhH_cID_306zFg8VotMn6L0-bwX5o_IMSXrTHIgeZ_yNQDdPyNAjf_ozb_LjxOR3aaQHnzZ4fP4MIRf3VT9JFHSvjm7gkkc6455JNceX6vcKzlV-ZMT0Ww2Aa3Znrzdrt0xE_RVOBY6nZLhrIHdWwWshyvioQ',
    stars: 5,
  },
  {
    id: 2,
    name: 'David Chen',
    role: 'Real Estate Operations Manager',
    quote: '"As a property manager, I need reliable pros fast. TaskTusk is my go-to for emergency repairs and routine maintenance. The quality is consistently high."',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTnzKyjDKS5IfYr9zD_M92ZIuEWiljGiBkKsE1Lmwn-LGLGsnQAMq6-9wwBLq8kYj73ZPn0ZaTy6lNQocADJMlPLcmnhETXMhiqQLoGLCH7Zp4KUs46kz51ivEprKNNwj5GDOiRY0yzo8lMvCKRJ4hr1pcT1Rb9LocfSXb_znfgRVzorPE03rhXilWC0NbWDN7slOYbub4dpnigouWWmIqDkyvXjqpgp5kVD-TSBhLCze9NgQKcjp3iQ',
    stars: 5,
  },
  {
    id: 3,
    name: 'Priya Sharma',
    role: 'First-time Homeowner',
    quote: '"I used TaskTusk for my apartment renovation and it was seamless. Every provider showed up on time, did great work, and the payment was completely secure."',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmGkgLv5z7NQaOjIBxoxu5WnKjW2-rzq6n7LcsbqkqIlDyybiCz6rN6C5kmxECkWDP1brafw7kHiuGc3C_6T0pnqcI8DhH_cID_306zFg8VotMn6L0-bwX5o_IMSXrTHIgeZ_yNQDdPyNAjf_ozb_LjxOR3aaQHnzZ4fP4MIRf3VT9JFHSvjm7gkkc6455JNceX6vcKzlV-ZMT0Ww2Aa3Znrzdrt0xE_RVOBY6nZLhrIHdWwWshyvioQ',
    stars: 5,
  },
]

const StarRow = ({ count }) => (
  <div className="star-row" aria-label={`${count} out of 5 stars`}>
    {Array.from({ length: count }).map((_, i) => (
      <Star key={i} size={18} fill="currentColor" strokeWidth={0} />
    ))}
  </div>
)

export default function Testimonials() {
  return (
    <main className="testimonials-page">
      <div className="section-container">
        
        <header className="testimonials-page__header">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <h1 className="testimonials-page__title">What our community is saying</h1>
          <p className="testimonials-page__subtitle">
            Real stories from people who trust our marketplace for their everyday needs.
          </p>
        </header>

        <div className="testimonials-scroll-wrapper">
          <div className="testimonials-scroll-container">
            {TESTIMONIALS.map((t) => (
              <blockquote key={t.id} className="testimonial-card">
                <Quote className="testimonial-card__quote-icon" size={32} />
                <div className="testimonial-card__avatar">
                  <img src={t.avatar} alt={t.name} />
                </div>
                <div className="testimonial-card__body">
                  <StarRow count={t.stars} />
                  <p className="testimonial-card__quote">{t.quote}</p>
                  <footer>
                    <h4 className="testimonial-card__name">{t.name}</h4>
                    <p className="testimonial-card__role">{t.role}</p>
                  </footer>
                </div>
              </blockquote>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}
