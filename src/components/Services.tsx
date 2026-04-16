import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Services.css'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    icon: '🏖️',
    title: 'Holiday Packages',
    subtitle: 'Curated Experiences',
    desc: 'Handcrafted holiday packages for every type of traveller — beach escapes, cultural immersions, adventure treks, and luxury getaways across India and the USA.',
    features: ['Beach Holidays', 'Cultural Tours', 'Honeymoon Specials', 'Family Vacations', 'Adventure Trips', 'Luxury Resorts'],
    cta: 'View Packages',
    gradient: 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)',
  },
  {
    icon: '✈️',
    title: 'Flight Booking',
    subtitle: 'Best Fares Guaranteed',
    desc: 'Seamless flight booking with the best fares on direct and connecting flights between India and USA. Multiple airlines, flexible dates, 24/7 support.',
    features: ['India ↔ USA Direct Flights', 'Best Fare Guarantee', 'Multi-city Booking', 'Flexible Dates', '24/7 Support', 'Group Bookings'],
    cta: 'Book Flights',
    gradient: 'linear-gradient(135deg, #023E8A 0%, #0077B6 100%)',
  },
]

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.services-header',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: '.services-header', start: 'top 80%' } }
      )
      gsap.fromTo('.service-card',
        { opacity: 0, y: 80 },
        {
          opacity: 1, y: 0, duration: 0.9, stagger: 0.2, ease: 'power3.out',
          scrollTrigger: { trigger: '.services-grid', start: 'top 75%' }
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="services" ref={sectionRef} className="section services">
      <div className="services-header">
        <p className="section-label">What We Offer</p>
        <h2 className="section-title">Our <span>Services</span></h2>
        <p className="section-desc">
          Everything you need for a perfect journey — from planning to landing.
        </p>
      </div>

      <div className="services-grid">
        {services.map(s => (
          <div key={s.title} className="service-card glass-card">
            <div className="service-top" style={{ background: s.gradient }}>
              <span className="service-icon">{s.icon}</span>
              <div>
                <p className="service-sub">{s.subtitle}</p>
                <h3 className="service-title">{s.title}</h3>
              </div>
            </div>

            <div className="service-body">
              <p className="service-desc">{s.desc}</p>
              <ul className="service-features">
                {s.features.map(f => (
                  <li key={f}>
                    <span className="feat-dot" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="btn-primary service-btn"
                onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}
              >
                {s.cta} →
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
