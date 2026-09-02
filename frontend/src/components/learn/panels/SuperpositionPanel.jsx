import React, { useState, useEffect, useRef } from 'react';
import { SimEngine, setGlow, clearGlow } from '../simEngine';

export default function SuperpositionPanel() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  const [theta, setTheta] = useState(45); // degrees
  const [tally, setTally] = useState({ z: 0, o: 0 });
  const [collapsedState, setCollapsedState] = useState(null); // 0 or 1
  const [collapseCountdown, setCollapseCountdown] = useState(0);

  const thetaRef = useRef(theta);
  thetaRef.current = theta;

  const collapsedRef = useRef(collapsedState);
  collapsedRef.current = collapsedState;

  const timerRef = useRef(collapseCountdown);
  timerRef.current = collapseCountdown;

  // Qubit amplitudes: |ψ⟩ = cos(θ)|0⟩ + sin(θ)|1⟩
  const rad = (theta * Math.PI) / 180;
  const p0 = Math.cos(rad) * Math.cos(rad);
  const p1 = Math.sin(rad) * Math.sin(rad);

  const performMeasurement = (spawnPulse = true) => {
    const outcome = Math.random() < p0 ? 0 : 1;
    setTally(prev => ({
      z: prev.z + (outcome === 0 ? 1 : 0),
      o: prev.o + (outcome === 1 ? 1 : 0),
    }));
    setCollapsedState(outcome);
    setCollapseCountdown(1.2); // seconds

    if (spawnPulse && engineRef.current) {
      // Trigger signature amber flash at center and measurement target
      engineRef.current.flashes.spawn(320, outcome === 0 ? 110 : 270);
      engineRef.current.flashes.spawn(570, 190); // flash at Schrödinger's cat chamber
    }
    return outcome;
  };

  const handleBatch = () => {
    let zCount = 0;
    let oCount = 0;
    for (let i = 0; i < 200; i++) {
      if (Math.random() < p0) zCount++;
      else oCount++;
    }
    setTally(prev => ({ z: prev.z + zCount, o: prev.o + oCount }));
    if (engineRef.current) {
      engineRef.current.flashes.spawn(320, 190);
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    let blochRot = 0;

    const engine = new SimEngine(canvasRef.current, {
      logicalWidth: 860,
      logicalHeight: 380,
      backgroundClear: 'rgba(18, 21, 31, 0.35)',
      onTick: ({ ctx, dt, width, height, flashes }) => {
        blochRot += dt * 0.4;

        if (timerRef.current > 0) {
          timerRef.current -= dt;
          if (timerRef.current <= 0) {
            setCollapsedState(null);
          }
        }

        const currentTheta = (thetaRef.current * Math.PI) / 180;
        const curP0 = Math.cos(currentTheta) * Math.cos(currentTheta);
        const curP1 = 1 - curP0;

        const isColl = collapsedRef.current !== null;
        const effP0 = isColl ? (collapsedRef.current === 0 ? 1 : 0) : curP0;
        const effP1 = isColl ? (collapsedRef.current === 1 ? 1 : 0) : curP1;

        // ══════════════════════════════════════════════════════════════
        // SECTION 1: DUAL PROBABILITY BARS (Left Area: X = 60..360)
        // ══════════════════════════════════════════════════════════════
        const barX = 140;
        const barW = 120;
        const maxBarH = 110;

        // Title
        ctx.fillStyle = '#8B90A8';
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.fillText('STATE PROBABILITY', barX - 10, 32);

        // |0⟩ Bar (Top)
        setGlow(ctx, '#7BE0D9', 10 * effP0);
        ctx.fillStyle = 'rgba(123, 224, 217, 0.85)';
        const h0 = maxBarH * effP0;
        ctx.fillRect(barX, 150 - h0, barW, h0);
        clearGlow(ctx);
        ctx.strokeStyle = '#7BE0D9';
        ctx.strokeRect(barX, 40, barW, maxBarH);
        ctx.fillStyle = '#7BE0D9';
        ctx.font = 'bold 13px JetBrains Mono, monospace';
        ctx.fillText(`|0⟩  ${Math.round(effP0 * 100)}%`, barX, 168);

        // |1⟩ Bar (Bottom)
        setGlow(ctx, '#C792EA', 10 * effP1);
        ctx.fillStyle = 'rgba(199, 146, 234, 0.85)';
        const h1 = maxBarH * effP1;
        ctx.fillRect(barX, 200, barW, h1);
        clearGlow(ctx);
        ctx.strokeStyle = '#C792EA';
        ctx.strokeRect(barX, 200, barW, maxBarH);
        ctx.fillStyle = '#C792EA';
        ctx.font = 'bold 13px JetBrains Mono, monospace';
        ctx.fillText(`|1⟩  ${Math.round(effP1 * 100)}%`, barX, 330);

        // State Equation & Collapse Banner
        ctx.fillStyle = '#E8E6F0';
        ctx.font = '12px JetBrains Mono, monospace';
        ctx.fillText('|ψ⟩ = cos(θ)|0⟩ + sin(θ)|1⟩', barX - 25, 185);

        if (isColl) {
          ctx.save();
          setGlow(ctx, '#FFD166', 15);
          ctx.fillStyle = '#FFD166';
          ctx.font = 'bold 14px Sora, sans-serif';
          ctx.fillText(`COLLAPSED → |${collapsedRef.current}⟩`, barX - 10, 360);
          clearGlow(ctx);
          ctx.restore();
        }

        // ══════════════════════════════════════════════════════════════
        // SECTION 2: SCHRÖDINGER'S CAT CHAMBER (Middle Area: X = 450)
        // ══════════════════════════════════════════════════════════════
        const catX = 470;
        const catY = 190;
        const boxSize = 130;

        // Chamber Glass Box
        ctx.strokeStyle = '#3A4059';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(catX - boxSize / 2, catY - boxSize / 2, boxSize, boxSize);
        ctx.fillStyle = 'rgba(24, 28, 41, 0.6)';
        ctx.fillRect(catX - boxSize / 2, catY - boxSize / 2, boxSize, boxSize);

        ctx.fillStyle = '#8B90A8';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillText("SCHRÖDINGER'S CAT", catX - 52, catY - boxSize / 2 - 8);

        // Flicker effect for unmeasured state
        const flicker = isColl ? 1 : 0.85 + Math.sin(Date.now() * 0.008) * 0.15;
        const aliveAlpha = isColl ? (collapsedRef.current === 0 ? 1 : 0) : curP0 * flicker;
        const deadAlpha = isColl ? (collapsedRef.current === 1 ? 1 : 0) : curP1 * flicker;

        // Draw Alive Cat Silhouette (Cyan)
        if (aliveAlpha > 0.05) {
          ctx.save();
          ctx.globalAlpha = Math.min(1, aliveAlpha);
          setGlow(ctx, '#7BE0D9', 12);
          ctx.strokeStyle = '#7BE0D9';
          ctx.lineWidth = 2.5;

          // Head & Ears
          ctx.beginPath();
          ctx.arc(catX - 12, catY - 10, 18, 0, Math.PI * 2);
          ctx.stroke();
          // Ears
          ctx.beginPath();
          ctx.moveTo(catX - 25, catY - 20); ctx.lineTo(catX - 28, catY - 36); ctx.lineTo(catX - 14, catY - 26);
          ctx.moveTo(catX - 10, catY - 26); ctx.lineTo(catX + 4, catY - 36); ctx.lineTo(catX + 1, catY - 20);
          ctx.stroke();
          // Body & Alert Tail
          ctx.beginPath();
          ctx.ellipse(catX - 10, catY + 22, 22, 16, 0, 0, Math.PI * 2);
          ctx.moveTo(catX + 12, catY + 22); ctx.quadraticCurveTo(catX + 32, catY - 6, catX + 26, catY - 22);
          ctx.stroke();

          ctx.fillStyle = '#7BE0D9';
          ctx.font = 'bold 11px Sora, sans-serif';
          ctx.fillText('ALIVE |0⟩', catX - 25, catY + boxSize / 2 + 16);
          clearGlow(ctx);
          ctx.restore();
        }

        // Draw Dead Cat Silhouette (Ghost Violet)
        if (deadAlpha > 0.05) {
          ctx.save();
          ctx.globalAlpha = Math.min(1, deadAlpha);
          setGlow(ctx, '#C792EA', 12);
          ctx.strokeStyle = '#C792EA';
          ctx.lineWidth = 2;

          // Lying Down Silhouette
          ctx.beginPath();
          ctx.ellipse(catX, catY + 12, 34, 15, 0, 0, Math.PI * 2);
          ctx.stroke();
          // Head resting
          ctx.beginPath();
          ctx.arc(catX - 32, catY + 14, 14, 0, Math.PI * 2);
          ctx.stroke();
          // Crossed eyes (X X)
          ctx.beginPath();
          ctx.moveTo(catX - 38, catY + 8); ctx.lineTo(catX - 34, catY + 12);
          ctx.moveTo(catX - 34, catY + 8); ctx.lineTo(catX - 38, catY + 12);
          ctx.moveTo(catX - 30, catY + 8); ctx.lineTo(catX - 26, catY + 12);
          ctx.moveTo(catX - 26, catY + 8); ctx.lineTo(catX - 30, catY + 12);
          ctx.stroke();

          ctx.fillStyle = '#C792EA';
          ctx.font = 'bold 11px Sora, sans-serif';
          ctx.fillText('DECAYED |1⟩', catX - 32, catY + boxSize / 2 + 16);
          clearGlow(ctx);
          ctx.restore();
        }

        // ══════════════════════════════════════════════════════════════
        // SECTION 3: PSEUDO-3D BLOCH SPHERE (Right Area: X = 720)
        // ══════════════════════════════════════════════════════════════
        const sphereX = 720;
        const sphereY = 190;
        const radius = 68;

        ctx.fillStyle = '#8B90A8';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillText('PSEUDO-3D BLOCH SPHERE', sphereX - 65, 32);

        // Outer Sphere Circle
        ctx.beginPath();
        ctx.arc(sphereX, sphereY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#3A4059';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Equator Ellipse (rotated)
        ctx.beginPath();
        ctx.ellipse(sphereX, sphereY, radius, radius * 0.32, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(58, 64, 89, 0.7)';
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Z-Axis (|0⟩ at top, |1⟩ at bottom)
        ctx.beginPath();
        ctx.moveTo(sphereX, sphereY - radius - 14);
        ctx.lineTo(sphereX, sphereY + radius + 14);
        ctx.strokeStyle = '#6B7089';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#7BE0D9';
        ctx.font = 'bold 11px JetBrains Mono';
        ctx.fillText('|0⟩', sphereX - 7, sphereY - radius - 18);
        ctx.fillStyle = '#C792EA';
        ctx.fillText('|1⟩', sphereX - 7, sphereY + radius + 26);

        // State vector calculations (orthographic projection)
        // θ on Bloch sphere is 2 * theta of qubit
        const blochTheta = 2 * currentTheta;
        const blochPhi = blochRot; // slowly rotating around equator
        const vecX = radius * Math.sin(blochTheta) * Math.cos(blochPhi);
        const vecY = -radius * Math.cos(blochTheta); // -Z is up

        // Draw State Vector Arrow
        setGlow(ctx, '#FFD166', 12);
        ctx.beginPath();
        ctx.moveTo(sphereX, sphereY);
        ctx.lineTo(sphereX + vecX, sphereY + vecY);
        ctx.strokeStyle = '#FFD166';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Vector head point
        ctx.beginPath();
        ctx.arc(sphereX + vecX, sphereY + vecY, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        clearGlow(ctx);

        ctx.fillStyle = '#FFD166';
        ctx.font = '10px JetBrains Mono';
        ctx.fillText('|ψ⟩', sphereX + vecX + 8, sphereY + vecY - 4);
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
      <div>
        <h2 className="font-display text-[22px] font-bold text-[var(--color-text)] mb-1">
          02. Superposition &amp; Measurement
        </h2>
        <p className="text-[14px] text-[var(--color-text)]/70 max-w-[700px]">
          A qubit exists as a fluid probability mixture until observed. Includes the <b>Pseudo-3D Bloch Sphere</b> state vector and <b>Schrödinger's Cat</b> thought experiment that snaps into reality upon measurement.
        </p>
      </div>

      {/* Canvas */}
      <div className="w-full bg-[#12151F] border border-[var(--color-border)] rounded-[12px] overflow-hidden relative shadow-inner">
        <canvas ref={canvasRef} className="block w-full" />
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px]">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => performMeasurement(true)}
            className="px-6 py-2.5 bg-[var(--color-action)] text-white rounded-full text-[13px] font-semibold hover:bg-[var(--color-accent-deep)] transition-all cursor-pointer border-none shadow-sm active:scale-95"
          >
            Measure Once (Collapse)
          </button>

          <button
            onClick={handleBatch}
            className="px-4 py-2 bg-white text-[var(--color-text)] border border-[var(--color-border)] rounded-full text-[13px] font-medium hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            Run 200 Trials
          </button>

          <button
            onClick={() => setTally({ z: 0, o: 0 })}
            className="px-4 py-2 rounded-full bg-transparent text-[var(--color-text)]/70 border border-[var(--color-border)] text-[13px] hover:text-[var(--color-text)] transition-colors cursor-pointer"
          >
            Reset Tally
          </button>
        </div>

        {/* Theta Slider */}
        <div className="flex items-center gap-3 text-[13px] font-medium text-[var(--color-text)]/80">
          <span>Prepare Angle θ</span>
          <input
            type="range"
            min="0"
            max="90"
            value={theta}
            onChange={(e) => setTheta(Number(e.target.value))}
            className="w-28 accent-[var(--color-accent-deep)] cursor-pointer"
          />
          <span className="font-mono text-[12px] bg-white px-2 py-0.5 rounded border border-[var(--color-border)]">
            {theta}°
          </span>
        </div>
      </div>

      {/* Telemetry Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Prepared P(|0⟩)
          </span>
          <span className="font-mono text-[22px] font-bold text-[#7BE0D9]">
            {Math.round(p0 * 100)}%
          </span>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Prepared P(|1⟩)
          </span>
          <span className="font-mono text-[22px] font-bold text-[#C792EA]">
            {Math.round(p1 * 100)}%
          </span>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Measured Tally (0 / 1)
          </span>
          <span className="font-mono text-[20px] font-bold text-[var(--color-text)]">
            {tally.z} / {tally.o}
          </span>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Chamber Status
          </span>
          <span className="font-display text-[16px] font-semibold text-[var(--color-accent-deep)]">
            {collapsedState === null ? 'Superposition (Both)' : collapsedState === 0 ? 'Collapsed: Alive' : 'Collapsed: Decayed'}
          </span>
        </div>
      </div>
    </div>
  );
}
