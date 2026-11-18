'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'

const UNIVERSE_PARTICLE_VERTEX = `
precision highp float;
attribute vec3 aSeed;
attribute vec2 aTarget;
uniform vec2 uViewport;
uniform vec2 uPointer;
uniform float uTime;
uniform float uForm;
uniform float uBurst;
uniform float uScroll;
uniform float uPattern;
uniform float uForce;
uniform float uDpr;
uniform float uHeroHeight;
varying vec3 vColor;
varying float vAlpha;
const float PI = 3.14159265359;
vec3 spectrum(float t) {
  return 0.55 + 0.45 * cos(6.283185 * (t + vec3(0.02, 0.34, 0.65)));
}
void main() {
  float t = uTime * 0.18, angle = aSeed.x * PI * 2.0;
  float orbit = aSeed.y, depth = aSeed.z;
  vec2 center = vec2(uViewport.x * 0.54, uHeroHeight * 0.39);
  vec2 flow = center + vec2(cos(angle + t * (0.45 + orbit * 0.25)) * uViewport.x * (0.17 + orbit * 0.35), sin(angle * 2.0 + t) * uHeroHeight * (0.10 + orbit * 0.22));
  flow += vec2(sin(angle * 3.0 + t * 2.0), cos(angle * 2.0 - t)) * 18.0 * depth;
  vec2 p = mix(flow, aTarget, uForm);
  float wavePhase = aSeed.x * PI * 2.0 + uTime * 0.5;
  vec2 energy = vec2(uViewport.x * 0.5 + cos(wavePhase) * uViewport.x * (0.25 + orbit * 0.32), uHeroHeight * 0.4 + sin(wavePhase * 2.0) * (25.0 + orbit * 95.0));
  p = mix(p, energy, uBurst);
  vec2 infinity = vec2(uViewport.x * 0.5 + cos(angle) * uViewport.x * 0.32, uHeroHeight * 0.39 + sin(angle * 2.0) * uHeroHeight * 0.14);
  p = mix(p, infinity, uPattern * 0.8);
  vec2 portal = vec2(uViewport.x * 0.5 + cos(angle) * uViewport.x * (0.18 + orbit * 0.5), uHeroHeight + 40.0 + sin(angle) * (22.0 + orbit * 95.0));
  p = mix(p, portal, uScroll);
  vec2 delta = p - uPointer;
  float distanceToPointer = length(delta);
  float influence = exp(-distanceToPointer * distanceToPointer / 15000.0) * uForce;
  vec2 radial = delta / max(distanceToPointer, 1.0);
  p += radial * influence * (24.0 + depth * 24.0) + vec2(-radial.y, radial.x) * influence * 9.0;
  gl_Position = vec4(p.x / uViewport.x * 2.0 - 1.0, 1.0 - p.y / uViewport.y * 2.0, 0.0, 1.0);
  gl_PointSize = (1.05 + depth * 1.35 + influence * 0.5) * uDpr;
  vColor = mix(spectrum(aSeed.x * 0.74 + uTime * 0.025), vec3(0.45, 0.8, 1.0), uForm * 0.22);
  float emergence = smoothstep(0.0, 1.2, uTime);
  vAlpha = emergence * mix(0.24, 0.88, uForm) * (1.0 - uBurst * 0.35);
  vAlpha = mix(vAlpha, 0.48, uScroll);
}
`

const UNIVERSE_PARTICLE_FRAGMENT = `
precision highp float;
varying vec3 vColor;
varying float vAlpha;
void main() {
  float radius = length(gl_PointCoord - 0.5) * 2.0;
  float core = 1.0 - smoothstep(0.1, 1.0, radius);
  gl_FragColor = vec4(vColor, core * core * vAlpha);
}
`

const UNIVERSE_RIBBON_VERTEX = `
precision highp float;
uniform vec2 uViewport;
uniform vec2 uPointer;
uniform float uTime;
uniform float uScroll;
uniform float uHeroHeight;
uniform float uForce;
varying float vAlong;
varying float vEdge;
varying float vLayer;
void main() {
  float along = position.x, edge = position.y, layer = position.z;
  float t = along * 6.283185 + uTime * 0.12 + layer * 0.21;
  vec2 p = vec2(uViewport.x * 0.62 + cos(t) * uViewport.x * 0.32, uHeroHeight * 0.25 + sin(t * 2.0) * (55.0 + layer * 12.0));
  p.y += sin(t * 3.0 - uTime * 0.3 + layer) * 10.0;
  p.y = mix(p.y, uHeroHeight + 40.0 + sin(t) * (25.0 + layer * 19.0), uScroll);
  p.x = mix(p.x, uViewport.x * 0.5 + cos(t) * uViewport.x * 0.62, uScroll);
  float prism = exp(-dot(p - uPointer, p - uPointer) / 32000.0) * uForce;
  p += vec2(sin(t * 2.0), cos(t)) * prism * 14.0;
  p += vec2(-sin(t), cos(t * 2.0)) * edge * (1.2 + layer * 0.7 + prism * 2.0);
  gl_Position = vec4(p.x / uViewport.x * 2.0 - 1.0, 1.0 - p.y / uViewport.y * 2.0, 0.0, 1.0);
  vAlong = along;
  vEdge = edge;
  vLayer = layer;
}
`

const UNIVERSE_RIBBON_FRAGMENT = `
precision highp float;
uniform float uTime;
uniform float uScroll;
varying float vAlong;
varying float vEdge;
varying float vLayer;
void main() {
  vec3 color = 0.55 + 0.45 * cos(6.283185 * (vAlong * 0.8 + uTime * 0.018 + vLayer * 0.1 + vec3(0.03, 0.34, 0.67)));
  float edge = pow(max(0.0, 1.0 - abs(vEdge)), 1.5);
  float fade = smoothstep(0.0, 0.08, vAlong) * (1.0 - smoothstep(0.92, 1.0, vAlong));
  gl_FragColor = vec4(color, edge * fade * (0.13 + uScroll * 0.1));
}
`

function createUniverse(canvas: HTMLCanvasElement, host: HTMLElement): () => void {
  if (typeof window === 'undefined' || !THREE || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return () => {}
  }
  const T = THREE
  const small = matchMedia('(max-width: 760px)').matches
  const navAny = navigator as unknown as { deviceMemory?: number }
  const constrained = (navigator.hardwareConcurrency || 4) <= 4 || (navAny.deviceMemory && navAny.deviceMemory <= 4)
  const count = small ? (constrained ? 700 : 1100) : (constrained ? 2400 : 5200)

  let renderer: THREE.WebGLRenderer
  try {
    renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' })
  } catch {
    return () => {}
  }

  const dpr = Math.min(devicePixelRatio || 1, small ? 1.15 : 1.5)
  renderer.setPixelRatio(dpr)
  renderer.setClearColor(0x000000, 0)

  const scene = new T.Scene()
  const camera = new T.Camera()
  const uniforms = {
    uViewport: { value: new T.Vector2(1, 1) },
    uPointer: { value: new T.Vector2(-9999, -9999) },
    uTime: { value: 0 },
    uForm: { value: 0 },
    uBurst: { value: 0 },
    uScroll: { value: 0 },
    uPattern: { value: 0 },
    uForce: { value: 0 },
    uDpr: { value: dpr },
    uHeroHeight: { value: 1 },
  }

  const seed = new Float32Array(count * 3)
  const targets = new Float32Array(count * 2)
  let randomState = 4181
  const random = () => {
    randomState = (randomState * 1664525 + 1013904223) >>> 0
    return randomState / 4294967296
  }
  for (let i = 0; i < seed.length; i++) seed[i] = random()

  const geometry = new T.BufferGeometry()
  geometry.setAttribute('position', new T.BufferAttribute(new Float32Array(count * 3), 3))
  geometry.setAttribute('aSeed', new T.BufferAttribute(seed, 3))
  geometry.setAttribute('aTarget', new T.BufferAttribute(targets, 2))

  const material = new T.ShaderMaterial({
    uniforms,
    vertexShader: UNIVERSE_PARTICLE_VERTEX,
    fragmentShader: UNIVERSE_PARTICLE_FRAGMENT,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: T.AdditiveBlending,
  })
  const points = new T.Points(geometry, material)
  points.frustumCulled = false
  scene.add(points)

  const segments = small ? 96 : 180
  const layers = 3
  const vertices: number[] = []
  const indices: number[] = []
  for (let k = 0; k < layers; k++) {
    for (let i = 0; i <= segments; i++) {
      vertices.push(i / segments, -1, k, i / segments, 1, k)
      if (i < segments) {
        const b = k * (segments + 1) * 2 + i * 2
        indices.push(b, b + 1, b + 2, b + 1, b + 3, b + 2)
      }
    }
  }

  const ribbonGeometry = new T.BufferGeometry()
  ribbonGeometry.setAttribute('position', new T.Float32BufferAttribute(vertices, 3))
  ribbonGeometry.setIndex(indices)

  const ribbonMaterial = new T.ShaderMaterial({
    uniforms,
    vertexShader: UNIVERSE_RIBBON_VERTEX,
    fragmentShader: UNIVERSE_RIBBON_FRAGMENT,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    side: T.DoubleSide,
    blending: T.AdditiveBlending,
  })
  const ribbons = new T.Mesh(ribbonGeometry, ribbonMaterial)
  ribbons.frustumCulled = false
  scene.add(ribbons)

  let disposed = false
  let visible = false
  let raf = 0
  let last = 0
  let time = 0
  let width = 1
  let height = 1
  let heroHeight = 1
  let scrollTarget = 0
  let pattern = 0
  let pointerX = -9999
  let pointerY = -9999
  let forceTarget = 0
  let lastInteraction = 0
  let renderError = false
  let qualityReduced = false
  let slowFrames = 0

  const signalController = new AbortController()
  const signal = signalController.signal
  const heading = host.querySelector('.name') as HTMLElement | null

  const fit = () => {
    if (disposed) return
    width = host.clientWidth
    heroHeight = host.clientHeight
    height = heroHeight + (small ? 190 : 300)
    if (!width || !heroHeight) return
    renderer.setSize(width, height, false)
    canvas.style.height = height + 'px'
    uniforms.uViewport.value.set(width, height)
    uniforms.uHeroHeight.value = heroHeight

    if (!heading) return
    const raster = document.createElement('canvas')
    raster.width = Math.ceil(width)
    raster.height = Math.ceil(height)
    const context = raster.getContext('2d', { willReadFrequently: true })
    if (!context) return
    const box = host.getBoundingClientRect()
    context.fillStyle = 'white'
    context.textBaseline = 'alphabetic'

    Array.from(heading.children).forEach((letter) => {
      const b = letter.getBoundingClientRect()
      const style = getComputedStyle(letter)
      context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
      const metrics = context.measureText(letter.textContent || '')
      const ascent = metrics.fontBoundingBoxAscent || parseFloat(style.fontSize) * 0.8
      const descent = metrics.fontBoundingBoxDescent || parseFloat(style.fontSize) * 0.2
      const baseline = b.top - box.top + (b.height - ascent - descent) / 2 + ascent
      context.fillText(letter.textContent || '', b.left - box.left, baseline)
    })

    const pixels = context.getImageData(0, 0, raster.width, raster.height).data
    const candidates: number[] = []
    const hb = heading.getBoundingClientRect()
    const minY = Math.max(0, Math.floor(hb.top - box.top - 25))
    const maxY = Math.min(raster.height, Math.ceil(hb.bottom - box.top + 25))
    for (let y = minY; y < maxY; y += 3) {
      for (let x = 0; x < raster.width; x += 3) {
        if (pixels[(y * raster.width + x) * 4 + 3] > 150) candidates.push(x, y)
      }
    }
    const total = candidates.length / 2
    for (let i = 0; i < count; i++) {
      const j = Math.floor(random() * Math.max(total, 1)) * 2
      targets[i * 2] = total ? candidates[j] + random() * 1.5 : width * 0.5
      targets[i * 2 + 1] = total ? candidates[j + 1] + random() * 1.5 : heroHeight * 0.5
    }
    geometry.attributes.aTarget.needsUpdate = true
  }

  const smooth = (a: number, b: number, x: number) => {
    const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
    return t * t * (3 - 2 * t)
  }

  const frame = (now: number) => {
    raf = 0
    if (disposed || renderError || !visible || document.hidden) return
    const elapsed = last ? (now - last) / 1000 : 1 / 60
    const dt = Math.min(elapsed, 0.05)
    last = now
    time += dt

    if (elapsed > 0.035) slowFrames++
    else slowFrames = Math.max(0, slowFrames - 1)

    if (slowFrames > 75 && !qualityReduced) {
      geometry.setDrawRange(0, Math.floor(count * 0.65))
      renderer.setPixelRatio(1)
      renderer.setSize(width, height, false)
      uniforms.uDpr.value = 1
      qualityReduced = true
    }

    const u = uniforms
    u.uTime.value = time
    u.uForm.value = smooth(0.7, 2.8, time) * (1 - smooth(3.7, 5.5, time))
    u.uBurst.value = smooth(3.7, 5.5, time) * (1 - smooth(6.2, 8.0, time))
    u.uScroll.value += (scrollTarget - u.uScroll.value) * (1 - Math.exp(-dt * 5))
    u.uPointer.value.x += (pointerX - u.uPointer.value.x) * (1 - Math.exp(-dt * 10))
    u.uPointer.value.y += (pointerY - u.uPointer.value.y) * (1 - Math.exp(-dt * 10))
    u.uForce.value += (forceTarget - u.uForce.value) * (1 - Math.exp(-dt * 7))
    pattern *= Math.exp(-dt * 0.75)
    u.uPattern.value = pattern

    try {
      renderer.render(scene, camera)
    } catch {
      renderError = true
      host.classList.remove('universe-ready')
      host.classList.add('universe-fallback')
      return
    }

    if (time > 6.5) host.classList.remove('universe-intro')
    raf = requestAnimationFrame(frame)
  }

  const resume = () => {
    cancelAnimationFrame(raf)
    raf = 0
    last = 0
    if (visible && !document.hidden && !disposed && !renderError) {
      raf = requestAnimationFrame(frame)
    }
  }

  const readScroll = () => {
    const top = host.getBoundingClientRect().top
    scrollTarget = smooth(0.1, 0.9, Math.max(0, -top / heroHeight))
  }

  const move = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return
    const b = canvas.getBoundingClientRect()
    pointerX = e.clientX - b.left
    pointerY = e.clientY - b.top
    forceTarget = e.shiftKey ? -1 : 1
  }

  const leave = () => {
    forceTarget = 0
  }

  const resonate = () => {
    const now = performance.now()
    if (now - lastInteraction < 2000) return
    lastInteraction = now
    pattern = 1
  }

  host.addEventListener('pointermove', move, { passive: true, signal })
  host.addEventListener('pointerleave', leave, { signal })
  if (heading) heading.addEventListener('pointerenter', resonate, { signal })
  host.querySelectorAll('.btn').forEach((b) => b.addEventListener('focus', resonate, { signal }))
  window.addEventListener('scroll', readScroll, { passive: true, signal })
  document.addEventListener('visibilitychange', resume, { signal })

  canvas.addEventListener(
    'webglcontextlost',
    (e) => {
      e.preventDefault()
      renderError = true
      cancelAnimationFrame(raf)
      host.classList.remove('universe-ready', 'universe-intro')
      host.classList.add('universe-fallback')
    },
    { signal }
  )

  const io = new IntersectionObserver(
    ([e]) => {
      visible = e.isIntersecting
      resume()
    },
    { rootMargin: '150px' }
  )
  io.observe(canvas)

  let resizeTimer = 0
  const ro = new ResizeObserver(() => {
    window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(() => {
      fit()
      readScroll()
    }, 120)
  })
  ro.observe(host)

  fit()
  readScroll()

  try {
    renderer.render(scene, camera)
    if (!renderer.getContext().isContextLost()) {
      host.classList.add('universe-ready', 'universe-intro')
    }
  } catch {
    renderError = true
  }

  return () => {
    disposed = true
    cancelAnimationFrame(raf)
    window.clearTimeout(resizeTimer)
    signalController.abort()
    io.disconnect()
    ro.disconnect()
    host.classList.remove('universe-ready', 'universe-intro')
    geometry.dispose()
    material.dispose()
    ribbonGeometry.dispose()
    ribbonMaterial.dispose()
    renderer.dispose()
  }
}

export default function Core() {
  const cv = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = cv.current
    if (!canvas || !canvas.parentElement) return

    let stopped = false
    let cleanup = () => {}
    let idle: number | null = null
    let timer = 0

    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, options?: { timeout: number }) => number
      cancelIdleCallback?: (id: number) => void
    }

    const begin = () => {
      if (stopped) return
      const run = () => {
        if (!stopped && canvas.parentElement) {
          cleanup = createUniverse(canvas, canvas.parentElement)
        }
      }
      if (typeof win.requestIdleCallback === 'function') {
        idle = win.requestIdleCallback(run, { timeout: 500 })
      } else {
        timer = window.setTimeout(run, 50)
      }
    }

    const fontWait = new Promise<void>((resolve) => {
      timer = window.setTimeout(resolve, 1000)
    })

    Promise.race([
      document.fonts ? document.fonts.ready : Promise.resolve(),
      fontWait,
    ]).then(begin)

    return () => {
      stopped = true
      window.clearTimeout(timer)
      if (idle !== null && typeof win.cancelIdleCallback === 'function') {
        win.cancelIdleCallback(idle)
      }
      cleanup()
    }
  }, [])

  return <canvas className="core universe-canvas" ref={cv} aria-hidden="true"></canvas>
}
