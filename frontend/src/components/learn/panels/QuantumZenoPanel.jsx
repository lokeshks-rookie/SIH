import React, { useState, useEffect, useRef } from 'react';
import { SimEngine, clamp, setGlow, clearGlow } from '../simEngine';

export default function QuantumZenoPanel() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  const [activeLaser, setActiveLaser] = useState(false);
  const [pulseFreq, setPulseFreq] = useState(12); // pulses per second (Hz)
  const [decayProgress, setDecayProgress] = useState(0); // 0 to 1

  const activeLaserRef = useRef(activeLaser);
  activeLaserRef.current = activeLaser;

  const pulseFreqRef = useRef(pulseFreq);
  pulseFreqRef.current = pulseFreq;

  const decayRef = useRef(0);
  const pulseTimerRef = useRef(0);

  // Manual single observation pulse
  const triggerSingleObservation = () => {
    // Project state back towards ground state
    decayRef.current = Math.max(0, decayRef.current * 0.15);
    setDecayProgress(decayRef.current);
    if (engineRef.current) {
      engineRef.current.flashes.spawn(430, 180);
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new SimEngine(canvasRef.current, {
      logicalWidth: 860,
      logicalHeight: 380,
      backgroundClear: 'rgba(18, 21, 31, 0.35)',
      onTick: ({ ctx, dt, width, height, flashes }) => {
        const cx = width / 2;
        const cy = 175;

        // 1. Natural Decay Evolution: dP/dt
        // Unobserved state naturally evolves towards decayed state
        decayRef.current = clamp(decayRef.current + dt * 0.28, 0, 1);

        // 2. Periodic Quantum Zeno Laser Observation
        if (activeLaserRef.current) {
          pulseTimerRef.current += dt;
          const interval = 1 / pulseFreqRef.current;
          if (pulseTimerRef.current >= interval) {
            pulseTimerRef.current = 0;
            // High frequency measurement resets decay to ~0
            decayRef.current = clamp(decayRef.current * 0.18, 0, 1);
            flashes.spawn(cx, cy);
          }
        }

        const d = decayRef.current;
        setDecayProgress(d);

        // 3. Render Observation Laser Beam (Top to Center)
        if (activeLaserRef.current) {
          ctx.save();
          setGlow(ctx, '#FFD166', 20);
          ctx.strokeStyle = 'rgba(255, 209, 102, 0.85)';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(cx, 15);
          ctx.lineTo(cx, cy);
          ctx.stroke();

          // Laser Emitter Source
          ctx.fillStyle = '#FFD166';
          ctx.fillRect(cx - 25, 10, 50, 12);
          ctx.fillStyle = '#0A0C14';
          ctx.font = 'bold 9px JetBrains Mono';
          ctx.fillText('PROBE', cx - 14, 20);
          clearGlow(ctx);
          ctx.restore();
        }

        // 4. Render Morphing Quantum Particle in Chamber
        // Radius and color morph with decay 'd'
        const radius = 42 + Math.sin(Date.now() * 0.006) * (3 + d * 8);

        // Interpolate color from pristine Cyan (#7BE0D9) to Decayed Violet (#C792EA)
        ctx.save();
        const glowColor = d > 0.6 ? '#C792EA' : '#7BE0D9';
        setGlow(ctx, glowColor, 18);

        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fillStyle = d > 0.6 ? 'rgba(199, 146, 234, 0.85)' : 'rgba(123, 224, 217, 0.85)';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner orbital rings that destabilize upon decay
        const ringCount = 3;
        for (let i = 1; i <= ringCount; i++) {
          ctx.beginPath();
          ctx.ellipse(
            cx,
            cy,
            radius + i * 14 * (1 + d),
            (radius + i * 14) * (0.4 + (1 - d) * 0.3),
            Date.now() * 0.002 * i,
            0,
            Math.PI * 2
          );
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.45 * (1 - d)})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
        clearGlow(ctx);
        ctx.restore();

        // Particle State Label
        ctx.fillStyle = '#E8E6F0';
        ctx.font = 'bold 13px JetBrains Mono, monospace';
        const label = d < 0.25 ? 'UNSTABLE STATE |A⟩ (SURVIVING)' : d > 0.75 ? 'DECAYED GROUND STATE |B⟩' : 'EVOLVING SUPERPOSITION';
        ctx.fillText(label, cx - ctx.measureText(label).width / 2, cy + 90);

        // ══════════════════════════════════════════════════════════════
        // SECTION 5: DECAY ACCUMULATOR PROGRESS BAR (Bottom: Y = 310)
        // ══════════════════════════════════════════════════════════════
        const barW = width - 100;
        const barX = 50;

        ctx.fillStyle = '#8B90A8';
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.fillText(`CUMULATIVE DECAY EVOLUTION: ${Math.round(d * 100)}%`, barX, 305);
        if (activeLaserRef.current && pulseFreqRef.current >= 15) {
          ctx.fillStyle = '#FFD166';
          ctx.fillText('✦ QUANTUM ZENO EFFECT ACTIVE: EVOLUTION VISIBLY FROZEN', cx - 80, 305);
        }

        // Track
        ctx.fillStyle = '#262B3D';
        ctx.fillRect(barX, 318, barW, 16);

        // Progress
        ctx.fillStyle = d > 0.6 ? '#C792EA' : '#7BE0D9';
        ctx.fillRect(barX, 318, barW * d, 16);
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
          07. Quantum Zeno Effect ("A Watched Pot Never Boils")
        </h2>
        <p className="text-[14px] text-[var(--color-text)]/70 max-w-[700px]">
          An unstable quantum system evolves into decay over time. However, frequently measuring it repeatedly projects the wave function back onto the initial state, stalling evolution. At high frequencies, decay is completely frozen.
        </p>
      </div>

      <div className="w-full bg-[#12151F] border border-[var(--color-border)] rounded-[12px] overflow-hidden relative shadow-inner">
        <canvas ref={canvasRef} className="block w-full" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveLaser(!activeLaser)}
            className={`px-6 py-2 rounded-full text-[13px] font-semibold transition-all cursor-pointer border-none shadow-sm ${
              activeLaser
                ? 'bg-[#FFD166] text-black font-bold'
                : 'bg-[var(--color-action)] text-white hover:bg-[var(--color-accent-deep)]'
            }`}
          >
            {activeLaser ? 'Disable Continuous Observation' : 'Turn On Observation Laser'}
          </button>

          <button
            onClick={triggerSingleObservation}
            className="px-4 py-2 bg-white text-[var(--color-text)] border border-[var(--color-border)] rounded-full text-[13px] font-medium hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            Single Laser Pulse (Reset)
          </button>
        </div>

        <div className="flex items-center gap-3 text-[13px] font-medium text-[var(--color-text)]/80">
          <span>Observation Frequency</span>
          <input
            type="range"
            min="2"
            max="30"
            value={pulseFreq}
            onChange={(e) => setPulseFreq(Number(e.target.value))}
            className="w-28 accent-[var(--color-accent-deep)] cursor-pointer"
          />
          <span className="font-mono text-[12px] bg-white px-2 py-0.5 rounded border border-[var(--color-border)]">
            {pulseFreq} Hz
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            System State
          </span>
          <span className="font-display text-[17px] font-semibold text-[var(--color-accent-deep)]">
            {activeLaser && pulseFreq >= 12 ? 'Frozen in |A⟩' : decayProgress > 0.7 ? 'Decayed to |B⟩' : 'Decaying Naturally'}
          </span>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Survival Probability
          </span>
          <span className="font-mono text-[20px] font-bold text-[#7BE0D9]">
            {Math.round((1 - decayProgress) * 100)}%
          </span>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Measurement Pulse
          </span>
          <span className="font-mono text-[18px] font-bold text-[#FFD166]">
            {activeLaser ? `${pulseFreq} Flashes / sec` : 'Idle'}
          </span>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Mathematical Law
          </span>
          <span className="font-mono text-[13px] font-medium text-[var(--color-text)]/80">
            P(t) ≈ 1 - (γ·Δt)²
          </span>
        </div>
      </div>
    </div>
  );
}
