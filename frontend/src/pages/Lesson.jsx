import React, { useState, useEffect, useRef } from 'react';

/* ── MOCK DATA ── */
// In a real app, this would be fetched from the backend or a data file based on the ID.
const conceptData = {
  id: '2',
  part: 'Foundational Phenomena',
  title: 'Superposition & Measurement',
  difficulty: 'Beginner',
  whatItShows: "In classical computing, a bit is strictly 0 or 1. A quantum bit (qubit), however, can exist in a linear combination of both states simultaneously—a property known as superposition. It isn't 'partially 0' or 'partially 1', but rather a fluid state described by probability amplitudes. When you measure the qubit, the superposition collapses, forcing the qubit into a definite state of either |0⟩ or |1⟩ based on those probabilities. This is the core engine behind quantum parallelism.",
  equation: "|ψ⟩ = α|0⟩ + β|1⟩,  P(0) = |α|²,  P(1) = |β|²",
  isAlgorithm: false
};

/* ── ICONS (Phosphor Light) ── */
const IconSparkle = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.91 5.81c.21.64.71 1.14 1.35 1.35L21 12l-5.74 1.84c-.64.21-1.14.71-1.35 1.35L12 21l-1.91-5.81c-.21-.64-.71-1.14-1.35-1.35L3 12l5.74-1.84c.64-.21 1.14-.71 1.35-1.35z" />
  </svg>
);

const IconArrowRight = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const IconArrowLeft = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const IconReset = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
    <path d="M3 3v5h5"></path>
  </svg>
);

const IconCircuit = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 6h10" /><path d="M6 12h12" /><path d="M8 18h10" /><path d="M3 12h3" /><path d="M18 12h3" /><rect x="6" y="4" width="4" height="4" rx="1" /><rect x="14" y="10" width="4" height="4" rx="1" /><rect x="6" y="16" width="4" height="4" rx="1" />
  </svg>
);

const IconCheck = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function Lesson({ id }) {
  // Using the mocked data for the template
  const { title, part, difficulty, whatItShows, equation, isAlgorithm } = conceptData;

  // State for the interactive visualization
  const [prob0, setProb0] = useState(50); // 0 to 100
  const [isMeasured, setIsMeasured] = useState(false);
  const [measuredState, setMeasuredState] = useState(null); // 0 or 1
  const [stats, setStats] = useState({ trials: 0, zeroCount: 0 });
  const [isCompleted, setIsCompleted] = useState(false);

  const prob1 = 100 - prob0;

  // Handle Measurement
  const handleMeasure = () => {
    if (isMeasured) return;
    
    // Collapse based on probability
    const rand = Math.random() * 100;
    const outcome = rand < prob0 ? 0 : 1;
    
    setMeasuredState(outcome);
    setIsMeasured(true);
    setStats(prev => ({
      trials: prev.trials + 1,
      zeroCount: prev.zeroCount + (outcome === 0 ? 1 : 0)
    }));
  };

  const handleResetMeasure = () => {
    setIsMeasured(false);
    setMeasuredState(null);
  };

  const handleClearStats = () => {
    setStats({ trials: 0, zeroCount: 0 });
  };

  return (
    <div className="flex flex-col max-w-[800px] mx-auto pb-20">
      
      {/* 1. BREADCRUMB */}
      <div className="flex items-center gap-2 text-[13px] text-[var(--color-text)]/60 font-medium mb-8">
        <a href="/learn" className="hover:text-[var(--color-text)] transition-colors no-underline text-inherit">Learn</a>
        <span>/</span>
        <a href="/learn?filter=foundational" className="hover:text-[var(--color-text)] transition-colors no-underline text-inherit">{part}</a>
        <span>/</span>
        <span className="text-[var(--color-text)]">{title}</span>
      </div>

      {/* 2. CONCEPT HEADER */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-[var(--color-accent-light)] text-[var(--color-accent-deep)] text-[12px] font-semibold uppercase tracking-wider rounded-full">
            {part}
          </span>
          <span className="px-3 py-1 bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text)]/70 text-[12px] font-medium uppercase tracking-wider rounded-full">
            {difficulty}
          </span>
        </div>
        <h1 className="font-display text-[40px] md:text-[48px] font-bold text-[var(--color-text)] leading-tight mb-4 tracking-tight">
          {title}
        </h1>
        <p className="text-[18px] text-[var(--color-text)]/70 font-medium max-w-[600px] leading-relaxed">
          Understanding the fluid nature of qubits and how observation forces a definite outcome.
        </p>
      </div>

      {/* 3. EXPLANATION SECTION */}
      <div className="mb-12">
        <p className="text-[16px] text-[var(--color-text)] leading-[1.7] mb-8 max-w-[680px]">
          {whatItShows}
        </p>
        
        {/* Equation Block */}
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-6 max-w-[680px]">
          <p className="text-[12px] font-semibold text-[var(--color-text)]/60 uppercase tracking-wider mb-3">Key Equation</p>
          <div className="font-mono text-[16px] md:text-[18px] text-[var(--color-text)] bg-white/50 p-4 rounded-[8px] border border-[var(--color-border)]/50 overflow-x-auto">
            {equation}
          </div>
        </div>
      </div>

      {/* 4. INTERACTIVE VISUALIZATION */}
      <div className="mb-12">
        <h2 className="font-display text-[24px] font-semibold text-[var(--color-text)] mb-4">Interactive Explorer</h2>
        
        <div className="w-full bg-[var(--color-accent-deep)] rounded-[16px] p-6 md:p-8 flex flex-col items-center justify-center relative overflow-hidden text-white shadow-xl">
          {/* Subtle noise/grid bg */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpIi8+PC9zdmc+')] opacity-30"></div>
          
          <div className="w-full max-w-[500px] z-10 flex flex-col gap-8">
            
            {/* Probability Bars */}
            <div className="flex justify-center gap-16 h-[200px] items-end">
              {/* Bar |0> */}
              <div className="flex flex-col items-center gap-3">
                <span className="font-mono text-[14px] text-white/80">{isMeasured ? (measuredState === 0 ? '100%' : '0%') : `${prob0}%`}</span>
                <div className="w-[60px] h-full bg-white/10 rounded-t-[8px] relative overflow-hidden border border-white/20 border-b-0">
                  <div 
                    className="absolute bottom-0 w-full bg-[var(--color-accent-light)] transition-all duration-300 ease-out"
                    style={{ height: `${isMeasured ? (measuredState === 0 ? 100 : 0) : prob0}%` }}
                  ></div>
                </div>
                <span className="font-mono text-[16px] font-bold">|0⟩</span>
              </div>

              {/* Bar |1> */}
              <div className="flex flex-col items-center gap-3">
                <span className="font-mono text-[14px] text-white/80">{isMeasured ? (measuredState === 1 ? '100%' : '0%') : `${prob1}%`}</span>
                <div className="w-[60px] h-full bg-white/10 rounded-t-[8px] relative overflow-hidden border border-white/20 border-b-0">
                  <div 
                    className="absolute bottom-0 w-full bg-[#1E3A2B] border-t-2 border-[var(--color-accent-light)] transition-all duration-300 ease-out"
                    style={{ 
                      height: `${isMeasured ? (measuredState === 1 ? 100 : 0) : prob1}%`,
                      backgroundColor: 'rgba(228, 238, 227, 0.4)'
                    }}
                  ></div>
                </div>
                <span className="font-mono text-[16px] font-bold">|1⟩</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-6">
              
              {/* Slider */}
              <div className="w-full flex flex-col gap-2">
                <div className="flex justify-between text-[13px] font-medium text-white/70">
                  <span>Prepare State (P(|0⟩))</span>
                  <span className="font-mono">{prob0}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={prob0} 
                  onChange={(e) => {
                    if(!isMeasured) setProb0(Number(e.target.value));
                  }}
                  disabled={isMeasured}
                  className={`w-full h-2 rounded-full appearance-none outline-none ${isMeasured ? 'bg-white/10 cursor-not-allowed' : 'bg-white/30 cursor-pointer'}`}
                  style={{
                    backgroundImage: `linear-gradient(to right, var(--color-accent-light) ${prob0}%, transparent ${prob0}%)`
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                {!isMeasured ? (
                  <button 
                    onClick={handleMeasure}
                    className="px-8 py-3 bg-white text-[var(--color-accent-deep)] rounded-full text-[15px] font-bold cursor-pointer hover:bg-[var(--color-accent-light)] transition-colors border-none shadow-lg active:scale-95"
                  >
                    MEASURE
                  </button>
                ) : (
                  <button 
                    onClick={handleResetMeasure}
                    className="px-8 py-3 bg-transparent text-white border border-white/40 rounded-full text-[15px] font-bold cursor-pointer hover:bg-white/10 transition-colors shadow-lg active:scale-95"
                  >
                    PREPARE NEW STATE
                  </button>
                )}
              </div>

            </div>

            {/* Stats Strip */}
            <div className="mt-4 pt-4 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] font-medium text-white/70">
              <div className="flex items-center gap-4">
                <span>Trials: <strong className="text-white font-mono">{stats.trials}</strong></span>
                <span>·</span>
                <span>
                  Collapsed to |0⟩: <strong className="text-white font-mono">{stats.zeroCount}</strong> times 
                  ({stats.trials > 0 ? Math.round((stats.zeroCount / stats.trials) * 100) : 0}%)
                </span>
              </div>
              <button 
                onClick={handleClearStats}
                disabled={stats.trials === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-white/80"
              >
                <IconReset /> Reset Stats
              </button>
            </div>
            
          </div>
        </div>
      </div>

      {/* 5. TRY IT AS A REAL CIRCUIT (Conditional) */}
      {isAlgorithm && (
        <div className="mb-12">
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[16px] p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-[20px] font-semibold text-[var(--color-text)] mb-1">See it in action</h3>
              <p className="text-[14px] text-[var(--color-text)]/70">See this algorithm as an actual quantum circuit.</p>
            </div>
            <a href="/circuit-builder" className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-action)] text-white rounded-full text-[14px] font-semibold no-underline hover:bg-[var(--color-accent-deep)] transition-colors shrink-0">
              <IconCircuit /> Open in Circuit Builder
            </a>
          </div>
        </div>
      )}

      {/* 6. ASK THE AI TUTOR */}
      <div className="mb-12">
        <div className="border border-[var(--color-border)] rounded-[16px] p-6 bg-white/50 relative overflow-hidden group focus-within:border-[var(--color-accent-deep)]/50 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent-light)] rounded-full blur-[40px] opacity-20 -translate-y-1/2 translate-x-1/2 group-focus-within:opacity-40 transition-opacity"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[var(--color-accent-deep)]"><IconSparkle /></span>
              <h3 className="text-[15px] font-semibold text-[var(--color-text)]">Still not clicking? Ask the AI tutor</h3>
            </div>
            <div className="flex items-center gap-3">
              <input 
                type="text" 
                placeholder={`Ask a question about ${title}...`}
                className="flex-1 bg-[var(--color-base)] border border-[var(--color-border)] rounded-[8px] px-4 py-2.5 text-[14px] outline-none focus:border-[var(--color-accent-deep)] transition-colors text-[var(--color-text)] placeholder:text-[var(--color-text)]/50"
              />
              <button className="px-5 py-2.5 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[8px] text-[14px] font-semibold text-[var(--color-text)] hover:bg-[var(--color-border)]/30 transition-colors cursor-pointer">
                Ask
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 7. MARK AS COMPLETE */}
      <div className="flex justify-center mb-16">
        <button 
          onClick={() => setIsCompleted(true)}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-[15px] font-semibold transition-all cursor-pointer border ${
            isCompleted 
              ? 'bg-[var(--color-accent-light)] border-[var(--color-accent-deep)]/20 text-[var(--color-accent-deep)]' 
              : 'bg-transparent border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-text)]'
          }`}
        >
          {isCompleted ? (
            <>
              <IconCheck /> Completed
            </>
          ) : 'Mark as complete'}
        </button>
      </div>

      <hr className="border-t border-[var(--color-border)] mb-12" />

      {/* 8. PREV / NEXT CONCEPT NAVIGATION */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-16">
        <a href="/lesson/1" className="flex items-center gap-3 group no-underline">
          <div className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text)]/60 group-hover:text-[var(--color-text)] group-hover:border-[var(--color-text)] transition-colors shrink-0">
            <IconArrowLeft />
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold text-[var(--color-text)]/50 uppercase tracking-wider mb-0.5">Previous Concept</span>
            <span className="text-[15px] font-medium text-[var(--color-text)] group-hover:text-[var(--color-accent-deep)] transition-colors">Double-slit experiment</span>
          </div>
        </a>

        <a href="/lesson/3" className="flex items-center gap-3 group no-underline sm:text-right">
          <div className="flex flex-col order-2 sm:order-1">
            <span className="text-[12px] font-semibold text-[var(--color-text)]/50 uppercase tracking-wider mb-0.5">Next Concept</span>
            <span className="text-[15px] font-medium text-[var(--color-text)] group-hover:text-[var(--color-accent-deep)] transition-colors">Stern–Gerlach experiment</span>
          </div>
          <div className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text)]/60 group-hover:text-[var(--color-text)] group-hover:border-[var(--color-text)] transition-colors shrink-0 order-1 sm:order-2">
            <IconArrowRight />
          </div>
        </a>
      </div>

      {/* 9. RELATED CONCEPTS */}
      <div>
        <h3 className="font-display text-[20px] font-semibold text-[var(--color-text)] mb-4">Builds on this concept</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a href="/lesson/4" className="block p-5 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] no-underline hover:border-[var(--color-accent-deep)] transition-colors group">
            <h4 className="text-[15px] font-semibold text-[var(--color-text)] mb-1 group-hover:text-[var(--color-accent-deep)] transition-colors">Quantum Entanglement</h4>
            <p className="text-[13px] text-[var(--color-text)]/70 m-0 leading-relaxed">Correlated outcomes with no signal passing between particles.</p>
          </a>
          <a href="/lesson/6" className="block p-5 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] no-underline hover:border-[var(--color-accent-deep)] transition-colors group">
            <h4 className="text-[15px] font-semibold text-[var(--color-text)] mb-1 group-hover:text-[var(--color-accent-deep)] transition-colors">Quantum Zeno Effect</h4>
            <p className="text-[13px] text-[var(--color-text)]/70 m-0 leading-relaxed">How frequent measurement can freeze a system's evolution.</p>
          </a>
        </div>
      </div>

    </div>
  );
}
