import { useState, useRef, useEffect, useCallback } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function ConceptTeaser() {
  const sectionRef = useScrollReveal()
  const [p0, setP0] = useState(0.55)
  const [p1, setP1] = useState(0.45)
  const [measured, setMeasured] = useState(false)
  const [result, setResult] = useState(null)
  const fluctRef = useRef(null)

  // Gentle fluctuation
  useEffect(() => {
    if (measured) return

    const interval = setInterval(() => {
      setP0((prev) => {
        const delta = (Math.random() - 0.5) * 0.06
        const next = Math.max(0.15, Math.min(0.85, prev + delta))
        setP1(1 - next)
        return next
      })
    }, 200)

    fluctRef.current = interval
    return () => clearInterval(interval)
  }, [measured])

  const handleMeasure = useCallback(() => {
    if (measured) {
      // Reset
      setMeasured(false)
      setResult(null)
      setP0(0.45 + Math.random() * 0.1)
      setP1(1 - (0.45 + Math.random() * 0.1))
      return
    }

    const outcome = Math.random() < p0 ? 0 : 1
    setResult(outcome)
    setMeasured(true)

    if (outcome === 0) {
      setP0(0.98)
      setP1(0.02)
    } else {
      setP0(0.02)
      setP1(0.98)
    }
  }, [measured, p0])

  const barMaxH = 120

  return (
    <section id="concept-teaser" className="py-20 md:py-28 px-6" ref={sectionRef}>
      <div className="max-w-[1200px] mx-auto">
        <div className="reveal bg-[var(--color-accent-deep)] rounded-[16px] p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left text */}
          <div className="flex-1 max-w-[460px]">
            <span className="inline-block text-[11px] font-medium tracking-[0.14em] uppercase text-[var(--color-accent-light)] mb-3">
              Featured concept
            </span>
            <h2 className="font-display text-[26px] md:text-[30px] font-semibold leading-tight text-white mb-4">
              Superposition &amp; Measurement
            </h2>
            <p className="text-[14px] md:text-[15px] leading-[1.7] text-white/65 mb-6">
              A qubit exists as a weighted mix of |0⟩ and |1⟩ until measured. Press Measure to collapse the superposition — watch the probabilities snap to a definite outcome.
            </p>
            <p className="text-[13px] font-mono text-[var(--color-accent-light)]/70 mb-6">
              |ψ⟩ = α|0⟩ + β|1⟩ &nbsp; P(0) = |α|² &nbsp; P(1) = |β|²
            </p>
            <a
              href="/learn"
              className="inline-flex items-center text-[13px] font-medium text-[var(--color-accent-light)] no-underline hover:text-white transition-colors duration-200 group"
            >
              This is one of 17 concepts. Explore the full library
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-1.5 group-hover:translate-x-1 transition-transform duration-200">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>

          {/* Right interactive mini-preview */}
          <div className="flex-shrink-0">
            <div className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-[14px] p-6 md:p-8 min-w-[240px]">
              {/* Bars */}
              <div className="flex items-end justify-center gap-8 h-[140px] mb-4">
                {/* |0⟩ */}
                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-mono text-white/60 mb-1">
                    {Math.round(p0 * 100)}%
                  </span>
                  <div
                    className="w-12 rounded-t-md transition-all duration-300"
                    style={{
                      height: `${p0 * barMaxH}px`,
                      backgroundColor: measured && result === 0 ? '#1E3A2B' : '#E4EEE3',
                      border: '1.5px solid',
                      borderColor: measured && result === 0 ? '#E4EEE3' : 'rgba(228, 238, 227, 0.4)',
                    }}
                  />
                  <span className="text-[12px] font-mono text-white/80 mt-2">|0⟩</span>
                </div>

                {/* |1⟩ */}
                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-mono text-white/60 mb-1">
                    {Math.round(p1 * 100)}%
                  </span>
                  <div
                    className="w-12 rounded-t-md transition-all duration-300"
                    style={{
                      height: `${p1 * barMaxH}px`,
                      backgroundColor: measured && result === 1 ? '#1E3A2B' : '#E4EEE3',
                      border: '1.5px solid',
                      borderColor: measured && result === 1 ? '#E4EEE3' : 'rgba(228, 238, 227, 0.4)',
                    }}
                  />
                  <span className="text-[12px] font-mono text-white/80 mt-2">|1⟩</span>
                </div>
              </div>

              {/* Measure button */}
              <button
                id="concept-measure-btn"
                onClick={handleMeasure}
                className="w-full py-2.5 text-[13px] font-medium rounded-full cursor-pointer transition-all duration-200 active:scale-[0.97]"
                style={{
                  background: measured ? 'transparent' : '#E4EEE3',
                  color: measured ? '#E4EEE3' : '#1E3A2B',
                  border: measured ? '1.5px solid rgba(228,238,227,0.4)' : '1.5px solid transparent',
                }}
              >
                {measured ? 'Reset' : 'Measure'}
              </button>

              {/* Result label */}
              {measured && (
                <p className="text-center text-[11px] font-mono text-[var(--color-accent-light)] mt-3 animate-[fadeSlideUp_0.3s_ease-out_forwards]">
                  Collapsed to |{result}⟩
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
