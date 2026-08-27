import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function FinalCTA() {
  const ref = useScrollReveal()

  return (
    <section id="final-cta" className="py-20 md:py-28 px-6" ref={ref}>
      <div className="max-w-[700px] mx-auto text-center reveal">
        {/* Decorative qubit */}
        <div className="mb-6 flex justify-center">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="opacity-30">
            <circle cx="20" cy="20" r="16" stroke="var(--color-accent-deep)" strokeWidth="1.5" />
            <ellipse cx="20" cy="20" rx="16" ry="6" stroke="var(--color-accent-deep)" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="20" cy="6" r="3" fill="var(--color-accent-deep)" />
          </svg>
        </div>

        <h2 className="font-display text-[28px] md:text-[36px] font-semibold leading-[1.12] text-[var(--color-text)] mb-6">
          Start where every quantum engineer starts — with a single qubit.
        </h2>
        <a
          href="/signup"
          id="final-cta-btn"
          className="inline-flex items-center px-8 py-3.5 text-[14px] font-medium text-white bg-[var(--color-action)] rounded-full no-underline hover:bg-[var(--color-accent-deep)] hover:scale-[1.03] transition-all duration-250 active:scale-[0.98]"
        >
          Get Started
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-2">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </section>
  )
}
