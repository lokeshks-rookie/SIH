import React, { useState, useEffect, useRef } from 'react';
import { SimEngine, gaussian, setGlow, clearGlow } from '../simEngine';

export default function HeisenbergPanel() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  const [deltaX, setDeltaX] = useState(35); // position spread (px)
  const deltaXRef = useRef(deltaX);
  deltaXRef.current = deltaX;

  // Quantum calculations
  // deltaP is inversely proportional to deltaX: deltaP = C / deltaX
  // Product deltaX * deltaP >= hbar / 2
  const hbar = 1000;
  const hbarHalf = hbar / 2; // 500
  const deltaP = hbar / deltaX;
  const product = deltaX * deltaP; // exactly 1000 for minimum Gaussian wave packet!

  useEffect(() => {
    if (!canvasRef.current) return;

    let time = 0;

    const engine = new SimEngine(canvasRef.current, {
      logicalWidth: 860,
      logicalHeight: 380,
      backgroundClear: 'rgba(18, 21, 31, 0.35)',
      onTick: ({ ctx, dt, width, height, flashes }) => {
        time += dt * 3;
        const curDeltaX = deltaXRef.current;
        const curDeltaP = hbar / curDeltaX;

        const midY = height / 2;
        const panelW = width / 2 - 30;

        // ══════════════════════════════════════════════════════════════
        // PANEL A: POSITION SPACE ψ(x) (Left: 30..410)
        // ══════════════════════════════════════════════════════════════
        const cx1 = 30 + panelW / 2;

        // Frame
        ctx.strokeStyle = '#2A2F42';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(30, 40, panelW, 260);
        ctx.fillStyle = 'rgba(24, 28, 41, 0.4)';
        ctx.fillRect(30, 40, panelW, 260);

        ctx.fillStyle = '#7BE0D9';
        ctx.font = 'bold 12px JetBrains Mono, monospace';
        ctx.fillText('POSITION SPACE ψ(x)', 45, 62);
        ctx.fillStyle = '#8B90A8';
        ctx.font = '10px JetBrains Mono';
        ctx.fillText(`Δx = ±${Math.round(curDeltaX)} nm`, 45, 78);

        // Baseline
        ctx.strokeStyle = '#262B3D';
        ctx.beginPath();
        ctx.moveTo(30, midY);
        ctx.lineTo(30 + panelW, midY);
        ctx.stroke();

        // Wave packet in position space
        setGlow(ctx, '#7BE0D9', 12);
        ctx.beginPath();
        ctx.strokeStyle = '#7BE0D9';
        ctx.lineWidth = 2;
        for (let x = 30; x <= 30 + panelW; x += 3) {
          const env = gaussian(x, cx1, curDeltaX);
          const y = midY - env * 95 * Math.sin((x - cx1) * 0.4 + time);
          if (x === 30) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Envelope fill
        ctx.beginPath();
        ctx.fillStyle = 'rgba(123, 224, 217, 0.2)';
        for (let x = 30; x <= 30 + panelW; x += 3) {
          const env = gaussian(x, cx1, curDeltaX);
          ctx.lineTo(x, midY - env * 95);
        }
        for (let x = 30 + panelW; x >= 30; x -= 3) {
          const env = gaussian(x, cx1, curDeltaX);
          ctx.lineTo(x, midY + env * 95);
        }
        ctx.closePath();
        ctx.fill();
        clearGlow(ctx);

        // Δx Uncertainty Bar Indicator
        ctx.strokeStyle = '#FFD166';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(cx1 - curDeltaX, midY + 110);
        ctx.lineTo(cx1 + curDeltaX, midY + 110);
        ctx.moveTo(cx1 - curDeltaX, midY + 104);
        ctx.lineTo(cx1 - curDeltaX, midY + 116);
        ctx.moveTo(cx1 + curDeltaX, midY + 104);
        ctx.lineTo(cx1 + curDeltaX, midY + 116);
        ctx.stroke();

        ctx.fillStyle = '#FFD166';
        ctx.font = '10px JetBrains Mono';
        ctx.fillText('2Δx', cx1 - 10, midY + 125);

        // ══════════════════════════════════════════════════════════════
        // PANEL B: MOMENTUM SPACE ϕ(p) (Right: 450..830)
        // ══════════════════════════════════════════════════════════════
        const cx2 = 450 + panelW / 2;

        // Frame
        ctx.strokeStyle = '#2A2F42';
        ctx.strokeRect(450, 40, panelW, 260);
        ctx.fillStyle = 'rgba(24, 28, 41, 0.4)';
        ctx.fillRect(450, 40, panelW, 260);

        ctx.fillStyle = '#C792EA';
        ctx.font = 'bold 12px JetBrains Mono, monospace';
        ctx.fillText('MOMENTUM SPACE ϕ(p) [Fourier Dual]', 465, 62);
        ctx.fillStyle = '#8B90A8';
        ctx.font = '10px JetBrains Mono';
        ctx.fillText(`Δp = ±${Math.round(curDeltaP)} keV/c`, 465, 78);

        // Baseline
        ctx.strokeStyle = '#262B3D';
        ctx.beginPath();
        ctx.moveTo(450, midY);
        ctx.lineTo(450 + panelW, midY);
        ctx.stroke();

        // Wave packet in momentum space (spread scales with curDeltaP)
        const momVisualWidth = clamp(curDeltaP * 1.8, 12, 110);
        setGlow(ctx, '#C792EA', 12);
        ctx.beginPath();
        ctx.strokeStyle = '#C792EA';
        ctx.lineWidth = 2;
        for (let x = 450; x <= 450 + panelW; x += 3) {
          const env = gaussian(x, cx2, momVisualWidth);
          const y = midY - env * 95 * Math.sin((x - cx2) * 0.3 - time);
          if (x === 450) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Envelope fill
        ctx.beginPath();
        ctx.fillStyle = 'rgba(199, 146, 234, 0.2)';
        for (let x = 450; x <= 450 + panelW; x += 3) {
          const env = gaussian(x, cx2, momVisualWidth);
          ctx.lineTo(x, midY - env * 95);
        }
        for (let x = 450 + panelW; x >= 450; x -= 3) {
          const env = gaussian(x, cx2, momVisualWidth);
          ctx.lineTo(x, midY + env * 95);
        }
        ctx.closePath();
        ctx.fill();
        clearGlow(ctx);

        // Δp Uncertainty Bar Indicator
        ctx.strokeStyle = '#FFD166';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(cx2 - momVisualWidth, midY + 110);
        ctx.lineTo(cx2 + momVisualWidth, midY + 110);
        ctx.moveTo(cx2 - momVisualWidth, midY + 104);
        ctx.lineTo(cx2 - momVisualWidth, midY + 116);
        ctx.moveTo(cx2 + momVisualWidth, midY + 104);
        ctx.lineTo(cx2 + momVisualWidth, midY + 116);
        ctx.stroke();

        ctx.fillStyle = '#FFD166';
        ctx.font = '10px JetBrains Mono';
        ctx.fillText('2Δp', cx2 - 10, midY + 125);

        // ══════════════════════════════════════════════════════════════
        // SECTION 3: QUANTUM FLOOR BAR (Bottom: Y = 325)
        // ══════════════════════════════════════════════════════════════
        ctx.fillStyle = '#8B90A8';
        ctx.font = '10px JetBrains Mono';
        ctx.fillText('QUANTUM LIMIT FLOOR: Δx · Δp ≥ ℏ / 2', 30, 335);

        // Limit gauge bar
        ctx.fillStyle = '#262B3D';
        ctx.fillRect(30, 345, width - 60, 14);

        // Hard Floor line at hbar/2
        ctx.fillStyle = '#FF6B7A';
        ctx.fillRect(30, 345, (width - 60) * 0.5, 14);

        // Active Product indicator
        const markerX = 30 + (width - 60) * 0.5;
        setGlow(ctx, '#FFD166', 10);
        ctx.fillStyle = '#FFD166';
        ctx.fillRect(markerX - 3, 340, 6, 24);
        clearGlow(ctx);

        ctx.fillStyle = '#FFD166';
        ctx.font = 'bold 10px JetBrains Mono';
        ctx.fillText('Product = ℏ/2 (Minimum Uncertainty Bound)', markerX + 12, 356);
      }
    });

    engine.start();
    engineRef.current = engine;

    return () => {
      engine.destroy();
    };
  }, []);

  const triggerFloorFlash = () => {
    if (engineRef.current) {
      engineRef.current.flashes.spawn(430, 190);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-[22px] font-bold text-[var(--color-text)] mb-1">
          06. Heisenberg Uncertainty Principle
        </h2>
        <p className="text-[14px] text-[var(--color-text)]/70 max-w-[700px]">
          Position ψ(x) and momentum φ(p) form a Fourier transform pair. Squeezing the particle's spatial position uncertainty Δx forces its momentum uncertainty Δp to widen uncontrollably: Δx · Δp ≥ ℏ/2.
        </p>
      </div>

      <div className="w-full bg-[#12151F] border border-[var(--color-border)] rounded-[12px] overflow-hidden relative shadow-inner">
        <canvas ref={canvasRef} className="block w-full" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px]">
        <div className="flex items-center gap-3">
          <button
            onClick={triggerFloorFlash}
            className="px-5 py-2 bg-[var(--color-action)] text-white rounded-full text-[13px] font-semibold hover:bg-[var(--color-accent-deep)] transition-all cursor-pointer border-none shadow-sm"
          >
            Probe Quantum Floor (Pulse)
          </button>
        </div>

        <div className="flex items-center gap-3 text-[13px] font-medium text-[var(--color-text)]/80">
          <span>Spatial Squeeze Δx</span>
          <input
            type="range"
            min="12"
            max="75"
            value={deltaX}
            onChange={(e) => setDeltaX(Number(e.target.value))}
            className="w-36 accent-[var(--color-accent-deep)] cursor-pointer"
          />
          <span className="font-mono text-[12px] bg-white px-2 py-0.5 rounded border border-[var(--color-border)]">
            {deltaX} nm
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Position Spread Δx
          </span>
          <span className="font-mono text-[20px] font-bold text-[#7BE0D9]">
            ±{Math.round(deltaX)} nm
          </span>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Momentum Spread Δp
          </span>
          <span className="font-mono text-[20px] font-bold text-[#C792EA]">
            ±{Math.round(deltaP)} keV/c
          </span>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Product (Δx · Δp)
          </span>
          <span className="font-mono text-[20px] font-bold text-[#FFD166]">
            ≥ ℏ / 2 (Bound)
          </span>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Wave State
          </span>
          <span className="font-display text-[15px] font-semibold text-[var(--color-accent-deep)]">
            Gaussian Wave Packet
          </span>
        </div>
      </div>
    </div>
  );
}
