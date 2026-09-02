import React, { useState, useEffect, useRef } from 'react';
import { SimEngine, rand, setGlow, clearGlow } from '../simEngine';

export default function DecoherencePanel() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  const [coupling, setCoupling] = useState(25); // Environmental coupling (0 to 100%)
  const [splitView, setSplitView] = useState(false); // Side-by-side comparison

  const couplingRef = useRef(coupling);
  couplingRef.current = coupling;

  const splitViewRef = useRef(splitView);
  splitViewRef.current = splitView;

  useEffect(() => {
    if (!canvasRef.current) return;

    let time = 0;
    // Environmental gas particles
    const gas = [];
    for (let i = 0; i < 35; i++) {
      gas.push({
        x: rand(50, 810),
        y: rand(50, 330),
        vx: rand(-40, 40),
        vy: rand(-40, 40)
      });
    }

    const engine = new SimEngine(canvasRef.current, {
      logicalWidth: 860,
      logicalHeight: 380,
      backgroundClear: 'rgba(18, 21, 31, 0.35)',
      onTick: ({ ctx, dt, width, height, flashes }) => {
        time += dt * 2.5;
        const curCoupling = couplingRef.current / 100; // 0 to 1
        const midY = height / 2;

        // ══════════════════════════════════════════════════════════════
        // 1. UPDATE ENVIRONMENTAL JITTER PARTICLES
        // ══════════════════════════════════════════════════════════════
        const activeGasCount = Math.floor(gas.length * curCoupling);
        for (let i = 0; i < activeGasCount; i++) {
          const g = gas[i];
          g.x += g.vx * dt;
          g.y += g.vy * dt;
          if (g.x < 40 || g.x > width - 40) g.vx *= -1;
          if (g.y < 40 || g.y > height - 40) g.vy *= -1;

          // Draw colliding gas molecule
          ctx.beginPath();
          ctx.arc(g.x, g.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 107, 122, 0.6)';
          ctx.fill();

          // Occasional decohering jitter collision
          if (Math.random() < 0.015 * curCoupling) {
            flashes.spawn(g.x, g.y);
          }
        }

        // ══════════════════════════════════════════════════════════════
        // 2. RENDER PROBABILITY DISTRIBUTION P(x)
        // ══════════════════════════════════════════════════════════════
        // Pure quantum interference term: cos^2(k x)
        // Decoherence dampens the interference term: P(x) = Gauss1 + Gauss2 + 2·(1-coupling)·Interference
        const k = 0.12;

        if (splitViewRef.current) {
          // SPLIT COMPARISON: Left = Isolated (0% coupling), Right = Coupled (Current coupling)
          const halfW = width / 2;

          // Divider
          ctx.strokeStyle = '#3A4059';
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(halfW, 20);
          ctx.lineTo(halfW, height - 20);
          ctx.stroke();
          ctx.setLineDash([]);

          // LEFT: Isolated System (Pristine Quantum Coherence)
          ctx.fillStyle = '#7BE0D9';
          ctx.font = 'bold 11px JetBrains Mono';
          ctx.fillText('ISOLATED SYSTEM (COHERENT)', 40, 45);
          drawDistribution(ctx, 40, halfW - 30, midY, 0, '#7BE0D9', time);

          // RIGHT: Coupled to Environment
          ctx.fillStyle = '#FF6B7A';
          ctx.fillText(`COUPLED SYSTEM (DECOHERING: ${Math.round(curCoupling * 100)}%)`, halfW + 30, 45);
          drawDistribution(ctx, halfW + 30, width - 40, midY, curCoupling, curCoupling > 0.6 ? '#C792EA' : '#FFD166', time);

        } else {
          // FULL VIEWPORT: Live transition from pristine quantum fringes to classical Gaussian blob
          ctx.fillStyle = '#8B90A8';
          ctx.font = 'bold 11px JetBrains Mono';
          ctx.fillText(`QUANTUM STATE COHERENCE: ${Math.round((1 - curCoupling) * 100)}%  |  ENVIRONMENTAL COUPLING: ${Math.round(curCoupling * 100)}%`, 45, 45);

          const color = curCoupling < 0.3 ? '#7BE0D9' : curCoupling > 0.7 ? '#FF6B7A' : '#FFD166';
          drawDistribution(ctx, 60, width - 60, midY, curCoupling, color, time);
        }
      }
    });

    function drawDistribution(ctx, startX, endX, midY, coup, color, t) {
      const cx = (startX + endX) / 2;
      const span = (endX - startX) / 2;

      ctx.save();
      setGlow(ctx, color, 12);
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.2;

      // Baseline
      ctx.beginPath();
      ctx.strokeStyle = '#262B3D';
      ctx.lineWidth = 1;
      ctx.moveTo(startX, midY + 80);
      ctx.lineTo(endX, midY + 80);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;

      for (let x = startX; x <= endX; x += 3) {
        const normX = (x - cx) / (span * 0.7); // normalized -1 to 1

        // Two Gaussian wave packet peaks
        const g1 = Math.exp(-Math.pow((normX - 0.35) * 3, 2));
        const g2 = Math.exp(-Math.pow((normX + 0.35) * 3, 2));

        // Interference term (decays exponentially with coupling)
        const interference = 2 * Math.exp(-coup * 4) * Math.sqrt(g1 * g2) * Math.cos(normX * 18 + Math.sin(t) * 0.4 * coup);
        const prob = Math.max(0, g1 + g2 + interference);

        const y = midY + 80 - prob * 140;
        if (x === startX) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Envelope Shading
      ctx.fillStyle = color.startsWith('#') && color.length === 7 ? `${color}25` : 'rgba(123, 224, 217, 0.15)';
      for (let x = endX; x >= startX; x -= 3) {
        ctx.lineTo(x, midY + 80);
      }
      ctx.closePath();
      ctx.fill();

      clearGlow(ctx);
      ctx.restore();
    }

    engine.start();
    engineRef.current = engine;

    return () => {
      engine.destroy();
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-[22px] font-bold text-[var(--color-text)] mb-1">
            10. Environmental Decoherence &amp; Classical Emergence
          </h2>
          <p className="text-[14px] text-[var(--color-text)]/70 max-w-[680px]">
            Quantum superposition does not require conscious observation to collapse. Uncontrolled interactions with surrounding air molecules and thermal photons destroy relative phase coherence &rho;₀₁(t) &prop; e<sup>-&Lambda;t</sup>, washing interference fringes into a classical probability distribution.
          </p>
        </div>

        <button
          onClick={() => setSplitView(!splitView)}
          className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all cursor-pointer border ${
            splitView
              ? 'bg-[#1E3A2B] text-white border-[#1E3A2B]'
              : 'bg-white text-[var(--color-text)] border-[var(--color-border)] hover:border-[var(--color-text)]/40'
          }`}
        >
          {splitView ? 'Split Comparison View (Active)' : 'Compare Isolated vs Coupled'}
        </button>
      </div>

      <div className="w-full bg-[#12151F] border border-[var(--color-border)] rounded-[12px] overflow-hidden relative shadow-inner">
        <canvas ref={canvasRef} className="block w-full" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px]">
        <div className="flex items-center gap-2 text-[13px] font-medium text-[var(--color-text)]/70">
          <span>Decoherence Mechanism: <strong>Thermal Gas Molecule Scattering</strong></span>
        </div>

        <div className="flex items-center gap-3 text-[13px] font-medium text-[var(--color-text)]/80">
          <span>Environmental Coupling (Jitter Rate)</span>
          <input
            type="range"
            min="0"
            max="100"
            value={coupling}
            onChange={(e) => setCoupling(Number(e.target.value))}
            className="w-32 accent-[var(--color-accent-deep)] cursor-pointer"
          />
          <span className="font-mono text-[12px] bg-white px-2 py-0.5 rounded border border-[var(--color-border)]">
            {coupling}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Quantum Coherence
          </span>
          <span className="font-mono text-[22px] font-bold text-[#7BE0D9]">
            {Math.max(0, 100 - coupling)}%
          </span>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Density Matrix Off-Diagonals
          </span>
          <span className="font-mono text-[16px] font-bold text-[var(--color-text)]">
            ρ₀₁(t) → {coupling > 80 ? '0 (Diagonal)' : 'e^(-Λt)'}
          </span>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Observed Regime
          </span>
          <span className="font-display text-[15px] font-semibold text-[var(--color-accent-deep)]">
            {coupling < 25 ? 'Quantum Superposition' : coupling > 70 ? 'Classical Mixture' : 'Transition Regime'}
          </span>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Quantum-Classical Bridge
          </span>
          <span className="font-mono text-[13px] font-medium text-[var(--color-text)]/80">
            Zurek's Decoherence Theory
          </span>
        </div>
      </div>
    </div>
  );
}
