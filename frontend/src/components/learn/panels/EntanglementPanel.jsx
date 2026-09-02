import React, { useState, useEffect, useRef } from 'react';
import { SimEngine, setGlow, clearGlow } from '../simEngine';

export default function EntanglementPanel() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  const [angle, setAngle] = useState(0); // degrees for detector B
  const [distanceMode, setDistanceMode] = useState(false); // Stage 3: Drift to 10,000 km
  const [stats, setStats] = useState({ same: 0, opp: 0 });

  const angleRef = useRef(angle);
  angleRef.current = angle;

  const distanceModeRef = useRef(distanceMode);
  distanceModeRef.current = distanceMode;

  const lastARef = useRef(null);
  const lastBRef = useRef(null);
  const animTRef = useRef(0);
  const detBDistanceRef = useRef(250); // visual offset from center

  // Singlet correlation: P(same) = sin^2(θ / 2)
  const predictedMatch = (deg) => {
    const r = (deg * Math.PI) / 180;
    return Math.pow(Math.sin(r / 2), 2);
  };
  const pMatch = predictedMatch(angle);

  const measurePair = () => {
    const p = predictedMatch(angleRef.current);
    const a = Math.random() < 0.5 ? 1 : -1;
    const matched = Math.random() < p;
    const b = matched ? a : -a;

    if (matched) setStats(s => ({ ...s, same: s.same + 1 }));
    else setStats(s => ({ ...s, opp: s.opp + 1 }));

    lastARef.current = a;
    lastBRef.current = b;
    animTRef.current = 0.6; // duration in seconds

    if (engineRef.current) {
      const cx = 430;
      const cy = 190;
      const detAX = cx - 275;
      const detBX = cx + detBDistanceRef.current;
      // Simultaneous Amber Flash at both locations proving non-locality
      engineRef.current.flashes.spawn(detAX, cy);
      engineRef.current.flashes.spawn(detBX, cy);
    }
  };

  const handleBatch = () => {
    const p = predictedMatch(angleRef.current);
    let sameCount = 0;
    let oppCount = 0;
    for (let i = 0; i < 100; i++) {
      if (Math.random() < p) sameCount++;
      else oppCount++;
    }
    setStats(s => ({ same: s.same + sameCount, opp: s.opp + oppCount }));

    if (engineRef.current) {
      const cx = 430;
      const cy = 190;
      engineRef.current.flashes.spawn(cx - 275, cy);
      engineRef.current.flashes.spawn(cx + detBDistanceRef.current, cy);
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
        const cy = height / 2;

        // Animate Detector B distance drift
        const targetDist = distanceModeRef.current ? 360 : 250;
        detBDistanceRef.current += (targetDist - detBDistanceRef.current) * Math.min(dt * 4, 1);
        const curDetBDist = detBDistanceRef.current;

        // 1. Central EPR Entangled Source
        setGlow(ctx, '#7BE0D9', 14);
        ctx.fillStyle = '#2A2F42';
        ctx.beginPath();
        ctx.arc(cx, cy, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#7BE0D9';
        ctx.lineWidth = 2;
        ctx.stroke();
        clearGlow(ctx);

        ctx.fillStyle = '#8B90A8';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillText('EPR SOURCE', cx - 30, cy + 30);
        ctx.fillText('|Ψ⁻⟩ = (|01⟩ - |10⟩)/√2', cx - 58, cy + 45);

        // 2. Entanglement Quantum Link Line (pulsing aura)
        ctx.save();
        const pulse = 0.3 + Math.sin(Date.now() * 0.005) * 0.15;
        ctx.strokeStyle = `rgba(199, 146, 234, ${pulse})`;
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx - 275, cy);
        ctx.lineTo(cx + curDetBDist, cy);
        ctx.stroke();
        ctx.restore();

        // 3. Detectors
        // Detector A (Fixed 0°)
        ctx.strokeStyle = '#3A4059';
        ctx.lineWidth = 2;
        ctx.strokeRect(cx - 305, cy - 70, 60, 140);
        ctx.fillStyle = 'rgba(24, 28, 41, 0.5)';
        ctx.fillRect(cx - 305, cy - 70, 60, 140);
        ctx.fillStyle = '#7BE0D9';
        ctx.font = 'bold 11px JetBrains Mono, monospace';
        ctx.fillText('DETECTOR A', cx - 305, cy - 82);
        ctx.fillStyle = '#8B90A8';
        ctx.fillText('Basis: 0°', cx - 305, cy + 90);

        // Detector B (Rotatable & Drifting)
        ctx.strokeStyle = '#3A4059';
        ctx.lineWidth = 2;
        ctx.strokeRect(cx + curDetBDist - 30, cy - 70, 60, 140);
        ctx.fillStyle = 'rgba(24, 28, 41, 0.5)';
        ctx.fillRect(cx + curDetBDist - 30, cy - 70, 60, 140);
        ctx.fillStyle = '#C792EA';
        ctx.font = 'bold 11px JetBrains Mono, monospace';
        ctx.fillText('DETECTOR B', cx + curDetBDist - 30, cy - 82);
        ctx.fillStyle = '#8B90A8';
        ctx.fillText(`Angle: ${angleRef.current}°`, cx + curDetBDist - 30, cy + 90);

        // Distance Tag in Stage 3
        if (distanceModeRef.current) {
          ctx.save();
          setGlow(ctx, '#FFD166', 10);
          ctx.fillStyle = '#FFD166';
          ctx.font = 'bold 10px JetBrains Mono, monospace';
          ctx.fillText('✦ DISTANCE: 10,000 km (NO SIGNAL DELAY)', cx + curDetBDist - 70, cy - 98);
          clearGlow(ctx);
          ctx.restore();
        }

        // 4. Measurement Flash Animation
        if (animTRef.current > 0) {
          animTRef.current -= dt;
          const t = 1 - animTRef.current / 0.6;

          // Particle A
          setGlow(ctx, '#7BE0D9', 10);
          ctx.fillStyle = '#7BE0D9';
          ctx.beginPath();
          ctx.arc(cx - 275, cy - lastARef.current * 35 * t, 5, 0, Math.PI * 2);
          ctx.fill();

          // Particle B
          setGlow(ctx, '#C792EA', 10);
          ctx.fillStyle = '#C792EA';
          ctx.beginPath();
          ctx.arc(cx + curDetBDist, cy - lastBRef.current * 35 * t, 5, 0, Math.PI * 2);
          ctx.fill();
          clearGlow(ctx);

          // Outcome arrows
          ctx.font = 'bold 18px Sora, sans-serif';
          ctx.fillStyle = '#E8E6F0';
          ctx.fillText(lastARef.current === 1 ? '↑' : '↓', cx - 280, cy - 50);
          ctx.fillText(lastBRef.current === 1 ? '↑' : '↓', cx + curDetBDist - 5, cy - 50);
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
            04. Quantum Entanglement &amp; Bell Pairs
          </h2>
          <p className="text-[14px] text-[var(--color-text)]/70 max-w-[680px]">
            Entangled pairs exhibit instantaneous correlation regardless of spatial separation. Toggle distance to see Detector B separate across space with zero communication latency.
          </p>
        </div>

        {/* Stage 3 Enhancement: Deep Space Distance Toggle */}
        <button
          onClick={() => setDistanceMode(!distanceMode)}
          className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all cursor-pointer border ${
            distanceMode
              ? 'bg-[#1E3A2B] text-white border-[#1E3A2B]'
              : 'bg-white text-[var(--color-text)] border-[var(--color-border)] hover:border-[var(--color-text)]/40'
          }`}
        >
          {distanceMode ? 'Distance: 10,000 km (Active)' : 'Drift Detector B to Deep Space'}
        </button>
      </div>

      <div className="w-full bg-[#12151F] border border-[var(--color-border)] rounded-[12px] overflow-hidden relative shadow-inner">
        <canvas ref={canvasRef} className="block w-full" />
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px]">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={measurePair}
            className="px-6 py-2 bg-[var(--color-action)] text-white rounded-full text-[13px] font-semibold hover:bg-[var(--color-accent-deep)] transition-all cursor-pointer border-none shadow-sm active:scale-95"
          >
            Measure Pair (Instantaneous)
          </button>

          <button
            onClick={handleBatch}
            className="px-4 py-2 bg-white text-[var(--color-text)] border border-[var(--color-border)] rounded-full text-[13px] font-medium hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            Run 100 Pairs
          </button>

          <button
            onClick={() => setStats({ same: 0, opp: 0 })}
            className="px-4 py-2 rounded-full bg-transparent text-[var(--color-text)]/70 border border-[var(--color-border)] text-[13px] hover:text-[var(--color-text)] transition-colors cursor-pointer"
          >
            Reset Tally
          </button>
        </div>

        <div className="flex items-center gap-3 text-[13px] font-medium text-[var(--color-text)]/80">
          <span>Detector B Relative Angle</span>
          <input
            type="range"
            min="0"
            max="180"
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="w-28 accent-[var(--color-accent-deep)] cursor-pointer"
          />
          <span className="font-mono text-[12px] bg-white px-2 py-0.5 rounded border border-[var(--color-border)]">
            {angle}°
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Same Spin Outcome
          </span>
          <span className="font-mono text-[22px] font-bold text-[#FF6B7A]">
            {stats.same}
          </span>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Opposite Spin Outcome
          </span>
          <span className="font-mono text-[22px] font-bold text-[#7BE0D9]">
            {stats.opp}
          </span>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Predicted Match Rate
          </span>
          <span className="font-mono text-[20px] font-bold text-[#FFD166]">
            {Math.round(pMatch * 100)}% (sin² θ/2)
          </span>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[12px] p-4 flex flex-col justify-center">
          <span className="text-[12px] text-[var(--color-text)]/60 font-medium uppercase tracking-wider mb-1">
            Locality Verification
          </span>
          <span className="font-display text-[15px] font-semibold text-[var(--color-accent-deep)]">
            Instantaneous (No Delay)
          </span>
        </div>
      </div>
    </div>
  );
}
