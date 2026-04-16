import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './PlaneScroll.css'

gsap.registerPlugin(ScrollTrigger)

// Waypoints as % of viewport (x, y, rotation)
const WP = [
  { x: 112, y: 8,  r: -18 },
  { x: 82,  y: 5,  r: -10 },
  { x: 55,  y: 14, r: 2   },
  { x: 28,  y: 28, r: 14  },
  { x: 12,  y: 48, r: 22  },
  { x: 30,  y: 62, r: -5  },
  { x: 62,  y: 68, r: -14 },
  { x: 80,  y: 80, r: 6   },
  { x: 50,  y: 88, r: 12  },
  { x: 18,  y: 94, r: 18  },
  { x: -12, y: 98, r: 22  },
]

// SVG path string matching the waypoints above (for the dashed trail)
const SVG_PATH =
  'M 112,8 C 97,4 88,3 82,5 C 68,8 60,16 55,14 C 42,11 34,22 28,28 C 20,36 13,44 12,48 C 10,54 20,60 30,62 C 44,65 58,68 62,68 C 72,68 78,76 80,80 C 82,84 68,88 50,88 C 36,88 26,91 18,94 C 8,97 -12,98 -12,98'

export default function PlaneScroll() {
  const planeRef  = useRef<HTMLDivElement>(null)
  const trailRef  = useRef<SVGPathElement>(null)
  const glowRef   = useRef<SVGPathElement>(null)

  useEffect(() => {
    const plane = planeRef.current!
    const trail = trailRef.current!
    const glow  = glowRef.current!

    // Animate trail dash reveal
    const len = trail.getTotalLength()
    gsap.set([trail, glow], { strokeDasharray: len, strokeDashoffset: len })

    // Pixel positions from % of viewport
    const kf = WP.map(w => ({
      x: (w.x / 100) * window.innerWidth  - 26,
      y: (w.y / 100) * window.innerHeight - 26,
      rotation: w.r,
    }))

    gsap.set(plane, { x: kf[0].x, y: kf[0].y, rotation: kf[0].rotation, opacity: 0 })

    const st = {
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 2,
    }

    // Plane flight
    const tl = gsap.timeline({ scrollTrigger: st })
    tl.to(plane, { opacity: 1, duration: 0.03 })
    kf.slice(1).forEach(pos =>
      tl.to(plane, { x: pos.x, y: pos.y, rotation: pos.rotation, ease: 'power1.inOut', duration: 0.1 })
    )
    tl.to(plane, { opacity: 0, duration: 0.02 })

    // Trail reveal
    gsap.to([trail, glow], {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: { ...st, scrub: 2.2 },
    })

    const onResize = () => {
      const newKf = WP.map(w => ({
        x: (w.x / 100) * window.innerWidth  - 26,
        y: (w.y / 100) * window.innerHeight - 26,
        rotation: w.r,
      }))
      gsap.set(plane, { x: newKf[0].x, y: newKf[0].y })
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <>
      {/* Dashed trail SVG */}
      <svg className="plane-trail-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Glow line */}
        <path
          ref={glowRef}
          d={SVG_PATH}
          fill="none"
          stroke="rgba(0,180,216,0.25)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Dashed line */}
        <path
          ref={trailRef}
          d={SVG_PATH}
          fill="none"
          stroke="rgba(144,224,239,0.5)"
          strokeWidth="0.3"
          strokeDasharray="1.8 2.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Airplane */}
      <div ref={planeRef} className="plane-fly">
        <div className="plane-glow-ring" />
        <svg width="52" height="52" viewBox="0 0 52 52">
          <defs>
            <filter id="plane-glow">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <g transform="translate(26,26)" filter="url(#plane-glow)">
            {/* Fuselage */}
            <ellipse cx="2" cy="0" rx="15" ry="3.8" fill="#00B4D8" />
            {/* Nose cone */}
            <path d="M 15,-1 Q 22,0 15,1 Z" fill="#CAF0F8" />
            {/* Main wing */}
            <path d="M 1,-13 L 7,0 L 1,13 L 3,0 Z" fill="#90E0EF" opacity="0.88" />
            {/* Tail fin */}
            <path d="M -13,-7 L -8,0 L -13,7 L -11,0 Z" fill="#90E0EF" opacity="0.75" />
            {/* Engine pod */}
            <ellipse cx="4" cy="7" rx="5" ry="2.2" fill="#0077B6" />
            <ellipse cx="4" cy="7" rx="2" ry="2.2" fill="#023E8A" />
            {/* Window strip */}
            <ellipse cx="4" cy="0" rx="5" ry="1.2" fill="#CAF0F8" opacity="0.3" />
          </g>
        </svg>
        {/* Exhaust dots */}
        <div className="plane-exhaust">
          <span /><span /><span />
        </div>
      </div>
    </>
  )
}
