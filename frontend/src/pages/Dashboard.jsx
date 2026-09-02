import React from 'react';

// Icons for Dashboard
const IconCheck = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

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

const IconActivity = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

export default function Dashboard() {
  const studentName = "Lokesh";

  const foundationalModules = [
    { id: 1, title: "Double-slit Experiment", status: "completed" },
    { id: 2, title: "Superposition & Measurement", status: "in-progress" },
    { id: 3, title: "Stern–Gerlach Experiment", status: "not-started" },
    { id: 4, title: "Quantum Entanglement", status: "not-started" },
    { id: 5, title: "Quantum Tunneling", status: "not-started" },
    { id: 6, title: "Quantum Zeno Effect", status: "not-started" },
    { id: 7, title: "Delayed-choice Quantum Eraser", status: "not-started" },
  ];

  const algoModules = [
    { id: 8, title: "Deutsch–Jozsa Algorithm", status: "not-started" },
    { id: 9, title: "Grover's Search Algorithm", status: "not-started" },
    { id: 10, title: "Quantum Fourier Transform", status: "not-started" },
    { id: 11, title: "Shor's Algorithm", status: "not-started" },
    { id: 12, title: "Quantum Teleportation", status: "not-started" },
    { id: 13, title: "Superdense Coding", status: "not-started" },
    { id: 14, title: "Quantum Walks", status: "not-started" },
    { id: 15, title: "BB84 Key Distribution", status: "not-started" },
    { id: 16, title: "Quantum Error Correction", status: "not-started" },
    { id: 17, title: "VQE & QAOA", status: "not-started" },
  ];

  const recentActivity = [
    { text: "Completed quiz: Grover's Algorithm — 90%", time: "2 hours ago" },
    { text: "Built circuit: Bell State", time: "5 hours ago" },
    { text: "Reviewed: Quantum Tunneling", time: "Yesterday" },
    { text: "Started lesson: Superposition & Measurement", time: "2 days ago" },
  ];

  const quickActions = [
    { icon: IconCircuit, title: "Open Circuit Builder", desc: "Jump straight into building", href: "/circuit-builder" },
    { icon: IconPlay, title: "Algorithm Playground", desc: "Load pre-built templates", href: "/playground" },
    { icon: IconHelp, title: "Take a Quiz", desc: "Test your knowledge", href: "/dashboard" },
    { icon: IconCode, title: "View Challenges", desc: "Solve coding problems", href: "/dashboard" },
  ];

  return (
    <div className="flex flex-col gap-10 pb-10">
      
      {/* 1. WELCOME HEADER */}
      <div>
        <h1 className="font-display text-[32px] md:text-[40px] font-bold tracking-tight text-[var(--color-text)] mb-2">
          Welcome back, {studentName}
        </h1>
        <p className="text-[15px] text-[var(--color-text)]/70 font-medium">
          🔥 5-day streak • You were exploring <span className="text-[var(--color-text)]">Superposition & Measurement</span>
        </p>
      </div>

      {/* 2. CONTINUE LEARNING CARD */}
      <div className="w-full bg-[var(--color-accent-deep)] rounded-[16px] p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center justify-between text-white overflow-hidden relative">
        {/* Subtle decorative background shapes */}
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

        {/* Mini static preview mock */}
        <a href="/lesson/2" className="w-full md:w-[280px] h-[160px] bg-black/20 border border-white/10 rounded-[12px] shrink-0 flex items-center justify-center relative overflow-hidden z-10 no-underline">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjIpIi8+PC9zdmc+')] opacity-50"></div>
          {/* Mock bloch sphere or wave */}
          <div className="w-[80px] h-[80px] rounded-full border border-[var(--color-accent-light)]/50 flex items-center justify-center relative">
             <div className="absolute w-[80px] h-[20px] border border-[var(--color-accent-light)]/30 rounded-[50%]"></div>
             <div className="absolute w-1 h-1 bg-white rounded-full top-[10px] right-[15px]"></div>
             <div className="w-[1px] h-[80px] bg-[var(--color-accent-light)]/30"></div>
          </div>
        </a>
      </div>

      {/* 3. STATS STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Concepts completed", value: "1 / 17" },
          { label: "Circuits built", value: "24" },
          { label: "Challenges passed", value: "12 / 50" },
          { label: "Quiz average", value: "92%" }
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 5. MODULE PROGRESS OVERVIEW */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-[20px] font-semibold text-[var(--color-text)]">Your progress</h2>
            <span className="text-[13px] font-medium px-3 py-1 bg-[var(--color-card)] rounded-full border border-[var(--color-border)]">
              Overall: 6%
            </span>
          </div>

          <div className="flex flex-col gap-6">
            {/* Foundational Phenomena */}
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--color-text)] uppercase tracking-wider mb-3">Foundational Phenomena</h3>
              <div className="flex flex-col border border-[var(--color-border)] rounded-[12px] bg-[var(--color-base)] overflow-hidden">
                {foundationalModules.map((mod) => (
                  <a
                    key={mod.id}
                    href={`/lesson/${mod.id}`}
                    className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-card)]/50 transition-colors group no-underline"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${
                        mod.status === 'completed' ? 'bg-[var(--color-accent-deep)] border-[var(--color-accent-deep)] text-white' : 
                        mod.status === 'in-progress' ? 'bg-[var(--color-accent-light)] border-[var(--color-accent-deep)]/50' : 
                        'bg-transparent border-[var(--color-border)]'
                      }`}>
                        {mod.status === 'completed' && <IconCheck />}
                        {mod.status === 'in-progress' && <div className="w-1.5 h-1.5 bg-[var(--color-accent-deep)] rounded-full"></div>}
                      </div>
                      <span className={`text-[14px] font-medium ${mod.status === 'not-started' ? 'text-[var(--color-text)]/60' : 'text-[var(--color-text)]'}`}>
                        {mod.title}
                      </span>
                    </div>
                    <span className="text-[13px] font-medium text-[var(--color-text)]/50 group-hover:text-[var(--color-accent-deep)] transition-colors opacity-0 group-hover:opacity-100">
                      {mod.status === 'completed' ? 'Review →' : mod.status === 'in-progress' ? 'Continue →' : 'Start →'}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Quantum Algorithms */}
            <div>
              <h3 className="text-[14px] font-semibold text-[var(--color-text)] uppercase tracking-wider mb-3">Quantum Algorithms</h3>
              <div className="flex flex-col border border-[var(--color-border)] rounded-[12px] bg-[var(--color-base)] overflow-hidden">
                {algoModules.map((mod) => (
                  <a
                    key={mod.id}
                    href={`/lesson/${mod.id}`}
                    className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-card)]/50 transition-colors group no-underline"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center border shrink-0 bg-transparent border-[var(--color-border)]">
                        {/* Not started */}
                      </div>
                      <span className="text-[14px] font-medium text-[var(--color-text)]/60">
                        {mod.title}
                      </span>
                    </div>
                    <span className="text-[13px] font-medium text-[var(--color-text)]/50 group-hover:text-[var(--color-accent-deep)] transition-colors opacity-0 group-hover:opacity-100">
                      Start →
                    </span>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className="flex flex-col gap-8">
          {/* 6. RECOMMENDED NEXT */}
          <div>
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
                href="/circuit-builder"
                className="block w-full py-2.5 bg-[var(--color-action)] text-white rounded-full text-[14px] font-semibold no-underline text-center hover:bg-[var(--color-accent-deep)] transition-colors"
              >
                Open Circuit Builder
              </a>
            </div>
          </div>

          {/* 7. RECENT ACTIVITY */}
          <div>
            <h2 className="font-display text-[20px] font-semibold text-[var(--color-text)] mb-5">Recent Activity</h2>
            <div className="flex flex-col gap-4">
              {recentActivity.map((act, i) => (
                <div key={i} className="flex gap-3">
                  <div className="mt-0.5 text-[var(--color-text)]/40 shrink-0">
                    <IconActivity />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-[var(--color-text)] mb-0.5">{act.text}</p>
                    <p className="text-[12px] text-[var(--color-text)]/50">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}



