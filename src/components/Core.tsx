'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'

export default function Core() {
  const cv = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const el = cv.current
    if (!el) return
    const host = el.parentElement
    if (!host) return
    const rm = matchMedia('(prefers-reduced-motion: reduce)').matches

    let ren: THREE.WebGLRenderer
    try {
      ren = new THREE.WebGLRenderer({ canvas: el, alpha: true, antialias: true, powerPreference: 'low-power' })
    } catch {
      return
    }

    ren.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5))
    ren.outputColorSpace = THREE.SRGBColorSpace
    ren.toneMapping = THREE.ACESFilmicToneMapping
    ren.toneMappingExposure = 1.15

    const sc = new THREE.Scene()
    const cam = new THREE.PerspectiveCamera(40, 1, 0.1, 60)
    cam.position.z = 8

    // colourful studio for reflections
    const envS = new THREE.Scene()
    const lights: [number, [number, number, number], number][] = [
      [0x4f6eff, [-9, 3, 4], 3],
      [0xff5fc4, [9, -2, 3], 3],
      [0x37e3d0, [0, 9, -2], 2.5],
      [0xffa66b, [3, -9, 4], 2],
      [0x8b5cf6, [0, 0, -10], 2.5],
      [0xffffff, [-3, 6, 9], 4],
    ]
    lights.forEach(([c, p, k]) => {
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(c).multiplyScalar(k),
        side: THREE.DoubleSide,
      })
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), mat)
      mesh.position.set(p[0], p[1], p[2])
      mesh.lookAt(0, 0, 0)
      envS.add(mesh)
    })

    const pm = new THREE.PMREMGenerator(ren)
    const env = pm.fromScene(envS, 0.04).texture
    pm.dispose()

    const obj = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.05, 0.36, 240, 36, 2, 3),
      new THREE.MeshStandardMaterial({
        color: 0xdfe6ff,
        metalness: 1,
        roughness: 0.16,
        envMap: env,
        envMapIntensity: 1.25,
      })
    )
    sc.add(obj)

    const m = { x: 0, y: 0 }
    const cur = { x: 0, y: 0 }

    const fit = () => {
      const w = host.clientWidth
      const h = host.clientHeight
      const wide = w > 900
      ren.setSize(w, h, false)
      cam.aspect = w / h
      cam.updateProjectionMatrix()
      obj.userData.bx = wide ? 2.7 : 0
      obj.userData.by = wide ? 0.2 : 1.9
      obj.scale.setScalar(wide ? 1 : Math.min(1, w / 640))
      if (rm) {
        obj.position.set(obj.userData.bx, obj.userData.by, 0)
        ren.render(sc, cam)
      }
    }

    let raf = 0
    let vis = true
    const t0 = performance.now()

    const frame = () => {
      const t = (performance.now() - t0) / 1000
      cur.x += (m.x - cur.x) * 0.05
      cur.y += (m.y - cur.y) * 0.05
      obj.rotation.set(t * 0.16 + cur.y * 0.7, t * 0.22 + cur.x * 1.1, 0)
      obj.position.set(
        obj.userData.bx + cur.x * 0.5,
        obj.userData.by + Math.sin(t * 0.8) * 0.12 - cur.y * 0.3,
        0
      )
      ren.render(sc, cam)
      if (vis && !rm) raf = requestAnimationFrame(frame)
    }

    const onm = (e: PointerEvent) => {
      m.x = e.clientX / innerWidth - 0.5
      m.y = e.clientY / innerHeight - 0.5
    }

    fit()
    frame()

    const io = new IntersectionObserver(([e]) => {
      vis = e.isIntersecting
      if (vis && !rm) {
        cancelAnimationFrame(raf)
        frame()
      }
    })
    io.observe(host)

    const ro = new ResizeObserver(fit)
    ro.observe(host)
    addEventListener('pointermove', onm, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      removeEventListener('pointermove', onm)
      ren.dispose()
    }
  }, [])

  return <canvas className="core" ref={cv} aria-hidden="true"></canvas>
}
