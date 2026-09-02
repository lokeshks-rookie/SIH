import { useState, useEffect } from 'react'
import AuthModal from './AuthModal'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [authView, setAuthView] = useState('login')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
    <nav
      id="main-nav"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--color-base)]/95 backdrop-blur-md border-b border-[var(--color-border)]'
          : 'bg-[var(--color-base)] border-b border-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Wordmark */}
        <a href="/" className="flex items-center gap-2.5 no-underline group" id="nav-logo">
          {/* Qubit icon */}
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="transition-transform duration-300 group-hover:rotate-12">
            <circle cx="14" cy="14" r="11" stroke="var(--color-accent-deep)" strokeWidth="1.5" fill="none" />
            <ellipse cx="14" cy="14" rx="11" ry="4.5" stroke="var(--color-accent-deep)" strokeWidth="1.5" fill="none" transform="rotate(-25 14 14)" />
            <circle cx="14" cy="5" r="2.5" fill="var(--color-accent-deep)" />
          </svg>
          <span className="font-display text-[18px] font-semibold tracking-tight text-[var(--color-text)]">
            Qdemy
          </span>
        </a>

        {/* Center nav links — desktop */}
        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => { setAuthView('login'); setIsAuthOpen(true); }}
            id="nav-login"
            className="px-5 py-2 text-[13px] font-medium text-[var(--color-text)] border border-[var(--color-border)] rounded-full hover:border-[var(--color-text)] transition-all duration-200 cursor-pointer bg-transparent"
          >
            Login
          </button>
          <button
            onClick={() => { setAuthView('signup'); setIsAuthOpen(true); }}
            id="nav-get-started"
            className="px-5 py-2 text-[13px] font-medium text-white bg-[var(--color-action)] rounded-full hover:bg-[var(--color-accent-deep)] transition-all duration-200 cursor-pointer border-none"
          >
            Get Started
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          id="mobile-menu-toggle"
          className="md:hidden flex flex-col gap-[5px] p-2 bg-transparent border-none cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-[1.5px] bg-[var(--color-text)] transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
          <span className={`block w-5 h-[1.5px] bg-[var(--color-text)] transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-[1.5px] bg-[var(--color-text)] transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ${
          mobileOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        } bg-[var(--color-base)] border-t border-[var(--color-border)]`}
      >
        <div className="px-6 py-4 flex flex-col gap-3">
          <div className="flex gap-3 pt-1">
            <button
              onClick={() => { setAuthView('login'); setIsAuthOpen(true); setMobileOpen(false); }}
              className="px-5 py-2 text-[13px] font-medium text-[var(--color-text)] border border-[var(--color-border)] rounded-full flex-1 text-center bg-transparent cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => { setAuthView('signup'); setIsAuthOpen(true); setMobileOpen(false); }}
              className="px-5 py-2 text-[13px] font-medium text-white bg-[var(--color-action)] rounded-full flex-1 text-center border-none cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        initialView={authView} 
      />
    </>
  )
}
