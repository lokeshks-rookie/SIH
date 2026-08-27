import { useScrollReveal } from '../../hooks/useScrollReveal'

const stats = [
  '17 core concepts',
  '4 simulator backends',
  '10 quantum algorithms',
  'AI-guided, every step',
]

export default function StatsStrip() {
  const ref = useScrollReveal()

  return (
    <section id="stats-strip" ref={ref} className="py-6 border-y border-[var(--color-border)]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="reveal flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {stats.map((stat, i) => (
            <span
              key={i}
              className="text-[12px] md:text-[13px] font-medium tracking-[0.14em] uppercase text-[var(--color-text)]/50"
            >
              {stat}
              {i < stats.length - 1 && (
                <span className="hidden sm:inline ml-10 text-[var(--color-border)]">·</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
