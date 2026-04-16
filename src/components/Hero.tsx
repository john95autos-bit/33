import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import './Hero.css'

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const w = canvas.clientWidth
    const h = canvas.clientHeight

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100)
    camera.position.z = 3.2

    const group = new THREE.Group()
    scene.add(group)

    // Inner solid sphere
    const innerMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0x023E8A, transparent: true, opacity: 0.75 })
    )
    group.add(innerMesh)

    // Wireframe icosahedron
    group.add(new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.01, 5),
      new THREE.MeshBasicMaterial({ color: 0x00B4D8, wireframe: true, transparent: true, opacity: 0.45 })
    ))

    // Outer glow
    group.add(new THREE.Mesh(
      new THREE.SphereGeometry(1.18, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0x0077B6, transparent: true, opacity: 0.06, side: THREE.BackSide })
    ))

    // Surface dots (Fibonacci sphere)
    const dotCount = 400
    const dotPos = new Float32Array(dotCount * 3)
    for (let i = 0; i < dotCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / dotCount)
      const theta = Math.sqrt(dotCount * Math.PI) * phi
      dotPos[i * 3]     = Math.sin(phi) * Math.cos(theta)
      dotPos[i * 3 + 1] = Math.cos(phi)
      dotPos[i * 3 + 2] = Math.sin(phi) * Math.sin(theta)
    }
    const dotGeo = new THREE.BufferGeometry()
    dotGeo.setAttribute('position', new THREE.BufferAttribute(dotPos, 3))
    group.add(new THREE.Points(dotGeo, new THREE.PointsMaterial({ color: 0x90E0EF, size: 0.025 })))

    // Background stars
    const starCount = 2000
    const starPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount * 3; i++) starPos[i] = (Math.random() - 0.5) * 30
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xCAF0F8, size: 0.012, transparent: true, opacity: 0.55 })))

    // Orbit ring
    const ringGeo = new THREE.TorusGeometry(1.35, 0.004, 8, 100)
    const ringMesh = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0x00B4D8, transparent: true, opacity: 0.3 }))
    ringMesh.rotation.x = Math.PI / 2.8
    group.add(ringMesh)

    group.rotation.x = 0.15

    let animId: number
    const animate = () => {
      animId = requestAnimationFrame(animate)
      group.rotation.y += 0.004
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      const nw = canvas.clientWidth
      const nh = canvas.clientHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    window.addEventListener('resize', onResize)

    // GSAP hero entrance
    const tl = gsap.timeline({ delay: 0.2 })
    tl.fromTo('.hero-badge',    { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.7 })
      .fromTo('.hero-title',    { opacity: 0, y: 70 },  { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.3')
      .fromTo('.hero-sub',      { opacity: 0, y: 40 },  { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
      .fromTo('.hero-btns',     { opacity: 0, y: 30 },  { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
      .fromTo('.hero-scroll',   { opacity: 0 },         { opacity: 1, duration: 0.6 }, '-=0.2')
      .fromTo('.hero-canvas',   { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, 0.1)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
    }
  }, [])

  return (
    <section id="home" className="hero">
      <div className="hero-bg" />

      <div className="hero-left">
        <div className="hero-badge">✈ India &amp; USA Specialists</div>

        <h1 className="hero-title">
          Discover the <br />
          <span>World</span> with<br />
          Kramana Travel
        </h1>

        <p className="hero-sub">
          Premium holiday packages &amp; flight booking tailored for travellers
          between <strong>India</strong> and the <strong>USA</strong>. Your
          dream journey starts here.
        </p>

        <div className="hero-btns">
          <a
            href="#services"
            className="btn-primary"
            onClick={e => { e.preventDefault(); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }) }}
          >
            Explore Packages ↗
          </a>
          <a
            href="#contact"
            className="btn-outline"
            onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}
          >
            Book a Trip
          </a>
        </div>

        <div className="hero-stats">
          {[['2000+', 'Happy Travellers'], ['50+', 'Destinations'], ['10+', 'Years Experience']].map(([n, l]) => (
            <div key={l} className="hero-stat">
              <span className="stat-num">{n}</span>
              <span className="stat-lbl">{l}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-right">
        <canvas ref={canvasRef} className="hero-canvas" />
      </div>

      <div className="hero-scroll">
        <span>Scroll to explore</span>
        <div className="scroll-line" />
      </div>

      <div className="hero-wave">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#023E8A" />
        </svg>
      </div>
    </section>
  )
}
