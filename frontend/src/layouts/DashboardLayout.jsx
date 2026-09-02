import React, { useState } from 'react';

// SVG Icons (Light style, 1.5px stroke)
const IconDashboard = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);

const IconLearn = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const IconCircuit = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 6h10" /><path d="M6 12h12" /><path d="M8 18h10" /><path d="M3 12h3" /><path d="M18 12h3" /><rect x="6" y="4" width="4" height="4" rx="1" /><rect x="14" y="10" width="4" height="4" rx="1" /><rect x="6" y="16" width="4" height="4" rx="1" />
  </svg>
);

const IconPlayground = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const IconCode = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const IconProgress = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const IconProfile = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconSearch = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconBell = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const IconSparkle = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.91 5.81c.21.64.71 1.14 1.35 1.35L21 12l-5.74 1.84c-.64.21-1.14.71-1.35 1.35L12 21l-1.91-5.81c-.21-.64-.71-1.14-1.35-1.35L3 12l5.74-1.84c.64-.21 1.14-.71 1.35-1.35z" />
  </svg>
);

const IconMenu = () => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: IconDashboard, href: '/dashboard' },
  { id: 'learn', label: 'Learn', icon: IconLearn, href: '/learn' },
  { id: 'circuit', label: 'Circuit Builder', icon: IconCircuit, href: '/circuit-builder' },
  { id: 'playground', label: 'Playground', icon: IconPlayground, href: '/playground' },
  { id: 'challenges', label: 'Challenges', icon: IconCode, href: '/dashboard' },
  { id: 'progress', label: 'Progress', icon: IconProgress, href: '/dashboard' },
  { id: 'profile', label: 'Profile', icon: IconProfile, href: '/dashboard' },
];

export default function DashboardLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isHoverOpen, setIsHoverOpen] = useState(false);
  
  const isOpen = isDesktopSidebarOpen || isHoverOpen;
  
  // When isOpen is true, fade in after 1s. When false, fade out immediately.
  const contentVisibilityClass = isOpen ? 'opacity-100 delay-[250ms]' : 'opacity-0 delay-0';

  return (
    <div className="flex h-screen w-full bg-[var(--color-base)] text-[var(--color-text)] overflow-hidden">
      
      {/* Desktop Sidebar */}
      <aside 
        onMouseLeave={() => setIsHoverOpen(false)}
        className={`relative h-full flex-shrink-0 hidden md:flex flex-col bg-[var(--color-base)] transition-all duration-300 ease-in-out border-r border-[var(--color-border)] z-20
          ${isOpen ? 'w-[240px]' : 'w-6'}`}
      >
        
        {/* Hover peek zone: only active below the logo line (h-16 = 64px) */}
        {!isDesktopSidebarOpen && (
          <div
            onMouseEnter={() => setIsHoverOpen(true)}
            className="absolute top-16 bottom-0 left-0 w-full z-10"
            aria-hidden="true"
          />
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
          className={`absolute top-5 -right-3.5 flex items-center justify-center w-7 h-7 rounded-full border border-[var(--color-border)] bg-[var(--color-base)] hover:bg-[var(--color-card)] hover:border-[var(--color-accent-deep)] transition-colors duration-200 z-50 text-[var(--color-text)]`}
          aria-label="Toggle desktop sidebar"
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className={`w-full h-full overflow-hidden transition-opacity duration-300 ease-in-out ${contentVisibilityClass}`}>
          <div className="w-[240px] h-full flex flex-col">
            
            {/* Logo */}
            <div className="h-16 flex items-center px-[22px] border-b border-[var(--color-border)] shrink-0">
              <a href="/dashboard" className="flex items-center gap-3 no-underline group">
                <svg width="24" height="24" viewBox="0 0 28 28" fill="none" className="shrink-0">
                  <circle cx="14" cy="14" r="11" stroke="var(--color-accent-deep)" strokeWidth="1.5" fill="none" />
                  <ellipse cx="14" cy="14" rx="11" ry="4.5" stroke="var(--color-accent-deep)" strokeWidth="1.5" fill="none" transform="rotate(-25 14 14)" />
                  <circle cx="14" cy="5" r="2.5" fill="var(--color-accent-deep)" />
                </svg>
                <span className={`font-display text-[17px] font-semibold tracking-tight text-[var(--color-text)]`}>
                  Qdemy
                </span>
              </a>
            </div>

            {/* Nav Links */}
            <nav className="sidebar-scroll flex-1 py-6 px-[14px] flex flex-col gap-1 overflow-y-auto overflow-x-hidden relative z-20">
              {navItems.map((item) => {
                const isActive = window.location.pathname === item.href ||
                                (item.href !== '/dashboard' && window.location.pathname.startsWith(item.href));
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      window.history.pushState({}, '', item.href);
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className={`group flex items-center gap-3 px-[10px] py-2.5 rounded-lg text-[14px] font-medium transition-colors cursor-pointer border-none no-underline w-full text-left overflow-hidden shrink-0 ${
                      isActive
                        ? 'text-[var(--color-accent-deep)] bg-[var(--color-accent-light)] font-semibold'
                        : 'text-[var(--color-text)]/70 hover:text-[var(--color-accent-deep)] hover:bg-[var(--color-accent-light)]/50'
                    }`}
                  >
                    <span className={`shrink-0 ${isActive ? 'text-[var(--color-accent-deep)]' : 'text-[var(--color-text)]/70 group-hover:text-[var(--color-accent-deep)]'}`}>
                      <item.icon />
                    </span>
                    <span className={`truncate`}>
                      {item.label}
                    </span>
                  </a>
                );
              })}
            </nav>

            {/* Bottom User Area */}
            <div className="p-4 border-t border-[var(--color-border)] shrink-0 relative z-20 overflow-hidden">
              <div className="flex items-center gap-3 mb-3 px-[2px]">
                <div className="w-8 h-8 rounded-full bg-[var(--color-card)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
                  <span className="font-display font-medium text-[13px]">L</span>
                </div>
                <div className={`flex-1 min-w-0`}>
                  <p className="text-[14px] font-medium truncate">Lokesh K S</p>
                </div>
              </div>
              <button className={`w-full text-left px-3 py-1.5 text-[13px] text-[var(--color-text)]/70 hover:text-[var(--color-text)] font-medium bg-transparent border-none cursor-pointer`}>
                Logout
              </button>
            </div>

          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Top Bar */}
        <header className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-[var(--color-border)] bg-[var(--color-base)]">
          
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-1 -ml-2 bg-transparent border-none cursor-pointer text-[var(--color-text)]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <IconMenu />
            </button>
            <h1 className="font-display font-semibold text-[20px] m-0 hidden sm:block">Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative hidden md:block">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text)]/50">
                <IconSearch />
              </span>
              <input 
                type="text" 
                placeholder="Search concepts..." 
                className="w-[200px] lg:w-[260px] h-[36px] bg-[var(--color-card)] border border-[var(--color-border)] rounded-full pl-9 pr-4 text-[13px] outline-none focus:border-[var(--color-accent-deep)] transition-colors text-[var(--color-text)] placeholder:text-[var(--color-text)]/50"
              />
            </div>
            <button className="md:hidden w-[36px] h-[36px] flex items-center justify-center bg-[var(--color-card)] border border-[var(--color-border)] rounded-full text-[var(--color-text)] cursor-pointer">
              <IconSearch />
            </button>

            {/* AI Tutor Toggle */}
            <button className="w-[36px] h-[36px] flex items-center justify-center bg-[var(--color-card)] border border-[var(--color-border)] rounded-full text-[var(--color-accent-deep)] hover:bg-[var(--color-accent-light)]/50 transition-colors cursor-pointer">
              <IconSparkle />
            </button>

            {/* Notifications */}
            <button className="w-[36px] h-[36px] flex items-center justify-center bg-[var(--color-card)] border border-[var(--color-border)] rounded-full text-[var(--color-text)] hover:bg-[var(--color-border)]/50 transition-colors cursor-pointer relative">
              <IconBell />
              <span className="absolute top-[8px] right-[10px] w-1.5 h-1.5 bg-[#ef4444] rounded-full border border-[var(--color-base)]"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1000px] mx-auto p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-[260px] bg-[var(--color-base)] z-50 transform transition-transform duration-300 md:hidden flex flex-col ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 border-b border-[var(--color-border)]">
          <a href="/dashboard" className="flex items-center gap-2.5 no-underline">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="11" stroke="var(--color-accent-deep)" strokeWidth="1.5" fill="none" />
              <ellipse cx="14" cy="14" rx="11" ry="4.5" stroke="var(--color-accent-deep)" strokeWidth="1.5" fill="none" transform="rotate(-25 14 14)" />
              <circle cx="14" cy="5" r="2.5" fill="var(--color-accent-deep)" />
            </svg>
            <span className="font-display text-[17px] font-semibold tracking-tight text-[var(--color-text)]">
              Qdemy
            </span>
          </a>
        </div>
        <nav className="flex-1 py-6 px-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = window.location.pathname === item.href || 
                            (item.href !== '/dashboard' && window.location.pathname.startsWith(item.href));
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState({}, '', item.href);
                  window.dispatchEvent(new PopStateEvent('popstate'));
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-[15px] font-medium border-none no-underline w-full text-left
                  ${isActive 
                    ? 'text-[var(--color-accent-deep)] bg-[var(--color-accent-light)]/50' 
                    : 'text-[var(--color-text)]/70'
                  }`}
              >
                <span className={isActive ? 'text-[var(--color-accent-deep)]' : 'text-[var(--color-text)]/70'}>
                  <item.icon />
                </span>
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>

    </div>
  );
}
