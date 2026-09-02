import React, { useState, useEffect, useRef } from 'react';
import { SimEngine, rand, clamp, setGlow, clearGlow } from '../simEngine';

export default function DoubleSlitPanel() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  // Panel State
  const [detector, setDetector] = useState(false);
  const [viewMode, setViewMode] = useState('particle'); // 'particle' or 'wave'
  const [firing, setFiring] = useState(false);
  const [count, setCount] = useState(0);
  const [rate, setRate] = useState(3);

  // Geometry
  const sourceX = 60;
  const slitX = 300;
  const screenX = 780;
  const slitGap = 70;
  const slitHalf = 14;

  const binsRef = useRef(new Array(90).fill(0));
  const detectorRef = useRef(detector);
  detectorRef.current = detector;

  const viewModeRef = useRef(viewMode);
  viewModeRef.current = viewMode;

  const firingRef = useRef(firing);
  firingRef.current = firing;

  const rateRef = useRef(rate);
  rateRef.current = rate;

  const fireAccumulatorRef = useRef(0);
  const waveTimeRef = useRef(0);

  // Sample Y coordinates
  const sampleY = () => {
    const isDet = detectorRef.current;
    for (let tries = 0; tries < 400; tries++) {
      const y = rand(-1, 1);
      let p;
      if (isDet) {
        const c = slitGap / 2 / (190 * 0.9);
        p = Math.exp(-Math.pow((y - c) * 3.2, 2)) + Math.exp(-Math.pow((y + c) * 3.2, 2));
      } else {
        const k = 18;
        const envelope = Math.exp(-y * y * 2.2);
        p = envelope * Math.pow(Math.cos(k * y * 0.5), 2);
      }
      if (Math.random() < p) return y;
    }
    return 0;
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const H = 380;
    const cy = H / 2;
    const binW = (H - 40) / binsRef.current.length;
    const slit1Y = cy - slitGap / 2;
    const slit2Y = cy + slitGap / 2;

    const engine = new SimEngine(canvasRef.current, {
      logicalWidth: 860,
      logicalHeight: 380,
      backgroundClear: 'rgba(18, 21, 31, 0.35)', // Soft motion trail
      onTick: ({ ctx, dt, width, height, flashes, particles }) => {
        waveTimeRef.current += dt * 3.5;

        // 1. Particle Spawner
        if (firingRef.current) {
          fireAccumulatorRef.current += dt;
          const spawnInterval = 1 / (rateRef.current * 4);
          while (fireAccumulatorRef.current >= spawnInterval) {
            fireAccumulatorRef.current -= spawnInterval;
            const targetY = sampleY();
            const whichSlit = Math.random() < 0.5 ? -slitGap / 2 : slitGap / 2;
            particles.spawn({
              x: sourceX,
              y: cy,
              stage: 0,
              targetSlitY: cy + whichSlit,
              finalY: cy + targetY * (cy - 30),
              speed: 540
            });
            setCount(c => c + 1);
          }
        }

        // 2. Wave View: Render interfering wavefront ripples
        if (viewModeRef.current === 'wave') {
          ctx.save();
          // Wave from source to barrier
          for (let r = (waveTimeRef.current * 45) % 30; r < slitX - sourceX; r += 28) {
            ctx.beginPath();
            ctx.arc(sourceX, cy, r, -Math.PI / 3, Math.PI / 3);
            ctx.strokeStyle = `rgba(123, 224, 217, ${Math.max(0.08, 0.4 - r / 400)})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          }

          // Waves propagating from the two slits
          const maxWaveR = screenX - slitX;
          for (let r = (waveTimeRef.current * 50) % 25; r < maxWaveR; r += 22) {
            const alpha = Math.max(0.05, 0.35 * (1 - r / maxWaveR));

            // Slit 1 ripple
            ctx.beginPath();
            ctx.arc(slitX, slit1Y, r, -Math.PI / 2.2, Math.PI / 2.2);
            ctx.strokeStyle = detectorRef.current
              ? `rgba(255, 107, 122, ${alpha})`
              : `rgba(123, 224, 217, ${alpha})`;
            ctx.lineWidth = 1.6;
            ctx.stroke();

            // Slit 2 ripple (only interferes if detector is OFF)
            if (!detectorRef.current) {
              ctx.beginPath();
              ctx.arc(slitX, slit2Y, r, -Math.PI / 2.2, Math.PI / 2.2);
              ctx.strokeStyle = `rgba(199, 146, 234, ${alpha})`;
              ctx.lineWidth = 1.6;
              ctx.stroke();
            }
          }
          ctx.restore();
        }

        // 3. Static Apparatus
        // Source
        ctx.fillStyle = '#2A2F42';
        ctx.fillRect(sourceX - 8, cy - 18, 16, 36);
        ctx.fillStyle = '#8B90A8';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillText('source', sourceX - 18, cy + 34);

        // Slit barrier
        ctx.fillStyle = '#1E2333';
        ctx.fillRect(slitX - 4, 0, 8, cy - slitGap / 2 - slitHalf);
        ctx.fillRect(slitX - 4, cy - slitGap / 2 + slitHalf, 8, slitGap - 2 * slitHalf);
        ctx.fillRect(slitX - 4, cy + slitGap / 2 + slitHalf, 8, height - (cy + slitGap / 2 + slitHalf));

        // Detector indicator
        if (detectorRef.current) {
          ctx.strokeStyle = '#FFD166';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([3, 3]);
          ctx.strokeRect(slitX - 16, cy - slitGap / 2 - slitHalf - 6, 32, slitGap + 2 * slitHalf + 12);
          ctx.setLineDash([]);
          ctx.fillStyle = '#FFD166';
          ctx.font = '9px JetBrains Mono, monospace';
          ctx.fillText('detector (which-path)', slitX - 35, cy - slitGap / 2 - slitHalf - 12);
        }

        // Screen plane
        ctx.strokeStyle = '#3A4059';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(screenX, 10);
        ctx.lineTo(screenX, height - 10);
        ctx.stroke();

        // 4. Update & Draw Particles (with Bloom Glow)
        particles.update(dt, (p) => {
          const dx = p.speed * dt;
          if (p.stage === 0) {
            p.x += dx;
            const t = (p.x - sourceX) / (slitX - sourceX);
            p.y = cy + (p.targetSlitY - cy) * t;
            if (p.x >= slitX) {
              p.stage = 1;
              p.startX = slitX;
              p.startY = p.targetSlitY;
            }
          } else {
            p.x += dx;
            const t = (p.x - slitX) / (screenX - slitX);
            p.y = p.startY + (p.finalY - p.startY) * t;
            if (p.x >= screenX) {
              const bi = clamp(Math.floor((p.finalY - 20) / binW), 0, binsRef.current.length - 1);
              binsRef.current[bi]++;
              flashes.spawn(screenX, p.finalY);
              return false;
            }
          }
          return true;
        });

        // Draw particle dots with cyan glow
        setGlow(ctx, '#7BE0D9', 8);
        particles.draw(ctx, (context, p) => {
          context.beginPath();
          context.arc(p.x, p.y, 3.2, 0, Math.PI * 2);
          context.fillStyle = '#7BE0D9';
          context.fill();
        });
        clearGlow(ctx);

        // 5. Histogram distribution accumulation
        const maxBin = Math.max(1, ...binsRef.current);
        for (let i = 0; i < binsRef.current.length; i++) {
          const barH = (binsRef.current[i] / maxBin) * 140;
          const yPos = 20 + i * binW;
          ctx.fillStyle = detectorRef.current ? 'rgba(255, 107, 122, 0.75)' : 'rgba(123, 224, 217, 0.75)';
          ctx.fillRect(screenX + 4, yPos, barH, binW - 1);
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
    binsRef.current.fill(0);
    setCount(0);
    if (engineRef.current) {
      engineRef.current.particles.clear();
      engineRef.current.flashes.clear();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-[22px] font-bold text-[var(--color-text)] mb-1">
            01. Double-slit experiment
          </h2>
          <p className="text-[14px] text-[var(--color-text)]/70 max-w-[680px]">
            Wave-particle duality visualized. Toggle between discrete particle trajectories and continuous propagating wavefronts.
          </p>
        </div>

        {/* Stage 3 Enhancement: Particle vs Wave View Toggle */}
        <div className="flex items-center bg-[var(--color-card)] p-1 rounded-full border border-[var(--color-border)] shrink-0">
          <button
            onClick={() => setViewMode('particle')}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-colors cursor-pointer border-none ${
              viewMode === 'particle'
                ? 'bg-[var(--color-accent-deep)] text-white'
                : 'text-[var(--color-text)]/70 hover:text-[var(--color-text)]'
            }`}
          >
            Particle View
          </button>
          <button
            onClick={() => setViewMode('wave')}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-colors cursor-pointer border-none ${
              viewMode === 'wave'
                ? 'bg-[var(--color-accent-deep)] text-white'
                : 'text-[var(--color-text)]/70 hover:text-[var(--color-text)]'
            }`}
          >
            Wave View
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="w-full bg-[#12151F] border border-[var(--color-border)] rounded-[12px] overflow-hidden relative shadow-inner">
        <canvas ref={canvasRef} className="block w-full" />
      </div>

      {/* Controls */}
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
            {firing ? 'Stop firing' : 'Fire particles'}
          </button>

          <button
            onClick={() => {
              setDetector(!detector);
              binsRef.current.fill(0);
            }}
            className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all cursor-pointer border ${
              detector
                ? 'bg-[var(--color-accent-light)] text-[var(--color-accent-deep)] border-[var(--color-accent-deep)]/40'
                : 'bg-white text-[var(--color-text)] border-[var(--color-border)] hover:border-[var(--color-text)]/40'
            }`}
          >
            Detector: {detector ? 'ON (Collapsing)' : 'OFF (Interference)'}
          </button>

          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-full bg-white text-[var(--color-text)] border border-[var(--color-border)] text-[13px] font-medium hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            Reset Screen
          </button>
        </div>

        <div className="flex items-center gap-3 text-[13px] font-medium text-[var(--color-text)]/80">
          <span>Firing rate</span>
          <input
            type="range"
            min="1"
            max="8"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-24 accent-[var(--color-accent-deep)] cursor-pointer"
          />
          <span className="font-mono text-[12px] bg-white px-2 py-0.5 rounded border border-[var(--color-border)]">
            {rate}x
          </span>
        </div>
      </div>

      {/* Telemetry Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Particles Fired
          </span>
          <span className="font-mono text-[22px] font-bold text-[var(--color-text)]">
            {count}
          </span>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Active Mode
          </span>
          <span className="font-display text-[18px] font-semibold text-[var(--color-accent-deep)] capitalize">
            {viewMode} Mode
          </span>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Measurement Signature
          </span>
          <span className="font-mono text-[16px] font-bold text-[#D97706] flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD166] animate-pulse"></span>
            Amber Pulse
          </span>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Distribution
          </span>
          <span className="font-mono text-[14px] font-medium text-[var(--color-text)]/80">
            {detector ? 'P(x) = |ψ₁|² + |ψ₂|²' : 'P(x) = |ψ₁ + ψ₂|²'}
          </span>
        </div>
      </div>
    </div>
  );
}
