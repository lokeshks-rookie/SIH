import React, { useState, useRef, useCallback } from 'react';
import DoubleSlitPanel from '../components/learn/panels/DoubleSlitPanel';
import SuperpositionPanel from '../components/learn/panels/SuperpositionPanel';
import SternGerlachPanel from '../components/learn/panels/SternGerlachPanel';
import EntanglementPanel from '../components/learn/panels/EntanglementPanel';
import TunnelingPanel from '../components/learn/panels/TunnelingPanel';
import HeisenbergPanel from '../components/learn/panels/HeisenbergPanel';
import QuantumZenoPanel from '../components/learn/panels/QuantumZenoPanel';
import VirtualParticlesPanel from '../components/learn/panels/VirtualParticlesPanel';
import QuantumEraserPanel from '../components/learn/panels/QuantumEraserPanel';
import DecoherencePanel from '../components/learn/panels/DecoherencePanel';

const TABS = [
  { id: 'slit', num: 1, title: 'Double-slit', tag: 'Duality & Waves' },
  { id: 'qubit', num: 2, title: 'Superposition', tag: 'Bloch Sphere & Cat' },
  { id: 'spin', num: 3, title: 'Stern–Gerlach', tag: 'Quantized Spin' },
  { id: 'entangle', num: 4, title: 'Entanglement', tag: 'Distance & Bell Pairs' },
  { id: 'tunnel', num: 5, title: 'Tunneling', tag: "Sun's Core Fusion" },
  { id: 'heisenberg', num: 6, title: 'Heisenberg', tag: 'Uncertainty Fourier Pair' },
  { id: 'zeno', num: 7, title: 'Quantum Zeno', tag: 'Decay Freezing' },
  { id: 'virtual', num: 8, title: 'Virtual Particles', tag: 'Vacuum Foam & Feynman' },
  { id: 'eraser', num: 9, title: 'Quantum Eraser', tag: 'Delayed Choice' },
  { id: 'decoherence', num: 10, title: 'Decoherence', tag: 'Environmental Jitter' },
];

const WINDOW_SIZE = 4;

export default function Learn() {
  const [activeTab, setActiveTab] = useState('slit');
  const [windowStart, setWindowStart] = useState(0);

  const handleTabClick = (tab, index) => {
    setActiveTab(tab.id);
    // Keep the clicked tab always fully visible inside the window
    if (index < windowStart) {
      setWindowStart(index);
    } else if (index >= windowStart + WINDOW_SIZE) {
      setWindowStart(index - WINDOW_SIZE + 1);
    }
  };

  const canPrev = windowStart > 0;
  const canNext = windowStart + WINDOW_SIZE < TABS.length;

  const slideBack = () => {
    if (canPrev) setWindowStart((w) => Math.max(0, w - 1));
  };

  const slideForward = () => {
    if (canNext) setWindowStart((w) => Math.min(TABS.length - WINDOW_SIZE, w + 1));
  };

  const visibleTabs = TABS.slice(windowStart, windowStart + WINDOW_SIZE);

  // ── Trackpad 2-finger horizontal swipe + touch swipe ──────────────────────
  const wheelAccum = useRef(0);
  const touchStartX = useRef(null);

  const handleWheel = useCallback((e) => {
    // Only intercept when there's meaningful horizontal scroll intent
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY) * 0.5) return;
    e.preventDefault();
    wheelAccum.current += e.deltaX;
    const THRESHOLD = 80;
    if (wheelAccum.current > THRESHOLD) {
      wheelAccum.current = 0;
      setWindowStart((w) => Math.min(TABS.length - WINDOW_SIZE, w + 1));
    } else if (wheelAccum.current < -THRESHOLD) {
      wheelAccum.current = 0;
      setWindowStart((w) => Math.max(0, w - 1));
    }
  }, []);

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (touchStartX.current === null) return;
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    touchStartX.current = null;
    if (Math.abs(dx) < 40) return;
    if (dx > 0) {
      setWindowStart((w) => Math.min(TABS.length - WINDOW_SIZE, w + 1));
    } else {
      setWindowStart((w) => Math.max(0, w - 1));
    }
  }, []);


  return (
    <div className="flex flex-col gap-8 pb-16 max-w-[960px] mx-auto">
      
      {/* 1. EDITORIAL HEADER (Strict Qdemy Visual System) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-[var(--color-accent-light)] text-[var(--color-accent-deep)] text-[12px] font-semibold uppercase tracking-wider rounded-full">
            Interactive Physics Labs
          </span>
          <span className="text-[12px] font-mono text-[var(--color-text)]/60">
            10 Quantum Phenomena • Shared SimEngine
          </span>
        </div>
        <h1 className="font-display text-[32px] md:text-[40px] font-bold tracking-tight text-[var(--color-text)]">
          Quantum Phenomena Simulator
        </h1>
        <p className="text-[15px] text-[var(--color-text)]/70 max-w-[720px] leading-relaxed">
          Every measurement below leaves the signature <span className="font-semibold text-[#B8860B]">amber pulse</span> — marking the exact instant continuous quantum possibilities collapse into a single physical reality.
        </p>
      </div>

      {/* 2. TAB NAVIGATOR — windowed 4-at-a-time, no mid-pill clipping */}
      {/* onWheel: 2-finger horizontal trackpad swipe; touch: mobile finger swipe */}
      <div
        className="flex items-center gap-2 border-b border-[var(--color-border)] pb-2 select-none"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Prev Arrow */}
        <button
          onClick={slideBack}
          disabled={!canPrev}
          className={`flex items-center justify-center w-7 h-7 rounded-full border shrink-0 transition-all cursor-pointer ${
            canPrev
              ? 'bg-[var(--color-card)] border-[var(--color-border)] text-[var(--color-text)]/80 hover:border-[var(--color-text)]/40 hover:text-[var(--color-text)]'
              : 'border-transparent text-[var(--color-border)] cursor-not-allowed'
          }`}
          aria-label="Previous concepts"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M7.5 2L3.5 6L7.5 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Exactly 4 visible pills — each gets equal flex share so none are clipped */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {visibleTabs.map((tab) => {
            const globalIndex = TABS.findIndex((t) => t.id === tab.id);
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab, globalIndex)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-[13px] font-medium transition-all cursor-pointer border flex-1 min-w-0 justify-center ${
                  isActive
                    ? 'bg-[var(--color-accent-deep)] text-white border-[var(--color-accent-deep)] shadow-sm'
                    : 'bg-[var(--color-card)] text-[var(--color-text)]/80 border-[var(--color-border)] hover:border-[var(--color-text)]/40 hover:text-[var(--color-text)]'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[var(--color-border)] text-[var(--color-text)]/70'
                }`}>
                  {tab.num}
                </span>
                <span className="truncate">{tab.title}</span>
              </button>
            );
          })}
        </div>

        {/* Next Arrow */}
        <button
          onClick={slideForward}
          disabled={!canNext}
          className={`flex items-center justify-center w-7 h-7 rounded-full border shrink-0 transition-all cursor-pointer ${
            canNext
              ? 'bg-[var(--color-card)] border-[var(--color-border)] text-[var(--color-text)]/80 hover:border-[var(--color-text)]/40 hover:text-[var(--color-text)]'
              : 'border-transparent text-[var(--color-border)] cursor-not-allowed'
          }`}
          aria-label="Next concepts"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M4.5 2L8.5 6L4.5 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Dot position indicator */}
        <div className="flex items-center gap-1 shrink-0 ml-1">
          {Array.from({ length: TABS.length - WINDOW_SIZE + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setWindowStart(i)}
              className={`rounded-full transition-all cursor-pointer ${
                i === windowStart
                  ? 'w-4 h-1.5 bg-[var(--color-accent-deep)]'
                  : 'w-1.5 h-1.5 bg-[var(--color-border)] hover:bg-[var(--color-text)]/30'
              }`}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 3. SIMULATION VIEWPORT CONTAINER */}
      <div className="w-full bg-[var(--color-base)] border border-[var(--color-border)] rounded-[16px] p-6 shadow-sm flex flex-col gap-6">
        {activeTab === 'slit' && <DoubleSlitPanel />}
        {activeTab === 'qubit' && <SuperpositionPanel />}
        {activeTab === 'spin' && <SternGerlachPanel />}
        {activeTab === 'entangle' && <EntanglementPanel />}
        {activeTab === 'tunnel' && <TunnelingPanel />}
        {activeTab === 'heisenberg' && <HeisenbergPanel />}
        {activeTab === 'zeno' && <QuantumZenoPanel />}
        {activeTab === 'virtual' && <VirtualParticlesPanel />}
        {activeTab === 'eraser' && <QuantumEraserPanel />}
        {activeTab === 'decoherence' && <DecoherencePanel />}
      </div>

      {/* 4. FOOTER CIRCUIT BUILDER BRIDGE */}
      <div className="p-6 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[16px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h3 className="font-display text-[18px] font-semibold text-[var(--color-text)] mb-1">
            Ready to build these phenomena as Quantum Circuits?
          </h3>
          <p className="text-[13px] text-[var(--color-text)]/70 max-w-xl">
            Translate foundational phenomena like Superposition (Hadamard Gate), Entanglement (Bell States), and Phase Inversion into real circuits executed on the Qiskit backend.
          </p>
        </div>
        <a
          href="/circuit-builder"
          className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-action)] text-white rounded-full text-[13px] font-semibold no-underline hover:bg-[var(--color-accent-deep)] transition-colors shrink-0 shadow-sm"
        >
          Open Circuit Builder →
        </a>
      </div>

    </div>
  );
}
