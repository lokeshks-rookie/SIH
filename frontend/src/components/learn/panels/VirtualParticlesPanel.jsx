import React, { useState, useEffect, useRef } from 'react';
import { SimEngine, rand, setGlow, clearGlow } from '../simEngine';

export default function VirtualParticlesPanel() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  const [feynmanMode, setFeynmanMode] = useState(false);
  const [vacuumEnergy, setVacuumEnergy] = useState(50); // density of fluctuations
  const [annihilations, setAnnihilations] = useState(0);

  const feynmanModeRef = useRef(feynmanMode);
  feynmanModeRef.current = feynmanMode;

  const vacuumEnergyRef = useRef(vacuumEnergy);
  vacuumEnergyRef.current = vacuumEnergy;

  // Active virtual pairs pool: { x, y, dx, dy, lifetime, maxLife, energy }
  const pairsRef = useRef([]);

  useEffect(() => {
    if (!canvasRef.current) return;

    let spawnTimer = 0;
    let feynmanTime = 0;

    const engine = new SimEngine(canvasRef.current, {
      logicalWidth: 860,
      logicalHeight: 380,
      backgroundClear: 'rgba(18, 21, 31, 0.35)',
      onTick: ({ ctx, dt, width, height, flashes }) => {
        feynmanTime += dt * 3;

        // ══════════════════════════════════════════════════════════════
        // MODE A: FEYNMAN DIAGRAM MODE (Virtual Photon Exchange)
        // ══════════════════════════════════════════════════════════════
        if (feynmanModeRef.current) {
          ctx.save();
          // Incoming & Outgoing Real Electrons
          const midX = width / 2;
          const midY = height / 2;

          ctx.strokeStyle = '#7BE0D9';
          ctx.lineWidth = 2.5;

          // Top electron line (in & out)
          ctx.beginPath();
          ctx.moveTo(150, 80);
          ctx.lineTo(midX - 100, 140);
          ctx.lineTo(width - 150, 80);
          ctx.stroke();

          // Bottom electron line (in & out)
          ctx.beginPath();
          ctx.moveTo(150, 300);
          ctx.lineTo(midX - 100, 240);
          ctx.lineTo(width - 150, 300);
          ctx.stroke();

          // Arrows on fermion lines
          ctx.fillStyle = '#7BE0D9';
          ctx.font = '12px JetBrains Mono';
          ctx.fillText('e⁻ (in)', 110, 85);
          ctx.fillText('e⁻ (out)', width - 130, 85);
          ctx.fillText('e⁻ (in)', 110, 305);
          ctx.fillText('e⁻ (out)', width - 130, 305);

          // Vertices
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(midX - 100, 140, 5, 0, Math.PI * 2);
          ctx.arc(midX - 100, 240, 5, 0, Math.PI * 2);
          ctx.fill();

          // Virtual Photon Wavy Propagator line γ
          setGlow(ctx, '#FFD166', 15);
          ctx.strokeStyle = '#FFD166';
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          for (let y = 140; y <= 240; y += 2) {
            const x = (midX - 100) + Math.sin((y - 140) * 0.25 + feynmanTime * 2) * 12;
            if (y === 140) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.stroke();
          clearGlow(ctx);

          ctx.fillStyle = '#FFD166';
          ctx.font = 'bold 12px JetBrains Mono';
          ctx.fillText('Virtual Photon (γ)', midX - 70, 195);
          ctx.fillStyle = '#8B90A8';
          ctx.font = '10px JetBrains Mono';
          ctx.fillText('q² ≠ m² (Off mass-shell mediator)', midX - 70, 212);

          ctx.restore();
          return;
        }

        // ══════════════════════════════════════════════════════════════
        // MODE B: QUANTUM VACUUM FOAM & VIRTUAL PAIR CREATION
        // ══════════════════════════════════════════════════════════════

        // 1. Vacuum Foam shimmering points
        const foamCount = 45;
        for (let i = 0; i < foamCount; i++) {
          const fx = (i * 97 + Date.now() * 0.05) % width;
          const fy = (i * 61 + Math.sin(i + Date.now() * 0.003) * 80 + height / 2) % height;
          ctx.fillStyle = `rgba(255, 255, 255, ${0.05 + Math.random() * 0.06})`;
          ctx.fillRect(fx, fy, 1.5, 1.5);
        }

        // 2. Spawn Virtual Pairs from the vacuum
        spawnTimer += dt;
        const spawnInterval = 1 / (vacuumEnergyRef.current * 0.12);
        if (spawnTimer >= spawnInterval) {
          spawnTimer = 0;
          const life = rand(0.4, 0.9);
          pairsRef.current.push({
            x: rand(80, width - 80),
            y: rand(60, height - 60),
            dist: 0,
            angle: rand(0, Math.PI * 2),
            life: life,
            maxLife: life,
            energy: rand(10, 40)
          });
        }

        // 3. Update & Draw Pairs
        for (let i = pairsRef.current.length - 1; i >= 0; i--) {
          const pair = pairsRef.current[i];
          pair.life -= dt;
          const progress = 1 - pair.life / pair.maxLife; // 0 to 1

          // Separation expands then snaps back
          const currentSep = Math.sin(progress * Math.PI) * 28;
          const p1x = pair.x + Math.cos(pair.angle) * currentSep;
          const p1y = pair.y + Math.sin(pair.angle) * currentSep;
          const p2x = pair.x - Math.cos(pair.angle) * currentSep;
          const p2y = pair.y - Math.sin(pair.angle) * currentSep;

          // Particle (e⁻, cyan)
          setGlow(ctx, '#7BE0D9', 8);
          ctx.beginPath();
          ctx.arc(p1x, p1y, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = '#7BE0D9';
          ctx.fill();

          // Antiparticle (e⁺, violet)
          setGlow(ctx, '#C792EA', 8);
          ctx.beginPath();
          ctx.arc(p2x, p2y, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = '#C792EA';
          ctx.fill();
          clearGlow(ctx);

          // Fluctuating link
          ctx.strokeStyle = `rgba(255, 209, 102, ${0.4 * (1 - progress)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p1x, p1y);
          ctx.lineTo(p2x, p2y);
          ctx.stroke();

          // Depleting Borrowed Energy bar
          const barLen = 22 * (pair.life / pair.maxLife);
          ctx.fillStyle = '#FFD166';
          ctx.fillRect(pair.x - 11, pair.y - 16, barLen, 2.5);

          // Pair reaches end of borrowed time -> Annihilate with amber flash!
          if (pair.life <= 0) {
            flashes.spawn(pair.x, pair.y);
            setAnnihilations(a => a + 1);
            pairsRef.current.splice(i, 1);
          }
        }

        // Title Legend in canvas
        ctx.fillStyle = '#8B90A8';
        ctx.font = '10px JetBrains Mono';
        ctx.fillText('QUANTUM VACUUM FLUCTUATION FIELD: ΔE · Δt ≈ ℏ', 30, 30);
      }
    });

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
            08. Virtual Particles &amp; Quantum Vacuum Foam
          </h2>
          <p className="text-[14px] text-[var(--color-text)]/70 max-w-[680px]">
          The vacuum is not empty. Particle–antiparticle pairs (e⁻, e⁺) continuously borrow energy from the vacuum for a time Δt ≈ ℏ / ΔE, spontaneously annihilating back into pure energy.
        </p>
        </div>

        {/* Bonus Feature: Feynman Diagram Mode Toggle */}
        <button
          onClick={() => setFeynmanMode(!feynmanMode)}
          className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all cursor-pointer border ${
            feynmanMode
              ? 'bg-[#1E3A2B] text-white border-[#1E3A2B]'
              : 'bg-white text-[var(--color-text)] border-[var(--color-border)] hover:border-[var(--color-text)]/40'
          }`}
        >
          {feynmanMode ? 'Feynman Diagram Mode (Active)' : 'Switch to Feynman Diagram Mode'}
        </button>
      </div>

      <div className="w-full bg-[#12151F] border border-[var(--color-border)] rounded-[12px] overflow-hidden relative shadow-inner">
        <canvas ref={canvasRef} className="block w-full" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px]">
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-medium text-[var(--color-text)]/70">
            Vacuum State: <strong>Fluctuating Ground State</strong>
          </span>
        </div>

        <div className="flex items-center gap-3 text-[13px] font-medium text-[var(--color-text)]/80">
          <span>Vacuum Fluctuation Rate</span>
          <input
            type="range"
            min="10"
            max="100"
            value={vacuumEnergy}
            onChange={(e) => setVacuumEnergy(Number(e.target.value))}
            className="w-28 accent-[var(--color-accent-deep)] cursor-pointer"
          />
          <span className="font-mono text-[12px] bg-white px-2 py-0.5 rounded border border-[var(--color-border)]">
            {vacuumEnergy}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Flash Annihilations
          </span>
          <span className="font-mono text-[22px] font-bold text-[#FFD166]">
            {annihilations}
          </span>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Energy-Time Relation
          </span>
          <span className="font-mono text-[16px] font-bold text-[var(--color-text)]">
            ΔE · Δt ≈ ℏ
          </span>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Force Mediation
          </span>
          <span className="font-display text-[15px] font-semibold text-[var(--color-accent-deep)]">
            QED Virtual Photons
          </span>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Physical Consequence
          </span>
          <span className="font-mono text-[13px] font-medium text-[var(--color-text)]/80">
            Casimir Effect / Lamb Shift
          </span>
        </div>
      </div>
    </div>
  );
}
