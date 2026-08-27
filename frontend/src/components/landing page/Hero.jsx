import { useEffect, useRef, useState, useCallback } from 'react'

function ProbabilityBars({ size = 'large' }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const stateRef = useRef({
    p0: 0.55,
    p1: 0.45,
    target0: 0.55,
    target1: 0.45,
    collapsed: false,
    collapsedTo: 0,
    collapseTimer: 0,
    phase: 'fluctuating', // 'fluctuating' | 'collapsing' | 'collapsed' | 'recovering'
    tick: 0,
  })

  const isLarge = size === 'large'
  const W = isLarge ? 280 : 220
  const H = isLarge ? 220 : 170

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.scale(dpr, dpr)
    canvas.style.width = W + 'px'
    canvas.style.height = H + 'px'

    const barWidth = isLarge ? 60 : 48
    const barGap = isLarge ? 50 : 36
    const barMaxH = isLarge ? 150 : 115
    const barBottom = isLarge ? 185 : 142
    const startX = (W - (barWidth * 2 + barGap)) / 2

    function lerp(a, b, t) { return a + (b - a) * t }

    function draw() {
      const s = stateRef.current
      s.tick++

      ctx.clearRect(0, 0, W, H)

      // Phase logic
      if (s.phase === 'fluctuating') {
        if (s.tick % 30 === 0) {
          const r = 0.35 + Math.random() * 0.3
          s.target0 = r
          s.target1 = 1 - r
        }
        s.p0 = lerp(s.p0, s.target0, 0.04)
        s.p1 = lerp(s.p1, s.target1, 0.04)
        s.collapseTimer++
        if (s.collapseTimer > 240 + Math.random() * 180) {
          s.phase = 'collapsing'
          s.collapsedTo = Math.random() < s.p0 ? 0 : 1
          s.collapseTimer = 0
        }
      } else if (s.phase === 'collapsing') {
        const t0 = s.collapsedTo === 0 ? 0.98 : 0.02
        const t1 = s.collapsedTo === 1 ? 0.98 : 0.02
        s.p0 = lerp(s.p0, t0, 0.12)
        s.p1 = lerp(s.p1, t1, 0.12)
        if (Math.abs(s.p0 - t0) < 0.01) {
          s.phase = 'collapsed'
          s.collapseTimer = 0
        }
      } else if (s.phase === 'collapsed') {
        s.collapseTimer++
        if (s.collapseTimer > 90) {
          s.phase = 'recovering'
          s.target0 = 0.4 + Math.random() * 0.2
          s.target1 = 1 - s.target0
          s.collapseTimer = 0
        }
      } else if (s.phase === 'recovering') {
        s.p0 = lerp(s.p0, s.target0, 0.03)
        s.p1 = lerp(s.p1, s.target1, 0.03)
        if (Math.abs(s.p0 - s.target0) < 0.01) {
          s.phase = 'fluctuating'
        }
      }

      // Draw bars
      const h0 = s.p0 * barMaxH
      const h1 = s.p1 * barMaxH

      // |0⟩ bar
      const x0 = startX
      ctx.fillStyle = '#E4EEE3'
      ctx.strokeStyle = '#1E3A2B'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.roundRect(x0, barBottom - h0, barWidth, h0, [6, 6, 0, 0])
      ctx.fill()
      ctx.stroke()

      // |1⟩ bar
      const x1 = startX + barWidth + barGap
      ctx.fillStyle = '#E4EEE3'
      ctx.strokeStyle = '#1E3A2B'
      ctx.beginPath()
      ctx.roundRect(x1, barBottom - h1, barWidth, h1, [6, 6, 0, 0])
      ctx.fill()
      ctx.stroke()

      // Collapsed flash
      if (s.phase === 'collapsing' || s.phase === 'collapsed') {
        const flashBar = s.collapsedTo === 0 ? x0 : x1
        const flashH = s.collapsedTo === 0 ? h0 : h1
        ctx.fillStyle = '#1E3A2B'
        ctx.globalAlpha = s.phase === 'collapsing' ? 0.4 : 0.25
        ctx.beginPath()
        ctx.roundRect(flashBar, barBottom - flashH, barWidth, flashH, [6, 6, 0, 0])
        ctx.fill()
        ctx.globalAlpha = 1
      }

      // Labels
      const fontSize = isLarge ? 13 : 11
      ctx.font = `500 ${fontSize}px 'JetBrains Mono', monospace`
      ctx.textAlign = 'center'
      ctx.fillStyle = '#161514'
      ctx.fillText('|0⟩', x0 + barWidth / 2, barBottom + (isLarge ? 18 : 15))
      ctx.fillText('|1⟩', x1 + barWidth / 2, barBottom + (isLarge ? 18 : 15))

      // Percentages
      ctx.font = `400 ${fontSize - 1}px 'Inter', sans-serif`
      ctx.fillStyle = '#1E3A2B'
      ctx.fillText(
        `${Math.round(s.p0 * 100)}%`,
        x0 + barWidth / 2,
        barBottom - h0 - (isLarge ? 8 : 6)
      )
      ctx.fillText(
        `${Math.round(s.p1 * 100)}%`,
        x1 + barWidth / 2,
        barBottom - h1 - (isLarge ? 8 : 6)
      )

      // Phase indicator
      if (s.phase === 'collapsing' || s.phase === 'collapsed') {
        const pulseAlpha = 0.5 + 0.5 * Math.sin(s.tick * 0.15)
        ctx.font = `500 ${isLarge ? 11 : 10}px 'Inter', sans-serif`
        ctx.fillStyle = `rgba(30, 58, 43, ${pulseAlpha})`
        ctx.fillText('MEASURED', W / 2, isLarge ? 16 : 13)
      } else {
        ctx.font = `400 ${isLarge ? 11 : 10}px 'Inter', sans-serif`
        ctx.fillStyle = 'rgba(22, 21, 20, 0.4)'
        ctx.fillText('superposition', W / 2, isLarge ? 16 : 13)
      }

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [W, H, isLarge])

  return <canvas ref={canvasRef} className="block" />
}

export default function Hero() {
  return (
    <section id="hero" className="pt-28 pb-16 md:pt-36 md:pb-24 px-6">
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Text column */}
        <div className="flex-1 max-w-[600px]">
          {/* Eyebrow */}
          <span className="inline-block text-[12px] font-medium tracking-[0.12em] uppercase text-[var(--color-accent-deep)] mb-4 opacity-0 animate-[fadeSlideUp_0.6s_0.1s_ease-out_forwards]">
            Quantum education, made hands-on
          </span>

          {/* Headline */}
          <h1 className="font-display text-[36px] sm:text-[42px] md:text-[48px] font-semibold leading-[1.08] tracking-tight text-[var(--color-text)] mb-5 opacity-0 animate-[fadeSlideUp_0.7s_0.2s_ease-out_forwards]">
            Learn quantum computing by building it
          </h1>

          {/* Subtext */}
          <p className="text-[15px] md:text-[16px] leading-[1.65] text-[var(--color-text)]/65 max-w-[500px] mb-8 opacity-0 animate-[fadeSlideUp_0.7s_0.35s_ease-out_forwards]">
            Structured theory, a visual circuit builder, real simulation on Qiskit Aer, and an AI tutor — woven into one continuous learning loop.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 opacity-0 animate-[fadeSlideUp_0.7s_0.5s_ease-out_forwards]">
            <a
              href="/learn"
              id="hero-start-learning"
              className="inline-flex items-center px-7 py-3 text-[14px] font-medium text-white bg-[var(--color-action)] rounded-full no-underline hover:bg-[var(--color-accent-deep)] hover:scale-[1.02] transition-all duration-250 active:scale-[0.98]"
            >
              Start Learning
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-2">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="/circuit-builder"
              id="hero-circuit-builder"
              className="inline-flex items-center px-7 py-3 text-[14px] font-medium text-[var(--color-text)] border border-[var(--color-border)] rounded-full no-underline hover:border-[var(--color-text)] hover:scale-[1.02] transition-all duration-250 active:scale-[0.98]"
            >
              Try Circuit Builder
            </a>
          </div>
        </div>

        {/* Visual column — live probability bars */}
        <div className="flex-shrink-0 opacity-0 animate-[fadeSlideUp_0.8s_0.4s_ease-out_forwards]">
          <div className="relative bg-[var(--color-card)] border border-[var(--color-border)] rounded-[16px] p-6 md:p-8">
            {/* Decorative label */}
            <div className="absolute -top-3 left-6 bg-[var(--color-base)] px-3 py-0.5 text-[11px] font-medium tracking-[0.08em] text-[var(--color-text)]/50 uppercase font-mono">
              live preview
            </div>
            <ProbabilityBars size="large" />
            <p className="text-center text-[12px] text-[var(--color-text)]/40 mt-3 font-mono">
              |ψ⟩ = α|0⟩ + β|1⟩
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export { ProbabilityBars }
