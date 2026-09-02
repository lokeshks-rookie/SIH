export default function Footer() {
  const linkGroups = [
    {
      title: 'Product',
      links: [
        { label: 'Learn', href: '/learn' },
        { label: 'Circuit Builder', href: '/circuit-builder' },
        { label: 'Playground', href: '/playground' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '/docs' },
        { label: 'Challenges', href: '/challenges' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
      ],
    },
  ]

  return (
    <footer id="footer" className="bg-[var(--color-structural-dark)] text-white/70 pt-16 pb-8 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 mb-14">
          {/* Brand column */}
          <div className="flex-1 max-w-[320px]">
            <div className="flex items-center gap-2.5 mb-4">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="11" stroke="#E4EEE3" strokeWidth="1.5" fill="none" />
                <ellipse cx="14" cy="14" rx="11" ry="4.5" stroke="#E4EEE3" strokeWidth="1.5" fill="none" transform="rotate(-25 14 14)" />
                <circle cx="14" cy="5" r="2.5" fill="#E4EEE3" />
              </svg>
              <span className="font-display text-[16px] font-semibold text-white">
                Qdemy
              </span>
            </div>
            <p className="text-[13px] leading-[1.7] text-white/40 max-w-[280px]">
              AI-based interactive quantum algorithm learning platform. Theory, circuits, simulation, and tutoring in one loop.
            </p>
          </div>

          {/* Link columns */}
          <div className="flex flex-wrap gap-12 md:gap-16">
            {linkGroups.map((group) => (
              <div key={group.title}>
                <h4 className="text-[12px] font-medium tracking-[0.12em] uppercase text-white/35 mb-4">
                  {group.title}
                </h4>
                <ul className="list-none space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-[14px] text-white/55 no-underline hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider + copyright */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-white/30">
            © {new Date().getFullYear()} Qdemy. All rights reserved.
          </p>
          <p className="text-[12px] text-white/25">
            Smart India Hackathon — Problem Statement 26140
          </p>
        </div>
      </div>
    </footer>
  )
}
