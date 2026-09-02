import React, { useState, useEffect, useRef } from 'react';
import { SimEngine, clamp, drawWavePacket, setGlow, clearGlow } from '../simEngine';

export default function TunnelingPanel() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  const [heightVal, setHeightVal] = useState(55);
  const [widthVal, setWidthVal] = useState(40);
  const [sunSkin, setSunSkin] = useState(false); // Stage 3: Sun's core fusion skin
  const [readout, setReadout] = useState({ t: 0, r: 0 });

  const heightValRef = useRef(heightVal);
  heightValRef.current = heightVal;

  const widthValRef = useRef(widthVal);
  widthValRef.current = widthVal;

  const sunSkinRef = useRef(sunSkin);
  sunSkinRef.current = sunSkin;

  // Wave Packet Simulation State
  const simStateRef = useRef({
    packetX: 80,
    launched: false,
    split: false,
    T: 0,
    R: 0,
    flashed: false,
  });

  const computeT = (v, l) => {
    const E = 40; // baseline packet energy
    if (v <= E) return 0.92;
    const kappa = Math.sqrt(Math.max(0.001, v - E)) * 0.09;
    const t = Math.exp(-2 * kappa * l);
    return clamp(t, 0.001, 0.98);
  };

  const handleLaunch = () => {
    const t = computeT(heightValRef.current, widthValRef.current);
    simStateRef.current = {
      packetX: 80,
      launched: true,
      split: false,
      T: t,
      R: 1 - t,
      flashed: false,
    };
    setReadout({ t, r: 1 - t });
  };

  useEffect(() => {
    setReadout({
      t: computeT(heightVal, widthVal),
      r: 1 - computeT(heightVal, widthVal)
    });
  }, [heightVal, widthVal]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new SimEngine(canvasRef.current, {
      logicalWidth: 860,
      logicalHeight: 380,
      backgroundClear: 'rgba(18, 21, 31, 0.35)',
      onTick: ({ ctx, dt, width, height, flashes }) => {
        const midY = height / 2;
        const bw = widthValRef.current;
        const bh = heightValRef.current;
        const bx0 = 450 - bw / 2;
        const bx1 = 450 + bw / 2;
        const isSun = sunSkinRef.current;

        // 1. Barrier Rendering (Standard vs Sun's Core Plasma Skin)
        if (isSun) {
          // Solar Coulomb Repulsion Barrier
          ctx.save();
          setGlow(ctx, '#FF6B7A', 25);
          ctx.fillStyle = 'rgba(255, 107, 70, 0.25)';
          ctx.fillRect(bx0, midY - 45 - bh * 0.9, bw, (45 + bh * 0.9) * 2);
          ctx.strokeStyle = '#FF6B7A';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(bx0, midY - 45 - bh * 0.9, bw, (45 + bh * 0.9) * 2);

          // Solar Flare / Proton Repulsion Graphics
          ctx.fillStyle = '#FFD166';
          ctx.font = 'bold 11px JetBrains Mono, monospace';
          ctx.fillText('COULOMB BARRIER (p⁺ + p⁺)', bx0 - 35, midY - 60 - bh * 0.9);
          ctx.font = '10px JetBrains Mono, monospace';
          ctx.fillStyle = '#FFA07A';
          ctx.fillText('Sun Core: p + p → ²H + e⁺ + ν_e', bx0 - 45, midY + 65 + bh * 0.9);
          clearGlow(ctx);
          ctx.restore();
        } else {
          // Standard Rectangular Potential Well Barrier
          ctx.fillStyle = 'rgba(255, 107, 122, 0.22)';
          ctx.fillRect(bx0, midY - 40 - bh * 0.9, bw, (40 + bh * 0.9) * 2);
          ctx.strokeStyle = '#FF6B7A';
          ctx.lineWidth = 1.6;
          ctx.strokeRect(bx0, midY - 40 - bh * 0.9, bw, (40 + bh * 0.9) * 2);

          ctx.fillStyle = '#FF6B7A';
          ctx.font = '11px JetBrains Mono, monospace';
          ctx.fillText('POTENTIAL BARRIER (V)', bx0 - 20, midY - 50 - bh * 0.9);
        }

        // Potential Zero Baseline
        ctx.strokeStyle = '#262B3D';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, midY);
        ctx.lineTo(width, midY);
        ctx.stroke();

        // 2. Wave Packet Propagation
        const sim = simStateRef.current;
        if (sim.launched) {
          const moveSpeed = 380 * dt;

          if (!sim.split) {
            sim.packetX += moveSpeed;
            drawWavePacket(ctx, {
              centerX: sim.packetX,
              amplitude: 1,
              midY,
              width,
              color: isSun ? '#FFD166' : '#7BE0D9'
            });

            if (sim.packetX >= bx0) {
              sim.split = true;
            }
          } else {
            // Split Wave Packets
            const reflX = 2 * bx0 - sim.packetX;
            const transX = bx1 + (sim.packetX - bx0);
            sim.packetX += moveSpeed;

            // Reflected component (moving backward, purple)
            if (Math.sqrt(sim.R) > 0.03) {
              drawWavePacket(ctx, {
                centerX: reflX,
                amplitude: Math.sqrt(sim.R),
                midY,
                width,
                color: '#C792EA'
              });
            }

            // Transmitted component (leaked through, amber/cyan)
            if (Math.sqrt(sim.T) > 0.03) {
              drawWavePacket(ctx, {
                centerX: transX,
                amplitude: Math.sqrt(sim.T),
                midY,
                width,
                color: isSun ? '#FFD166' : '#7BE0D9'
              });
            }

            // Trigger amber pulse at the exact moment of barrier penetration
            if (!sim.flashed) {
              flashes.spawn((bx0 + bx1) / 2, midY);
              sim.flashed = true;
            }

            if (transX > width + 70 && reflX < -70) {
              sim.launched = false;
            }
          }
        } else {
          ctx.fillStyle = '#6B7089';
          ctx.font = '12px JetBrains Mono, monospace';
          ctx.fillText('Press "Launch Quantum Packet" to observe wave penetration', 60, midY - 90);
        }
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
            05. Quantum Tunneling &amp; Evanescent Waves
          </h2>
          <p className="text-[14px] text-[var(--color-text)]/70 max-w-[680px]">
            A wave packet has a finite probability of traversing a barrier taller than its energy ($V &gt; E$). Toggle to view how tunneling enables nuclear fusion inside the Sun.
          </p>
        </div>

        {/* Stage 3 Enhancement: Sun's Core Skin Toggle */}
        <button
          onClick={() => setSunSkin(!sunSkin)}
          className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all cursor-pointer border ${
            sunSkin
              ? 'bg-[#FF6B7A] text-white border-[#FF6B7A] shadow-sm'
              : 'bg-white text-[var(--color-text)] border-[var(--color-border)] hover:border-[var(--color-text)]/40'
          }`}
        >
          {sunSkin ? "Sun's Core Fusion Mode (Active)" : "Switch to Sun's Core Mode"}
        </button>
      </div>

      <div className="w-full bg-[#12151F] border border-[var(--color-border)] rounded-[12px] overflow-hidden relative shadow-inner">
        <canvas ref={canvasRef} className="block w-full" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px]">
        <button
          onClick={handleLaunch}
          className="px-6 py-2 bg-[var(--color-action)] text-white rounded-full text-[13px] font-semibold hover:bg-[var(--color-accent-deep)] transition-all cursor-pointer border-none shadow-sm active:scale-95"
        >
          Launch Quantum Packet
        </button>

        <div className="flex flex-wrap items-center gap-6 text-[13px] font-medium text-[var(--color-text)]/80">
          <div className="flex items-center gap-2">
            <span>Barrier Height (V)</span>
            <input
              type="range"
              min="10"
              max="100"
              value={heightVal}
              onChange={(e) => setHeightVal(Number(e.target.value))}
              className="w-24 accent-[var(--color-accent-deep)] cursor-pointer"
            />
            <span className="font-mono text-[12px] bg-white px-2 py-0.5 rounded border border-[var(--color-border)]">
              {heightVal}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span>Barrier Width (L)</span>
            <input
              type="range"
              min="10"
              max="90"
              value={widthVal}
              onChange={(e) => setWidthVal(Number(e.target.value))}
              className="w-24 accent-[var(--color-accent-deep)] cursor-pointer"
            />
            <span className="font-mono text-[12px] bg-white px-2 py-0.5 rounded border border-[var(--color-border)]">
              {widthVal}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Transmission Prob (T)
          </span>
          <span className="font-mono text-[22px] font-bold text-[#FFD166]">
            {Math.round(readout.t * 100)}%
          </span>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Reflection Prob (R)
          </span>
          <span className="font-mono text-[22px] font-bold text-[#C792EA]">
            {Math.round(readout.r * 100)}%
          </span>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Analytical Formula
          </span>
          <span className="font-mono text-[14px] font-medium text-[var(--color-text)]/80">
            T ≈ exp(-2κL)
          </span>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Physics Application
          </span>
          <span className="font-display text-[15px] font-semibold text-[var(--color-accent-deep)]">
            {sunSkin ? 'Solar Proton-Proton Fusion' : 'STM & Flash Memory'}
          </span>
        </div>
      </div>
    </div>
  );
}
