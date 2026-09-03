import React from 'react';
import { useProgressStore } from '../stores/useProgressStore';

// Icons for Dashboard
const IconCircuit = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 6h10" /><path d="M6 12h12" /><path d="M8 18h10" /><path d="M3 12h3" /><path d="M18 12h3" /><rect x="6" y="4" width="4" height="4" rx="1" /><rect x="14" y="10" width="4" height="4" rx="1" /><rect x="6" y="16" width="4" height="4" rx="1" />
  </svg>
);

const IconPlay = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const IconHelp = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
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

const IconActivity = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

export default function Dashboard() {
  const { studentName, currentStreak, getStats } = useProgressStore();
  const stats = getStats();

  const recentActivityList = [
    { text: "Completed quiz: Grover's Algorithm — 90%", time: "2 hours ago" },
    { text: "Built circuit: Bell State (Φ+)", time: "5 hours ago" },
    { text: "Reviewed: Quantum Tunneling Barrier", time: "Yesterday" },
    { text: "Started lesson: Superposition & Measurement", time: "2 days ago" },
  ];

  const quickActions = [
    { icon: IconCircuit, title: "Circuit Builder", desc: "Build & simulate quantum gates", href: "/circuit-builder" },
    { icon: IconPlay, title: "Algorithm Playground", desc: "Test pre-built algorithms", href: "/playground" },
    { icon: IconCode, title: "Challenges & Tests", desc: "Solve daily puzzles & quizzes", href: "/challenges" },
    { icon: IconProgress, title: "Progress & Heatmap", desc: "View activity & concept mastery", href: "/progress" },
  ];

  return (
    <div className="flex flex-col gap-10 pb-16">
      
      {/* 1. WELCOME HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-[32px] md:text-[40px] font-bold tracking-tight text-[var(--color-text)] mb-2">
            Welcome back, {studentName}
          </h1>
          <p className="text-[15px] text-[var(--color-text)]/70 font-medium m-0">
            🔥 {currentStreak}-day active streak • You were exploring <span className="text-[var(--color-text)] font-semibold">Superposition & Measurement</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/challenges"
            className="px-4 py-2 bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-accent-deep)] text-[var(--color-text)] rounded-full text-[13px] font-medium transition-colors no-underline"
          >
            ⚡ Daily Challenge
          </a>
          <a
            href="/progress"
            className="px-4 py-2 bg-[var(--color-action)] text-white hover:bg-[var(--color-accent-deep)] rounded-full text-[13px] font-semibold transition-colors no-underline"
          >
            View Progress →
          </a>
        </div>
      </div>

      {/* 2. UP NEXT CONTINUE LEARNING CARD */}
      <div className="w-full bg-[var(--color-accent-deep)] rounded-[16px] p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center justify-between text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-[60px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="flex-1 z-10">
          <p className="text-[13px] font-medium text-white/70 uppercase tracking-wider mb-2">Up Next</p>
          <h2 className="font-display text-[24px] md:text-[28px] font-semibold mb-3">Superposition & Measurement</h2>
          <p className="text-[15px] text-white/80 mb-6 max-w-md">
            Dive into the math behind multiple states and learn how observation collapses the wave function.
          </p>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden max-w-[200px]">
              <div className="h-full bg-[var(--color-accent-light)] w-[40%] rounded-full"></div>
            </div>
            <span className="text-[13px] font-medium">40%</span>
          </div>

          <a
            href="/lesson/2"
            className="inline-block px-6 py-2.5 bg-white text-[var(--color-accent-deep)] rounded-full text-[14px] font-semibold no-underline hover:bg-[var(--color-accent-light)] transition-colors"
          >
            Continue Lesson
          </a>
        </div>

        <a href="/lesson/2" className="w-full md:w-[280px] h-[160px] bg-black/20 border border-white/10 rounded-[12px] shrink-0 flex items-center justify-center relative overflow-hidden z-10 no-underline">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjIpIi8+PC9zdmc+')] opacity-50"></div>
          <div className="w-[80px] h-[80px] rounded-full border border-[var(--color-accent-light)]/50 flex items-center justify-center relative">
             <div className="absolute w-[80px] h-[20px] border border-[var(--color-accent-light)]/30 rounded-[50%]"></div>
             <div className="absolute w-1 h-1 bg-white rounded-full top-[10px] right-[15px]"></div>
             <div className="w-[1px] h-[80px] bg-[var(--color-accent-light)]/30"></div>
          </div>
        </a>
      </div>

      {/* 3. CORE OVERVIEW STATS STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Concepts completed", value: `${stats.completedModules} / ${stats.totalModules}` },
          { label: "Circuits built", value: String(stats.circuitsBuilt) },
          { label: "Challenges passed", value: `${stats.challengesPassed} / 50` },
          { label: "Quiz average", value: `${stats.quizAverage}%` }
        ].map((stat, i) => (
          <div key={i} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
            <span className="text-[13px] text-[var(--color-text)]/60 font-medium mb-1">{stat.label}</span>
            <span className="font-display text-[22px] font-semibold text-[var(--color-text)]">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* 4. QUICK ACTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, i) => (
          <a
            key={i}
            href={action.href}
            className="flex flex-col text-left items-start p-5 bg-[var(--color-base)] border border-[var(--color-border)] rounded-[16px] hover:border-[var(--color-accent-deep)] hover:bg-[var(--color-card)]/30 transition-all cursor-pointer group no-underline"
          >
            <div className="w-10 h-10 rounded-full bg-[var(--color-card)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text)] mb-4 group-hover:bg-[var(--color-accent-light)] group-hover:text-[var(--color-accent-deep)] group-hover:border-[var(--color-accent-deep)]/20 transition-colors">
              <action.icon />
            </div>
            <h3 className="text-[15px] font-medium text-[var(--color-text)] mb-1">{action.title}</h3>
            <p className="text-[13px] text-[var(--color-text)]/60 leading-tight">{action.desc}</p>
          </a>
        ))}
      </div>

      {/* 5. AI TUTOR SUGGESTIONS & RECENT ACTIVITY STRIP */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4 border-t border-[var(--color-border)]/60">
        
        {/* AI Tutor Suggests */}
        <div className="lg:col-span-1">
          <h2 className="font-display text-[20px] font-semibold text-[var(--color-text)] mb-5">AI Tutor Suggests</h2>
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[16px] p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[var(--color-accent-deep)]"><IconHelp /></span>
              <span className="text-[13px] font-medium uppercase tracking-wide text-[var(--color-accent-deep)]">Recommended</span>
            </div>
            <h3 className="text-[16px] font-semibold text-[var(--color-text)] mb-2">Challenge: Bell State Builder</h3>
            <p className="text-[14px] text-[var(--color-text)]/70 mb-5 leading-relaxed">
              You've completed Superposition. Try building a Bell State to see how entanglement builds directly on those principles.
            </p>
            <a
              href="/challenges"
              className="block w-full py-2.5 bg-[var(--color-action)] text-white rounded-full text-[14px] font-semibold no-underline text-center hover:bg-[var(--color-accent-deep)] transition-colors"
            >
              Solve in Challenges Hub
            </a>
          </div>
        </div>

        {/* Recent Activity Stream */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-[20px] font-semibold text-[var(--color-text)] m-0">Recent Activity Feed</h2>
            <a href="/progress" className="text-[13px] font-medium text-[var(--color-accent-deep)] hover:underline no-underline">View full analytics →</a>
          </div>
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[16px] p-5 flex flex-col gap-4">
            {recentActivityList.map((act, i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b border-[var(--color-border)]/60 last:border-b-0 last:pb-0">
                <div className="mt-0.5 text-[var(--color-text)]/50 shrink-0">
                  <IconActivity />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-[var(--color-text)] m-0">{act.text}</p>
                  <p className="text-[12px] text-[var(--color-text)]/50 m-0 mt-0.5">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
