import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './Navbar.css'

const links = ['Home', 'Services', 'Destinations', 'About', 'Contact']

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { opacity: 0, y: -40 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    )

    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id.toLowerCase())
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <nav ref={navRef} className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <a href="#home" className="nav-logo" onClick={e => handleNav(e, 'home')}>
        <span className="logo-icon">✈</span>
        <span className="logo-text">Kramana <strong>Travel</strong></span>
      </a>

      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        {links.map(link => (
          <li key={link}>
            <a href={`#${link.toLowerCase()}`} onClick={e => handleNav(e, link)}>
              {link}
            </a>
          </li>
        ))}
      </ul>

      <a href="#contact" className="nav-cta btn-primary" onClick={e => handleNav(e, 'contact')}>
        Book Now
      </a>

      <button className="hamburger" onClick={() => setMenuOpen(p => !p)} aria-label="menu">
        <span className={menuOpen ? 'open' : ''} />
        <span className={menuOpen ? 'open' : ''} />
        <span className={menuOpen ? 'open' : ''} />
      </button>
    </nav>
  )
}
