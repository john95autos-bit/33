import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './FlightSection.css'

gsap.registerPlugin(ScrollTrigger)

/* ─── Build 3-D airplane ─── */
function buildPlane(): THREE.Group {
  const root = new THREE.Group()

  const bodyM  = new THREE.MeshStandardMaterial({ color: 0xF0F7FF, metalness: 0.28, roughness: 0.30 })
  const wingM  = new THREE.MeshStandardMaterial({ color: 0xD8EAF8, metalness: 0.22, roughness: 0.38 })
  const engM   = new THREE.MeshStandardMaterial({ color: 0x3E4A58, metalness: 0.80, roughness: 0.20 })
  const rimM   = new THREE.MeshStandardMaterial({ color: 0x1E2A34, metalness: 0.90, roughness: 0.15 })
  const glassM = new THREE.MeshStandardMaterial({ color: 0x1A70BB, metalness: 0.0, roughness: 0.05, transparent: true, opacity: 0.75 })
  const liveM  = new THREE.MeshStandardMaterial({ color: 0x00B4D8, metalness: 0.05, roughness: 0.55 })
  const winM   = new THREE.MeshStandardMaterial({ color: 0x3A8FCC, metalness: 0.0, roughness: 0.05, transparent: true, opacity: 0.80 })

  // fuselage
  const mGeo = new THREE.CylinderGeometry(0.44, 0.44, 7.2, 32); mGeo.rotateZ(Math.PI / 2)
  root.add(new THREE.Mesh(mGeo, bodyM))
  const nGeo = new THREE.CylinderGeometry(0.44, 0.03, 2.5, 32); nGeo.rotateZ(Math.PI / 2)
  const nose = new THREE.Mesh(nGeo, bodyM); nose.position.x = 4.85; root.add(nose)
  const tGeo = new THREE.CylinderGeometry(0.44, 0.24, 1.5, 32); tGeo.rotateZ(Math.PI / 2)
  const tail = new THREE.Mesh(tGeo, bodyM); tail.position.x = -4.35; root.add(tail)

  // cockpit
  const cGeo = new THREE.SphereGeometry(0.36, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.38)
  const cock = new THREE.Mesh(cGeo, glassM); cock.position.set(3.9, 0.16, 0); cock.rotation.z = -0.22
  root.add(cock)

  // swept wings
  const ws = new THREE.Shape()
  ws.moveTo(0.58, 0); ws.lineTo(-0.98, 0); ws.lineTo(-1.60, 5.0); ws.lineTo(-0.18, 5.0); ws.closePath()
  const wExt = { depth: 0.075, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 2 }
  const wGeo = new THREE.ExtrudeGeometry(ws, wExt); wGeo.rotateX(-Math.PI / 2)
  const w1 = new THREE.Mesh(wGeo, wingM); w1.position.set(-0.2, -0.04, 0.44); root.add(w1)
  const w2 = new THREE.Mesh(wGeo, wingM); w2.position.set(-0.2, -0.04, -0.515); w2.scale.z = -1; root.add(w2)

  // engines
  ;[2.15, -2.15].forEach(sz => {
    const nac = new THREE.Mesh(
      (() => { const g = new THREE.CylinderGeometry(0.19, 0.17, 1.2, 22); g.rotateZ(Math.PI / 2); return g })(), engM)
    nac.position.set(-0.18, -0.31, sz); root.add(nac)
    const rim = new THREE.Mesh(
      (() => { const g = new THREE.TorusGeometry(0.19, 0.028, 10, 26); g.rotateY(Math.PI / 2); return g })(), rimM)
    rim.position.set(0.42, -0.31, sz); root.add(rim)
    const ply = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.13, 0.13), wingM)
    ply.position.set(-0.18, -0.16, sz); root.add(ply)
  })

  // vertical tail fin
  const vs = new THREE.Shape()
  vs.moveTo(-0.08, 0); vs.lineTo(-0.95, 0); vs.lineTo(-0.68, 1.25); vs.lineTo(0.18, 1.18); vs.closePath()
  const vFin = new THREE.Mesh(new THREE.ExtrudeGeometry(vs, { depth: 0.07, bevelEnabled: false }), wingM)
  vFin.position.set(-3.95, 0.44, -0.035); root.add(vFin)

  // horizontal stabilizers
  ;[1, -1].forEach(s => {
    const hs = new THREE.Shape()
    hs.moveTo(0.28, 0); hs.lineTo(-0.62, 0); hs.lineTo(-0.88, s * 1.5); hs.lineTo(0.12, s * 1.5); hs.closePath()
    const hsGeo = new THREE.ExtrudeGeometry(hs, { depth: 0.06, bevelEnabled: false }); hsGeo.rotateX(-Math.PI / 2)
    const hsMesh = new THREE.Mesh(hsGeo, wingM); hsMesh.position.set(-4.55, 0.08, s * 0.44); root.add(hsMesh)
  })

  // livery stripe
  const strGeo = new THREE.CylinderGeometry(0.448, 0.448, 6.9, 32, 1, true, 2.85, 0.72)
  strGeo.rotateZ(Math.PI / 2); root.add(new THREE.Mesh(strGeo, liveM))

  // windows
  for (let i = 0; i < 17; i++) {
    const ww = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.09, 0.445), winM)
    ww.position.set(-2.8 + i * 0.42, 0.34, 0); root.add(ww)
  }

  return root
}

/* ─── Cloud cluster helper ─── */
function makeCloudCluster(y: number, x: number, z: number): THREE.Group {
  const g = new THREE.Group()
  g.position.set(x, y, z)
  const mat = new THREE.MeshLambertMaterial({ color: 0xDDEEFF, transparent: true, opacity: 0.22 })
  const cfg: [number, number, number, number][] = [
    [0, 0, 0, 1.1], [-1.3, 0.4, 0.3, 0.85], [1.2, 0.3, -0.2, 0.9],
    [-0.5, 0.7, -0.4, 0.7], [1.8, 0.1, 0.5, 0.65], [-1.8, 0.2, -0.5, 0.75],
  ]
  cfg.forEach(([cx, cy, cz, r]) => {
    const s = new THREE.Mesh(new THREE.SphereGeometry(r, 7, 5), mat)
    s.position.set(cx, cy, cz); g.add(s)
  })
  return g
}

/* ─── Component ─── */
export default function FlightSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const p1Ref = useRef<HTMLDivElement>(null)
  const p2Ref = useRef<HTMLDivElement>(null)
  const p3Ref = useRef<HTMLDivElement>(null)
  const p4Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const W = window.innerWidth
    const H = window.innerHeight

    /* renderer */
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current!, antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace

    /* scene / camera */
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 200)
    // slight 3/4 angle — offset right so plane appears center-screen
    camera.position.set(2.5, 1.5, 14)
    camera.lookAt(0, 0, 0)

    /* lighting */
    scene.add(new THREE.AmbientLight(0x7BAFC0, 1.0))
    const sun = new THREE.DirectionalLight(0xFFFFFF, 2.2); sun.position.set(8, 12, 10); scene.add(sun)
    const fill = new THREE.DirectionalLight(0x55AACC, 0.6); fill.position.set(-8, -4, 5); scene.add(fill)
    const rim  = new THREE.DirectionalLight(0xAADDFF, 0.5); rim.position.set(0, -10, 12); scene.add(rim)

    /* atmosphere particles */
    const pCount = 250
    const pPos   = new Float32Array(pCount * 3)
    for (let i = 0; i < pCount; i++) {
      pPos[i*3]   = (Math.random() - 0.5) * 50
      pPos[i*3+1] = (Math.random() - 0.5) * 40
      pPos[i*3+2] = -Math.random() * 14 - 2
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xCCEEFF, size: 0.06, transparent: true, opacity: 0.55 })))

    /* cloud clusters at different altitudes */
    const clouds = [
      makeCloudCluster( 7,  -5,  1),
      makeCloudCluster( 5,   6, -2),
      makeCloudCluster( 3,  -3,  4),
      makeCloudCluster( 1,   5,  2),
      makeCloudCluster(-1,  -6, -1),
      makeCloudCluster(-3,   4,  3),
      makeCloudCluster(-5,  -3, -3),
      makeCloudCluster(-7,   7,  0),
    ]
    clouds.forEach(c => scene.add(c))

    /* airplane — nose pointing DOWN */
    const airplane = buildPlane()
    airplane.rotation.z = -Math.PI / 2   // nose → -Y (downward)
    airplane.rotation.x = 0.10           // slight forward pitch for realism
    airplane.position.set(0, 8.5, 0)     // starts above viewport
    scene.add(airplane)

    /* contrail meshes — they extend ABOVE the plane (its tail is at +Y in world) */
    const trailMat = new THREE.MeshBasicMaterial({ color: 0xEEF6FF, transparent: true, opacity: 0.45 })
    const makeCylTrail = () => {
      const g = new THREE.CylinderGeometry(0.025, 0.055, 1, 8)
      return new THREE.Mesh(g, trailMat.clone())
    }
    const trail1 = makeCylTrail(); scene.add(trail1)
    const trail2 = makeCylTrail(); scene.add(trail2)

    const updateTrails = (py: number) => {
      const topOfScene = 12
      const len = Math.max(0.1, topOfScene - py - 4.8)
      const cy  = py + 4.8 + len / 2
      trail1.scale.y = len
      trail1.position.set(-0.31, cy, 2.15)
      trail2.scale.y = len
      trail2.position.set(-0.31, cy, -2.15)
      ;[trail1, trail2].forEach(t => {
        (t.material as THREE.MeshBasicMaterial).opacity = Math.min(0.5, len * 0.06)
      })
    }
    updateTrails(8.5)

    /* render loop */
    let animId: number
    const tick = () => { animId = requestAnimationFrame(tick); renderer.render(scene, camera) }
    tick()

    /* ── GSAP scroll timeline ── */
    gsap.set([p1Ref.current, p2Ref.current, p3Ref.current, p4Ref.current], { opacity: 0, y: 0, x: 0 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        pin: true,
        start: 'top top',
        end: '+=400%',
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress
          /* plane descends from y=8.5 to y=-8.5 */
          const newY = 8.5 - 17 * p
          airplane.position.y = newY
          /* subtle horizontal sway (banking) */
          airplane.position.x = Math.sin(p * Math.PI * 1.5) * 1.2
          /* subtle roll that follows the sway */
          airplane.rotation.x = 0.10 + Math.sin(p * Math.PI * 1.5 + 0.5) * 0.06
          updateTrails(newY)
        },
      },
    })

    /* ── content panels ── */

    // Panel 1 — "Your Journey Begins" (top, 0–20%)
    tl.fromTo(p1Ref.current,
      { opacity: 0, y: -40 },
      { opacity: 1, y: 0, duration: 0.12, ease: 'power2.out' }, 0.02)
    tl.to(p1Ref.current, { opacity: 0, y: -30, duration: 0.08 }, 0.20)

    // Panel 2 — Holiday Packages (right side, 25–52%)
    tl.fromTo(p2Ref.current,
      { opacity: 0, x: 120 },
      { opacity: 1, x: 0, duration: 0.14, ease: 'power3.out' }, 0.24)
    tl.to(p2Ref.current, { opacity: 0, x: 120, duration: 0.10 }, 0.52)

    // Panel 3 — Flight Booking (left side, 52–78%)
    tl.fromTo(p3Ref.current,
      { opacity: 0, x: -120 },
      { opacity: 1, x: 0, duration: 0.14, ease: 'power3.out' }, 0.54)
    tl.to(p3Ref.current, { opacity: 0, x: -120, duration: 0.10 }, 0.78)

    // Panel 4 — Destinations (bottom, 80–100%)
    tl.fromTo(p4Ref.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.14, ease: 'power2.out' }, 0.81)

    /* resize */
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      ScrollTrigger.getAll().forEach(t => t.kill())
      renderer.dispose()
    }
  }, [])

  return (
    <section ref={sectionRef} className="flight-section">
      <div className="flight-sky" />
      <canvas ref={canvasRef} className="flight-canvas" />

      {/* Panel 1 — top centre */}
      <div ref={p1Ref} className="fp fp-top">
        <span className="fp-tag">Kramana Travel</span>
        <h2>Your journey<br /><span>starts here</span></h2>
        <p>Scroll to fly</p>
      </div>

      {/* Panel 2 — right side */}
      <div ref={p2Ref} className="fp fp-right glass-card">
        <span className="fp-icon">🏖️</span>
        <h3>Holiday Packages</h3>
        <p>Curated escapes across India &amp; USA</p>
        <ul>
          <li>✦ Beach &amp; Island Holidays</li>
          <li>✦ Cultural Heritage Tours</li>
          <li>✦ Honeymoon Specials</li>
          <li>✦ Luxury Resort Stays</li>
        </ul>
      </div>

      {/* Panel 3 — left side */}
      <div ref={p3Ref} className="fp fp-left glass-card">
        <span className="fp-icon">✈️</span>
        <h3>Flight Booking</h3>
        <p>Best fares on every route</p>
        <ul>
          <li>✦ India ↔ USA Direct Flights</li>
          <li>✦ Best Fare Guarantee</li>
          <li>✦ Flexible Date Search</li>
          <li>✦ 24 / 7 Support</li>
        </ul>
      </div>

      {/* Panel 4 — bottom centre */}
      <div ref={p4Ref} className="fp fp-bottom">
        <p className="fp-sub">We specialise in</p>
        <div className="fp-flags">
          <div className="fp-country">
            <span>🇮🇳</span>
            <strong>India</strong>
            <small>Goa · Kerala · Rajasthan · Manali</small>
          </div>
          <div className="fp-divider">↔</div>
          <div className="fp-country">
            <span>🇺🇸</span>
            <strong>USA</strong>
            <small>New York · Vegas · Miami · LA</small>
          </div>
        </div>
      </div>

      <div className="flight-hint">
        <div className="scroll-arrow" />
        <span>scroll to fly</span>
      </div>
    </section>
  )
}
