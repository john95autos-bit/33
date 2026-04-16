import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Contact.css'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' })

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.contact-left',
        { opacity: 0, x: -60 },
        { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.contact-inner', start: 'top 75%' } }
      )
      gsap.fromTo('.contact-right',
        { opacity: 0, x: 60 },
        { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.contact-inner', start: 'top 75%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section id="contact" ref={sectionRef} className="section contact">
      <div className="contact-inner">
        <div className="contact-left">
          <p className="section-label">Get In Touch</p>
          <h2 className="section-title">Plan Your <span>Dream Trip</span></h2>
          <p className="section-desc" style={{ marginBottom: 40 }}>
            Fill in the form and our travel experts will get back to you within 24 hours with a personalised quote.
          </p>

          <div className="contact-info">
            {[
              { icon: '📍', label: 'Office', value: 'India & USA Offices' },
              { icon: '📧', label: 'Email', value: 'hello@kramanatravel.com' },
              { icon: '📞', label: 'Phone', value: '+91 98765 43210 | +1 (800) 555 0199' },
              { icon: '🕐', label: 'Support', value: '24/7 Available' },
            ].map(info => (
              <div key={info.label} className="info-row">
                <span className="info-icon">{info.icon}</span>
                <div>
                  <p className="info-label">{info.label}</p>
                  <p className="info-val">{info.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="contact-right glass-card">
          {sent ? (
            <div className="contact-success">
              <span className="success-icon">✅</span>
              <h3>Request Sent!</h3>
              <p>Thank you! Our team will reach out within 24 hours.</p>
              <button className="btn-primary" onClick={() => setSent(false)}>Send Another</button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <h3 className="form-title">Book Your Journey</h3>

              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input name="name" type="text" placeholder="Your name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input name="phone" type="tel" placeholder="+91 or +1" value={form.phone} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Service</label>
                  <select name="service" value={form.service} onChange={handleChange} required>
                    <option value="">Select a service</option>
                    <option>Holiday Package</option>
                    <option>Flight Booking</option>
                    <option>Both</option>
                    <option>Custom Request</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea name="message" placeholder="Tell us about your dream trip — destination, dates, budget..." rows={4} value={form.message} onChange={handleChange} required />
              </div>

              <button type="submit" className="btn-primary submit-btn">
                Send Enquiry ✈
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
