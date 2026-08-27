import { useScrollReveal } from '../../hooks/useScrollReveal'

const rows = [
  { feature: 'Hands-on circuits', textbooks: false, docs: false, platform: true },
  { feature: 'Real simulation', textbooks: false, docs: true, platform: true },
  { feature: 'Guided feedback', textbooks: false, docs: false, platform: true },
  { feature: 'Concept explanations', textbooks: true, docs: false, platform: true },
  { feature: 'Visual state rendering', textbooks: false, docs: false, platform: true },
  { feature: 'One connected loop', textbooks: false, docs: false, platform: true },
]

function Check() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="mx-auto">
      <path d="M5 10l4 4 6-8" stroke="#1E3A2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function Dash() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="mx-auto opacity-25">
      <path d="M6 10h8" stroke="#161514" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export default function Comparison() {
  const ref = useScrollReveal()

  return (
    <section id="comparison" className="py-20 md:py-28 px-6" ref={ref}>
      <div className="max-w-[900px] mx-auto">
        <div className="text-center mb-12 reveal">
          <span className="inline-block text-[12px] font-medium tracking-[0.12em] uppercase text-[var(--color-accent-deep)] mb-3">
            Why this platform
          </span>
          <h2 className="font-display text-[26px] md:text-[30px] font-semibold leading-tight text-[var(--color-text)]">
            Not just docs, not just theory
          </h2>
        </div>

        {/* Table — desktop */}
        <div className="reveal hidden md:block">
          <div className="rounded-[14px] border border-[var(--color-border)] overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left px-6 py-4 text-[13px] font-medium tracking-[0.04em] text-[var(--color-text)]/50 bg-[var(--color-card)]"></th>
                  <th className="px-6 py-4 text-[13px] font-medium tracking-[0.04em] text-[var(--color-text)]/50 bg-[var(--color-card)] text-center">Textbooks</th>
                  <th className="px-6 py-4 text-[13px] font-medium tracking-[0.04em] text-[var(--color-text)]/50 bg-[var(--color-card)] text-center">SDK Docs</th>
                  <th className="px-6 py-4 text-[13px] font-medium tracking-[0.04em] text-white bg-[var(--color-action)] text-center rounded-none">
                    Qdemy
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className={i < rows.length - 1 ? 'border-b border-[var(--color-border)]' : ''}>
                    <td className="px-6 py-3.5 text-[14px] font-medium text-[var(--color-text)]">{row.feature}</td>
                    <td className="px-6 py-3.5 text-center">{row.textbooks ? <Check /> : <Dash />}</td>
                    <td className="px-6 py-3.5 text-center">{row.docs ? <Check /> : <Dash />}</td>
                    <td className="px-6 py-3.5 text-center bg-[var(--color-accent-light)]/40">
                      {row.platform ? <Check /> : <Dash />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile stacked cards */}
        <div className="reveal md:hidden space-y-4">
          {rows.map((row, i) => (
            <div
              key={i}
              className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4"
            >
              <p className="text-[14px] font-medium text-[var(--color-text)] mb-3">{row.feature}</p>
              <div className="flex gap-4 text-[12px]">
                <div className="flex items-center gap-1.5 text-[var(--color-text)]/50">
                  {row.textbooks ? <Check /> : <Dash />}
                  <span>Textbooks</span>
                </div>
                <div className="flex items-center gap-1.5 text-[var(--color-text)]/50">
                  {row.docs ? <Check /> : <Dash />}
                  <span>SDK Docs</span>
                </div>
                <div className="flex items-center gap-1.5 text-[var(--color-accent-deep)] font-medium">
                  {row.platform ? <Check /> : <Dash />}
                  <span>This platform</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
