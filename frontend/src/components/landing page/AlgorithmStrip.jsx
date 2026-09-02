import { useScrollReveal } from '../../hooks/useScrollReveal'

const algorithms = [
  "Grover's Search",
  'Deutsch-Jozsa',
  'QFT',
  "Shor's Algorithm",
  'Teleportation',
  'Superdense Coding',
  'Quantum Walks',
  'BB84 QKD',
  'Error Correction',
  'VQE / QAOA',
]

export default function AlgorithmStrip() {
  const ref = useScrollReveal()

  return (
    <section id="algorithm-strip" className="py-14 md:py-20 px-6" ref={ref}>
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-8 reveal">
          <span className="inline-block text-[12px] font-medium tracking-[0.12em] uppercase text-[var(--color-text)]/45 mb-2">
            10 algorithms covered
          </span>
          <h2 className="font-display text-[24px] md:text-[28px] font-semibold leading-tight text-[var(--color-text)]">
            From Deutsch-Jozsa to VQE
          </h2>
        </div>

        <div className="reveal overflow-x-auto algorithm-scroll pb-2">
          <div className="flex gap-3 justify-center flex-wrap md:flex-nowrap min-w-max md:min-w-0 px-2">
            {algorithms.map((algo, i) => (
              <span
                key={i}
                className="inline-block px-5 py-2 text-[13px] font-medium text-[var(--color-text)]/70 bg-[var(--color-card)] border border-[var(--color-border)] rounded-full whitespace-nowrap hover:border-[var(--color-accent-deep)]/40 hover:text-[var(--color-accent-deep)] transition-all duration-200 cursor-default select-none"
              >
                {algo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
