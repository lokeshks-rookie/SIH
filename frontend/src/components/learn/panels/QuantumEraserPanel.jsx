import React, { useState, useEffect, useRef } from 'react';
import { SimEngine, rand, clamp, setGlow, clearGlow } from '../simEngine';

export default function QuantumEraserPanel() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  const [erased, setErased] = useState(false); // Whether which-path is erased
  const [firing, setFiring] = useState(true);
  const [hitsCount, setHitsCount] = useState(0);

  const erasedRef = useRef(erased);
  erasedRef.current = erased;

  const firingRef = useRef(firing);
  firingRef.current = firing;

  // Stored particle hits with both possible tags (which-slit tag and interference phase tag)
  const recordsRef = useRef([]);

  const sourceX = 60;
  const slitX = 260;
  const prismX = 490; // Quantum eraser prism stage
  const screenX = 780;
  const slitGap = 65;

  useEffect(() => {
    if (!canvasRef.current) return;

    const H = 380;
    const cy = H / 2;
    let spawnTimer = 0;

    const engine = new SimEngine(canvasRef.current, {
      logicalWidth: 860,
      logicalHeight: 380,
      backgroundClear: 'rgba(18, 21, 31, 0.35)',
      onTick: ({ ctx, dt, width, height, flashes, particles }) => {
        // Particle Spawner
        if (firingRef.current) {
          spawnTimer += dt;
          if (spawnTimer >= 0.08) {
            spawnTimer = 0;
            const whichSlit = Math.random() < 0.5 ? -slitGap / 2 : slitGap / 2;

            // Compute both coordinates: clump Y and interference Y
            const clumpOffset = (whichSlit > 0 ? 45 : -45) + rand(-25, 25);
            const k = 16;
            let interOffset = 0;
            for (let t = 0; t < 200; t++) {
              const yCand = rand(-110, 110);
              const p = Math.exp(-Math.pow(yCand / 80, 2)) * Math.pow(Math.cos(yCand * 0.08), 2);
              if (Math.random() < p) {
                interOffset = yCand;
                break;
              }
            }

            particles.spawn({
              x: sourceX,
              y: cy,
              stage: 0,
              whichSlitY: cy + whichSlit,
              clumpY: cy + clumpOffset,
              interY: cy + interOffset,
              speed: 520
            });
          }
        }

        // 1. Static Apparatus: Double Slits
        ctx.fillStyle = '#2A2F42';
        ctx.fillRect(sourceX - 8, cy - 18, 16, 36);
        ctx.fillStyle = '#8B90A8';
        ctx.font = '10px JetBrains Mono';
        ctx.fillText('source', sourceX - 18, cy + 34);

        // Slits
        ctx.fillStyle = '#1E2333';
        ctx.fillRect(slitX - 4, 0, 8, cy - slitGap / 2 - 12);
        ctx.fillRect(slitX - 4, cy - slitGap / 2 + 12, 8, slitGap - 24);
        ctx.fillRect(slitX - 4, cy + slitGap / 2 + 12, 8, height - (cy + slitGap / 2 + 12));

        // 2. Quantum Eraser Stage (Placed AFTER the slits!)
        setGlow(ctx, erasedRef.current ? '#7BE0D9' : '#FF6B7A', 10);
        ctx.strokeStyle = erasedRef.current ? '#7BE0D9' : '#FF6B7A';
        ctx.lineWidth = 2;
        ctx.strokeRect(prismX - 18, cy - 65, 36, 130);
        ctx.fillStyle = 'rgba(24, 28, 41, 0.6)';
        ctx.fillRect(prismX - 18, cy - 65, 36, 130);
        clearGlow(ctx);

        ctx.fillStyle = erasedRef.current ? '#7BE0D9' : '#FF6B7A';
        ctx.font = 'bold 10px JetBrains Mono';
        ctx.fillText('DELAYED ERASER', prismX - 40, cy - 75);
        ctx.font = '9px JetBrains Mono';
        ctx.fillText(erasedRef.current ? '[PHASE ERASED]' : '[WHICH-PATH TAGGED]', prismX - 52, cy + 85);

        // Screen
        ctx.strokeStyle = '#3A4059';
        ctx.beginPath();
        ctx.moveTo(screenX, 10);
        ctx.lineTo(screenX, height - 10);
        ctx.stroke();

        // 3. Update Flying Particles
        particles.update(dt, (p) => {
          p.x += p.speed * dt;

          if (p.stage === 0) {
            const t = (p.x - sourceX) / (slitX - sourceX);
            p.y = cy + (p.whichSlitY - cy) * t;
            if (p.x >= slitX) p.stage = 1;
          } else if (p.stage === 1) {
            // Passing from slit to eraser stage
            p.y = p.whichSlitY;
            if (p.x >= prismX) p.stage = 2;
          } else {
            // From eraser stage to screen
            const targetY = erasedRef.current ? p.interY : p.clumpY;
            const t = (p.x - prismX) / (screenX - prismX);
            p.y = p.whichSlitY + (targetY - p.whichSlitY) * t;

            if (p.x >= screenX) {
              flashes.spawn(screenX, targetY);
              recordsRef.current.push({
                clumpY: p.clumpY,
                interY: p.interY
              });
              if (recordsRef.current.length > 220) recordsRef.current.shift();
              setHitsCount(c => c + 1);
              return false;
            }
          }
          return true;
        });

        // Draw particles with cyan glow
        setGlow(ctx, '#7BE0D9', 8);
        particles.draw(ctx, (context, p) => {
          context.beginPath();
          context.arc(p.x, p.y, 3, 0, Math.PI * 2);
          context.fillStyle = '#7BE0D9';
          context.fill();
        });
        clearGlow(ctx);

        // 4. Render Recorded Screen Hits (Retroactively sorted based on current eraser switch!)
        const isErasedNow = erasedRef.current;
        for (let i = 0; i < recordsRef.current.length; i++) {
          const hit = recordsRef.current[i];
          const y = isErasedNow ? hit.interY : hit.clumpY;
          ctx.beginPath();
          ctx.arc(screenX + 8 + (i % 20) * 3.5, y, 2.8, 0, Math.PI * 2);
          ctx.fillStyle = isErasedNow ? 'rgba(123, 224, 217, 0.75)' : 'rgba(255, 107, 122, 0.75)';
          ctx.fill();
        }
      }
    });

    engine.start();
    engineRef.current = engine;

    return () => {
      engine.destroy();
    };
  }, []);

  const toggleEraser = () => {
    setErased(!erased);
    if (engineRef.current) {
      engineRef.current.flashes.spawn(prismX, 190);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-[22px] font-bold text-[var(--color-text)] mb-1">
            09. Delayed Choice &amp; Quantum Eraser
          </h2>
          <p className="text-[14px] text-[var(--color-text)]/70 max-w-[680px]">
            The decision to measure or erase which-path information is made <b>after</b> the particle has already passed through the slits. Erasing the path retroactively restores interference in the recorded hits.
          </p>
        </div>

        <button
          onClick={toggleEraser}
          className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all cursor-pointer border shadow-sm ${
            erased
              ? 'bg-[#1E3A2B] text-white border-[#1E3A2B]'
              : 'bg-[#FF6B7A] text-white border-[#FF6B7A]'
          }`}
        >
          {erased ? 'Quantum Eraser: ACTIVE (Fringes Restored)' : 'Quantum Eraser: OFF (Which-Path Known)'}
        </button>
      </div>

      <div className="w-full bg-[#12151F] border border-[var(--color-border)] rounded-[12px] overflow-hidden relative shadow-inner">
        <canvas ref={canvasRef} className="block w-full" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFiring(!firing)}
            className="px-5 py-2 bg-[var(--color-action)] text-white rounded-full text-[13px] font-semibold hover:bg-[var(--color-accent-deep)] transition-all cursor-pointer border-none"
          >
            {firing ? 'Pause Photon Stream' : 'Resume Photon Stream'}
          </button>

          <button
            onClick={() => {
              recordsRef.current = [];
              setHitsCount(0);
            }}
            className="px-4 py-2 bg-white text-[var(--color-text)] border border-[var(--color-border)] rounded-full text-[13px] font-medium hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            Clear Screen Hits
          </button>
        </div>

        <span className="text-[13px] font-mono text-[var(--color-text)]/70">
          Delayed Choice Point: Post-Slit Optical Prism
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Photons Landed
          </span>
          <span className="font-mono text-[22px] font-bold text-[var(--color-text)]">
            {hitsCount}
          </span>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Path Information
          </span>
          <span className="font-display text-[16px] font-semibold text-[var(--color-accent-deep)]">
            {erased ? 'Completely Erased' : 'Retained (Which-Path)'}
          </span>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Screen Pattern
          </span>
          <span className="font-mono text-[16px] font-bold text-[#FFD166]">
            {erased ? 'Interference Fringes' : 'Two Classical Clumps'}
          </span>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Causal Implication
          </span>
          <span className="font-mono text-[13px] font-medium text-[var(--color-text)]/80">
            Wheeler's Delayed Choice
          </span>
        </div>
      </div>
    </div>
  );
}
