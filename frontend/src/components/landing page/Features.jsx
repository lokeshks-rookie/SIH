import { useScrollReveal } from '../../hooks/useScrollReveal'

const features = [
  {
    id: 'feature-circuit-builder',
    title: 'Visual circuit builder',
    desc: 'Drag gates onto qubits, wire them together — no code required to start. A live code view keeps you connected to what\'s happening under the hood.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M4 10h24M4 16h24M4 22h24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="9" y="7" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="17" y="13" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="9" y="19" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 'feature-simulation',
    title: 'Real quantum simulation',
    desc: 'Genuine state vectors and measurement probabilities from Qiskit Aer — not mocked output. See how every gate transforms the quantum state.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M6 26V10l5 8 5-14 5 10 5-4v16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'feature-bloch',
    title: 'Bloch sphere visualization',
    desc: 'A live 3D Bloch sphere renders single-qubit states as you build — rotate, zoom, and develop geometric intuition for state space.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.5" />
        <ellipse cx="16" cy="16" rx="10" ry="4" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
        <path d="M16 6v20" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="16" y1="16" x2="22" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="22" cy="9" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'feature-ai-tutor',
    title: 'AI tutor on every page',
    desc: 'Not a bolted-on chatbot. The AI is grounded in exactly the concept you\'re studying — it explains, debugs circuits, and guides what to learn next.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="5" y="6" width="22" height="16" rx="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 26l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="14" r="1.5" fill="currentColor" />
        <circle cx="20" cy="14" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'feature-playground',
    title: 'Algorithm Playground',
    desc: 'Pre-built circuit templates for Grover\'s, Deutsch-Jozsa, teleportation, BB84, and more — load, run, and modify to learn by experimentation.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M8 6l16 10-16 10V6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'feature-challenges',
    title: 'Coding challenges',
    desc: 'Build a Bell state. Implement Grover\'s oracle. Each challenge has an embedded editor and instant pass/fail feedback — learn by doing.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M10 8l-6 8 6 8M22 8l6 8-6 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 6l-4 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
]

export default function Features() {
  const ref = useScrollReveal()

  return (
    <section id="features" className="py-20 md:py-28 px-6 bg-[var(--color-base)]" ref={ref}>
      <div className="max-w-[1200px] mx-auto">
        {/* Section header */}
        <div className="text-center mb-14 reveal">
          <span className="inline-block text-[12px] font-medium tracking-[0.12em] uppercase text-[var(--color-accent-deep)] mb-3">
            Platform features
          </span>
          <h2 className="font-display text-[28px] md:text-[32px] font-semibold leading-tight text-[var(--color-text)]">
            Everything you need to learn quantum
          </h2>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 reveal-stagger">
          {features.map((f) => (
            <div
              key={f.id}
              id={f.id}
              className="reveal bg-[var(--color-card)] border border-[var(--color-border)] rounded-[14px] p-6 group hover:border-[var(--color-accent-deep)]/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-[var(--color-text)]/70 mb-4 group-hover:text-[var(--color-accent-deep)] transition-colors duration-300">
                {f.icon}
              </div>
              <h3 className="text-[16px] md:text-[18px] font-medium text-[var(--color-text)] mb-2">
                {f.title}
              </h3>
              <p className="text-[13px] md:text-[14px] leading-[1.7] text-[var(--color-text)]/55">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
