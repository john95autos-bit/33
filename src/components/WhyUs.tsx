import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './WhyUs.css'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { num: '2000+', label: 'Happy Travellers' },
  { num: '50+',   label: 'Destinations' },
  { num: '10+',   label: 'Years Experience' },
  { num: '24/7',  label: 'Customer Support' },
]

const features = [
  { icon: '🎯', title: 'Personalised Itineraries', desc: 'Every trip is custom-designed to match your preferences, budget, and travel style.' },
  { icon: '💰', title: 'Best Price Guarantee', desc: 'We match or beat any comparable package. Get the most value for every rupee or dollar.' },
  { icon: '🛡️', title: 'Fully Secured Booking', desc: 'Safe, encrypted payments with full booking protection and cancellation policies.' },
  { icon: '📞', title: '24/7 Travel Support', desc: 'Our team is always on-call — before, during, and after your trip, across all time zones.' },
  { icon: '✈️', title: 'Exclusive Airline Deals', desc: 'Direct partnerships with major airlines give you access to fares not available elsewhere.' },
  { icon: '🌐', title: 'End-to-End Service', desc: 'From visa guidance to hotel check-in — we handle every detail so you don\'t have to.' },
]

export default function WhyUs() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.whyus-header',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: '.whyus-header', start: 'top 80%' } }
      )
      gsap.fromTo('.stat-box',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, scrollTrigger: { trigger: '.whyus-stats', start: 'top 80%' } }
      )
      gsap.fromTo('.feature-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: '.features-grid', start: 'top 75%' }
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="section whyus">
      <div className="whyus-header">
        <p className="section-label">Why Kramana</p>
        <h2 className="section-title">Why Choose <span>Us</span></h2>
        <p className="section-desc">
          Over a decade of crafting unforgettable journeys for Indian and American travellers.
        </p>
      </div>

      <div className="whyus-stats">
        {stats.map(s => (
          <div key={s.label} className="stat-box glass-card">
            <span className="stat-big">{s.num}</span>
            <span className="stat-lbl">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="features-grid">
        {features.map(f => (
          <div key={f.title} className="feature-card glass-card">
            <span className="feat-icon">{f.icon}</span>
            <h4 className="feat-title">{f.title}</h4>
            <p className="feat-desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
