import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Destinations.css'

gsap.registerPlugin(ScrollTrigger)

const india = [
  { name: 'Goa', tag: 'Beach Paradise', emoji: '🏖️' },
  { name: 'Kerala', tag: "God's Own Country", emoji: '🌴' },
  { name: 'Rajasthan', tag: 'Land of Kings', emoji: '🏰' },
  { name: 'Manali', tag: 'Mountain Retreat', emoji: '🏔️' },
  { name: 'Agra', tag: 'Taj Mahal', emoji: '🕌' },
  { name: 'Andaman', tag: 'Island Escape', emoji: '🌊' },
]

const usa = [
  { name: 'New York', tag: 'The Big Apple', emoji: '🗽' },
  { name: 'Las Vegas', tag: 'Entertainment Capital', emoji: '🎰' },
  { name: 'Miami', tag: 'Sun & Beach', emoji: '🌅' },
  { name: 'Los Angeles', tag: 'City of Angels', emoji: '🎬' },
  { name: 'San Francisco', tag: 'Golden Gate City', emoji: '🌉' },
  { name: 'Hawaii', tag: 'Tropical Paradise', emoji: '🌺' },
]

export default function Destinations() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.dest-header',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: '.dest-header', start: 'top 80%' } }
      )
      gsap.fromTo('.dest-col',
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 0.9, stagger: 0.25, ease: 'power3.out',
          scrollTrigger: { trigger: '.dest-cols', start: 'top 75%' }
        }
      )
      gsap.fromTo('.dest-card',
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1, scale: 1, duration: 0.6, stagger: 0.07, ease: 'back.out(1.4)',
          scrollTrigger: { trigger: '.dest-cols', start: 'top 70%' }
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="destinations" ref={sectionRef} className="section destinations">
      <div className="dest-header">
        <p className="section-label">Where We Go</p>
        <h2 className="section-title">Our <span>Destinations</span></h2>
        <p className="section-desc">
          Specialising in India and USA travel — explore iconic cities, hidden gems, and breathtaking landscapes.
        </p>
      </div>

      <div className="dest-cols">
        {[{ label: '🇮🇳 India', list: india, color: '#FF9933' }, { label: '🇺🇸 USA', list: usa, color: '#3C78D8' }].map(({ label, list, color }) => (
          <div key={label} className="dest-col glass-card">
            <div className="dest-col-header" style={{ borderColor: color }}>
              <h3 style={{ color }}>{label}</h3>
              <span className="dest-count">{list.length} Destinations</span>
            </div>
            <div className="dest-grid">
              {list.map(d => (
                <div key={d.name} className="dest-card" style={{ '--accent': color } as React.CSSProperties}>
                  <span className="dest-emoji">{d.emoji}</span>
                  <div>
                    <p className="dest-name">{d.name}</p>
                    <p className="dest-tag">{d.tag}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
