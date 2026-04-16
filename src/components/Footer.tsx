import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  const scroll = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="footer">
      <div className="footer-wave">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,30 C480,60 960,0 1440,30 L1440,0 L0,0 Z" fill="#010B2E" />
        </svg>
      </div>

      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="logo-icon">✈</span>
            <span>Kramana <strong>Travel</strong></span>
          </div>
          <p className="footer-tagline">
            Your trusted travel partner for journeys between India and the USA. Making every trip a lifetime memory.
          </p>
          <div className="footer-socials">
            {['𝕏', 'in', 'f', '📷'].map(s => (
              <a key={s} href="#" className="social-btn" aria-label="social">{s}</a>
            ))}
          </div>
        </div>

        <div className="footer-col">
          <h4>Services</h4>
          <ul>
            <li><a href="#services" onClick={scroll('services')}>Holiday Packages</a></li>
            <li><a href="#services" onClick={scroll('services')}>Flight Booking</a></li>
            <li><a href="#services" onClick={scroll('services')}>Group Tours</a></li>
            <li><a href="#services" onClick={scroll('services')}>Honeymoon Trips</a></li>
            <li><a href="#services" onClick={scroll('services')}>Visa Assistance</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Destinations</h4>
          <ul>
            <li><a href="#destinations" onClick={scroll('destinations')}>Goa, India</a></li>
            <li><a href="#destinations" onClick={scroll('destinations')}>Kerala, India</a></li>
            <li><a href="#destinations" onClick={scroll('destinations')}>New York, USA</a></li>
            <li><a href="#destinations" onClick={scroll('destinations')}>Las Vegas, USA</a></li>
            <li><a href="#destinations" onClick={scroll('destinations')}>More →</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <ul>
            <li>📧 hello@kramanatravel.com</li>
            <li>📞 +91 98765 43210</li>
            <li>📞 +1 (800) 555 0199</li>
            <li>🕐 24/7 Support</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {year} Kramana Travel. All rights reserved.</p>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </footer>
  )
}
