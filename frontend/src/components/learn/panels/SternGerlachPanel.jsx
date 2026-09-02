import React, { useState, useEffect, useRef } from 'react';
import { SimEngine, clamp, setGlow, clearGlow } from '../simEngine';

export default function SternGerlachPanel() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  const [firing, setFiring] = useState(false);
  const [showClassical, setShowClassical] = useState(false);
  const [bias, setBias] = useState(50); // % spin up
  const [counts, setCounts] = useState({ up: 0, down: 0 });

  const firingRef = useRef(firing);
  firingRef.current = firing;

  const showClassicalRef = useRef(showClassical);
  showClassicalRef.current = showClassical;

  const biasRef = useRef(bias);
  biasRef.current = bias;

  const upBinsRef = useRef(new Array(30).fill(0));
  const downBinsRef = useRef(new Array(30).fill(0));
  const spawnAccRef = useRef(0);

  const magnetX0 = 280;
  const magnetX1 = 460;
  const screenX = 780;

  useEffect(() => {
    if (!canvasRef.current) return;

    const H = 380;
    const cy = H / 2;
    const bw = 200 / 30;

    const engine = new SimEngine(canvasRef.current, {
      logicalWidth: 860,
      logicalHeight: 380,
      backgroundClear: 'rgba(18, 21, 31, 0.35)',
      onTick: ({ ctx, dt, width, height, flashes, particles }) => {
        // Delta-time beam spawner
        if (firingRef.current) {
          spawnAccRef.current += dt;
          while (spawnAccRef.current >= 0.08) {
            spawnAccRef.current -= 0.08;
            particles.spawn({
              x: 60,
              y: cy,
              outcome: null,
              speed: 480
            });
          }
        }

        // 1. Magnetic Field Poles
        ctx.fillStyle = '#2A2F42';
        ctx.fillRect(magnetX0, 45, magnetX1 - magnetX0, 65);
        ctx.fillRect(magnetX0, height - 110, magnetX1 - magnetX0, 65);

        // Pole Labels
        ctx.fillStyle = '#8B90A8';
        ctx.font = 'bold 12px JetBrains Mono, monospace';
        ctx.fillText('N (Shaped Wedge)', magnetX0 + (magnetX1 - magnetX0) / 2 - 50, 84);
        ctx.fillText('S (Flat Base)', magnetX0 + (magnetX1 - magnetX0) / 2 - 40, height - 72);

        // Magnetic Field Gradient Lines
        ctx.strokeStyle = 'rgba(199, 146, 234, 0.2)';
        ctx.setLineDash([2, 4]);
        for (let x = magnetX0 + 20; x < magnetX1; x += 30) {
          ctx.beginPath();
          ctx.moveTo(x, 110);
          ctx.lineTo(x, height - 110);
          ctx.stroke();
        }
        ctx.setLineDash([]);

        // 2. Classical Continuous Expectation (Faint Cloud)
        if (showClassicalRef.current) {
          ctx.fillStyle = 'rgba(139, 144, 168, 0.25)';
          for (let i = 0; i < 30; i++) {
            const yy = cy + (i / 29 - 0.5) * 220;
            ctx.beginPath();
            ctx.arc(screenX, yy, 3, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = '#8B90A8';
          ctx.font = '10px JetBrains Mono, monospace';
          ctx.fillText('Classical expectation: continuous spread', magnetX0 - 20, height - 20);
        }

        // Screen Line
        ctx.strokeStyle = '#3A4059';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(screenX, 10);
        ctx.lineTo(screenX, height - 10);
        ctx.stroke();

        // 3. Update Particles
        const currentBias = biasRef.current / 100;
        particles.update(dt, (p) => {
          p.x += p.speed * dt;

          if (p.x > magnetX0 && p.outcome === null) {
            p.outcome = Math.random() < currentBias ? 1 : -1; // 1: Spin Up, -1: Spin Down
          }

          if (p.outcome !== null && p.x > magnetX0) {
            const t = (p.x - magnetX0) / (magnetX1 - magnetX0 + 120);
            p.y = cy + p.outcome * Math.min(t, 1) * 95;
          }

          if (p.x >= screenX) {
            const bi = clamp(Math.floor((p.y - (cy - 100)) / bw), 0, 29);
            if (p.outcome === 1) {
              upBinsRef.current[bi]++;
              setCounts(c => ({ ...c, up: c.up + 1 }));
            } else {
              downBinsRef.current[bi]++;
              setCounts(c => ({ ...c, down: c.down + 1 }));
            }
            flashes.spawn(screenX, p.y);
            return false;
          }
          return true;
        });

        // Draw flying atoms with glow
        particles.draw(ctx, (context, p) => {
          const color = p.outcome === 1 ? '#7BE0D9' : p.outcome === -1 ? '#C792EA' : '#E8E6F0';
          setGlow(context, color, 8);
          context.beginPath();
          context.arc(p.x, p.y, 3.2, 0, Math.PI * 2);
          context.fillStyle = color;
          context.fill();
          clearGlow(context);
        });

        // 4. Draw Discrete Detection Histograms
        const maxB = Math.max(1, ...upBinsRef.current, ...downBinsRef.current);
        for (let i = 0; i < 30; i++) {
          const y = (cy - 100) + i * bw;
          if (upBinsRef.current[i]) {
            ctx.fillStyle = 'rgba(123, 224, 217, 0.85)';
            ctx.fillRect(screenX + 5, y, (upBinsRef.current[i] / maxB) * 110, bw - 1);
          }
          if (downBinsRef.current[i]) {
            ctx.fillStyle = 'rgba(199, 146, 234, 0.85)';
            ctx.fillRect(screenX + 5, y, (downBinsRef.current[i] / maxB) * 110, bw - 1);
          }
        }
      }
    });

    engine.start();
    engineRef.current = engine;

    return () => {
      engine.destroy();
    };
  }, []);

  const handleReset = () => {
    upBinsRef.current.fill(0);
    downBinsRef.current.fill(0);
    setCounts({ up: 0, down: 0 });
    if (engineRef.current) {
      engineRef.current.particles.clear();
      engineRef.current.flashes.clear();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-[22px] font-bold text-[var(--color-text)] mb-1">
          03. Stern–Gerlach Experiment
        </h2>
        <p className="text-[14px] text-[var(--color-text)]/70 max-w-[680px]">
          Atoms pass through an inhomogeneous magnetic field. A classical magnetic dipole would produce a continuous smear; quantum spin-½ splits strictly into two discrete spots: <b>Spin Up (+ℏ/2)</b> or <b>Spin Down (-ℏ/2)</b>.
        </p>
      </div>

      <div className="w-full bg-[#12151F] border border-[var(--color-border)] rounded-[12px] overflow-hidden relative shadow-inner">
        <canvas ref={canvasRef} className="block w-full" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px]">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setFiring(!firing)}
            className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all cursor-pointer border-none shadow-sm ${
              firing
                ? 'bg-[var(--color-accent-deep)] text-white'
                : 'bg-[var(--color-action)] text-white hover:bg-[var(--color-accent-deep)]'
            }`}
          >
            {firing ? 'Stop Beam' : 'Fire Silver Beam'}
          </button>

          <button
            onClick={() => setShowClassical(!showClassical)}
            className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all cursor-pointer border ${
              showClassical
                ? 'bg-[var(--color-accent-light)] text-[var(--color-accent-deep)] border-[var(--color-accent-deep)]/40'
                : 'bg-white text-[var(--color-text)] border-[var(--color-border)] hover:border-[var(--color-text)]/40'
            }`}
          >
            {showClassical ? 'Hide Classical Model' : 'Show Classical Expectation'}
          </button>

          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-full bg-white text-[var(--color-text)] border border-[var(--color-border)] text-[13px] font-medium hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            Reset Detector
          </button>
        </div>

        <div className="flex items-center gap-3 text-[13px] font-medium text-[var(--color-text)]/80">
          <span>Beam Polarization Bias</span>
          <input
            type="range"
            min="0"
            max="100"
            value={bias}
            onChange={(e) => setBias(Number(e.target.value))}
            className="w-24 accent-[var(--color-accent-deep)] cursor-pointer"
          />
          <span className="font-mono text-[12px] bg-white px-2 py-0.5 rounded border border-[var(--color-border)]">
            {bias}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Spin Up |↑⟩ (+ℏ/2)
          </span>
          <span className="font-mono text-[22px] font-bold text-[#7BE0D9]">
            {counts.up}
          </span>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Spin Down |↓⟩ (-ℏ/2)
          </span>
          <span className="font-mono text-[22px] font-bold text-[#C792EA]">
            {counts.down}
          </span>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Quantized Spectrum
          </span>
          <span className="font-mono text-[16px] font-bold text-[var(--color-accent-deep)]">
            Discrete (2 Spots)
          </span>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Measurement Flash
          </span>
          <span className="font-mono text-[16px] font-bold text-[#D97706] flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD166] animate-pulse"></span>
            Amber Pulse
          </span>
        </div>
      </div>
    </div>
  );
}
