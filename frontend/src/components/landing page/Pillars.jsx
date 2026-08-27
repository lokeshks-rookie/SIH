import { useScrollReveal } from '../../hooks/useScrollReveal'

const pillars = [
  {
    id: 'pillar-learn',
    title: 'Learn',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 16h8M16 12v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    body: '17 concepts taught through interaction, not static diagrams. Watch superposition collapse. Watch Grover\'s algorithm amplify the right answer, iteration by iteration.',
  },
  {
    id: 'pillar-build',
    title: 'Build',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="5" y="8" width="22" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M11 14l3 3-3 3M17 20h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    body: 'Drag-and-drop circuit builder with a live code view. Every circuit you build runs on a real backend — Qiskit Aer, with PennyLane and Cirq support.',
  },
  {
    id: 'pillar-understand',
    title: 'Understand',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="13" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M16 20v4M13 27h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M13.5 13a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    body: 'An AI tutor grounded in exactly what you\'re learning — explains concepts, debugs your circuits, and suggests what to study next.',
  },
]

export default function Pillars() {
  const ref = useScrollReveal()

  return (
    <section id="pillars" className="py-20 md:py-28 px-6" ref={ref}>
      <div className="max-w-[1200px] mx-auto">
        {/* Section header */}
        <div className="text-center mb-14 reveal">
          <h2 className="font-display text-[28px] md:text-[32px] font-semibold leading-tight text-[var(--color-text)]">
            One loop: learn, build, understand
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal-stagger">
          {pillars.map((p) => (
            <div
              key={p.id}
              id={p.id}
              className="reveal bg-[var(--color-card)] border border-[var(--color-border)] rounded-[14px] p-7 md:p-8 group hover:border-[var(--color-accent-deep)]/30 transition-all duration-300"
            >
              {/* Icon */}
              <div className="text-[var(--color-text)] mb-5 group-hover:text-[var(--color-accent-deep)] transition-colors duration-300">
                {p.icon}
              </div>

              {/* Title */}
              <h3 className="text-[18px] font-medium text-[var(--color-text)] mb-3 font-body">
                {p.title}
              </h3>

              {/* Body */}
              <p className="text-[14px] leading-[1.7] text-[var(--color-text)]/60">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
