'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { List, House, ShieldWarning, Users, BookmarkSimple, X, Compass, CaretDown, Buildings, CurrencyBtc, Heart, Question, Info } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/useUIStore';
import { SCAM_CATEGORIES } from '@/types';
import { getCategoryIcon } from '@/lib/categoryMeta';

interface CollapsibleSectionProps {
  label: string;
  isCollapsed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function CollapsibleSection({ label, isCollapsed, onToggle, children }: CollapsibleSectionProps) {
  return (
    <div className="py-3">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 hover:text-foreground transition-colors duration-200"
        aria-expanded={!isCollapsed}
      >
        <span>{label}</span>
        <CaretDown
          size={14}
          className={cn(
            'transition-transform duration-200',
            isCollapsed && '-rotate-180'
          )}
        />
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100'
        )}
      >
        <div className="mt-1">{children}</div>
      </div>
    </div>
  );
}

interface SidebarLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

function SidebarLink({ href, icon: Icon, label, isActive, onClick, className }: SidebarLinkProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'flex items-center gap-3 rounded-lg text-[13.5px] font-medium transition-all duration-200',
        isActive
          ? 'bg-accent text-foreground'
          : 'text-foreground hover:bg-accent/40',
        className
      )}
    >
      <span className="flex-shrink-0">
        <Icon size={20} weight={isActive ? "fill" : "bold"} />
      </span>
      <span className="truncate">{label}</span>
    </Link>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { collapsedSections, toggleSection } = useUIStore();
  const pathname = usePathname();

  return (
    <div className="py-3 pl-4 pr-4">
      {/* Primary Navigation — ungrouped top section */}
      <nav className="space-y-1">
        <SidebarLink
          href="/feed"
          icon={House}
          label="Home"
          isActive={pathname === '/feed' || pathname === '/'}
          onClick={onNavigate}
          className="pl-5 pr-3 py-2.5"
        />
        <SidebarLink
          href="/feed/near-me"
          icon={Compass}
          label="Near Me"
          isActive={pathname === '/feed/near-me'}
          onClick={onNavigate}
          className="pl-5 pr-3 py-2.5"
        />
        <SidebarLink
          href="/feed/categories"
          icon={List}
          label="Category Feed"
          isActive={pathname === '/feed/categories'}
          onClick={onNavigate}
          className="pl-5 pr-3 py-2.5"
        />
        <SidebarLink
          href="/submit"
          icon={ShieldWarning}
          label="Report a Scam"
          onClick={onNavigate}
          className="pl-5 pr-3 py-2.5"
        />
      </nav>

      <div className="my-3 border-t border-border" />

      {/* Categories — collapsible, mirrors Reddit's CUSTOM FEEDS/COMMUNITIES pattern */}
      <CollapsibleSection
        label="Categories"
        isCollapsed={collapsedSections.categories}
        onToggle={() => toggleSection('categories')}
      >
        <div className="space-y-0.5 pb-1.5">
          {SCAM_CATEGORIES.map((cat) => (
            <SidebarLink
              key={cat.slug}
              href={`/feed/category/${cat.slug}`}
              icon={getCategoryIcon(cat.slug)}
              label={cat.label}
              isActive={pathname === `/feed/category/${cat.slug}`}
              onClick={onNavigate}
              className="px-5 py-2.5"
            />
          ))}
        </div>
      </CollapsibleSection>

      <div className="my-1 border-t border-border" />

      {/* Resources */}
      <CollapsibleSection
        label="Resources"
        isCollapsed={collapsedSections.resources}
        onToggle={() => toggleSection('resources')}
      >
        <div className="space-y-0.5">
          <SidebarLink
            href="/about"
            icon={Info}
            label="About Skadoosh"
            onClick={onNavigate}
            className="px-5 py-2.5"
          />
          <SidebarLink
            href="/help"
            icon={Question}
            label="Help"
            onClick={onNavigate}
            className="px-5 py-2.5"
          />
        </div>
      </CollapsibleSection>
    </div>
  );
}

/**
 * Desktop left sidebar — togglable on lg+
 * Hover-to-peek: when toggle-closed, hovering expands it temporarily.
 * When toggle-open, stays open regardless of hover.
 */
export function LeftSidebar() {
  const { isDesktopSidebarOpen, toggleDesktopSidebar } = useUIStore();
  const [isHoverOpen, setIsHoverOpen] = useState(false);

  // True if sidebar should visually appear open (either toggled open OR hover-peeked)
  const isOpen = isDesktopSidebarOpen || isHoverOpen;

  // Only reset hover-open when mouse leaves the whole aside
  const handleMouseLeave = () => {
    setIsHoverOpen(false);
  };

  const toggleButton = (
    <button
      onClick={toggleDesktopSidebar}
      className={cn(
        "absolute top-4 left-full flex items-center justify-center w-8 h-8 rounded-full border border-border bg-background shadow-sm hover:bg-accent transition-transform duration-300 z-50 hidden lg:flex",
        "-translate-x-1/2"
      )}
      aria-label="Toggle desktop sidebar"
    >
      <Image
        src={isDesktopSidebarOpen ? "/sidebar.png" : "/sidebar2.png"}
        alt="Toggle sidebar"
        width={18}
        height={18}
        className="sidebar-toggle-icon"
      />
    </button>
  );

  return (
    <aside
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative h-[calc(100vh-51px)] bg-background flex-shrink-0 hidden lg:block sticky top-[51px] transition-all duration-500 border-r border-border",
        isOpen ? "w-[280px]" : "w-8"
      )}
    >
      {toggleButton}

      {/* Hover peek zone: full width of collapsed sidebar, starting 5px below the toggle button.
          Toggle button occupies top-4 (16px) + h-8 (32px) = 48px, so zone starts at 53px.
          Only active when sidebar is toggle-closed. */}
      {!isDesktopSidebarOpen && (
        <div
          onMouseEnter={() => setIsHoverOpen(true)}
          className="absolute top-[51px] bottom-0 left-0 w-full z-10"
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          "w-full h-full overflow-hidden transition-opacity duration-200",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="w-full h-full sidebar-scroll overflow-x-hidden">
          <div className="w-[260px]">
            <SidebarContent />
          </div>
        </div>
      </div>
    </aside>
  );
}

/**
 * Mobile slide-out drawer — toggled by hamburger in TopNavbar
 */
export function MobileSidebarDrawer() {
  const { isSidebarOpen, setSidebarOpen } = useUIStore();

  if (!isSidebarOpen) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setSidebarOpen(false)}
      />
      {/* Drawer */}
      <aside className="absolute left-0 top-0 bottom-0 w-[350px] bg-background border-r border-border overflow-y-auto shadow-lg animate-in slide-in-from-left duration-200">
        <div className="flex items-center justify-between h-[51px] px-4 border-b border-border">
          <Image src="/skadoosh-logo.png" alt="Skadoosh" width={120} height={40} className="h-7 w-auto object-contain" />
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-accent transition-colors duration-200"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
        <SidebarContent onNavigate={() => setSidebarOpen(false)} />
      </aside>
    </div>
  );
}
