import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, Line } from '@react-three/drei';

const IconRefresh = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

const IconClose = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

function BlochSphere({ vector }) {
  // vector is {x, y, z} representing the coordinates on the bloch sphere
  const vec = [vector.y, vector.z, vector.x]; // mapping standard Bloch (z-up) to Three.js (y-up usually, but we can just map it visually)
  return (
    <Canvas camera={{ position: [0, 0, 2.5] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls enableZoom={false} autoRotate={false} />
      
      {/* Wireframe sphere */}
      <Sphere args={[1, 32, 32]}>
        <meshBasicMaterial color="#E4EEE3" wireframe opacity={0.15} transparent />
      </Sphere>
      
      {/* Axes */}
      <Line points={[[-1.2, 0, 0], [1.2, 0, 0]]} color="#ffffff" opacity={0.2} transparent lineWidth={1} />
      <Line points={[[0, -1.2, 0], [0, 1.2, 0]]} color="#ffffff" opacity={0.2} transparent lineWidth={1} />
      <Line points={[[0, 0, -1.2], [0, 0, 1.2]]} color="#ffffff" opacity={0.2} transparent lineWidth={1} />
      
      {/* State Vector Arrow */}
      {vector && (
        <Line 
          points={[[0, 0, 0], [vector.y, vector.z, vector.x]]} 
          color="var(--color-accent-light)" 
          lineWidth={3} 
        />
      )}
      
      {/* Arrow Head */}
      {vector && (
        <mesh position={[vector.y, vector.z, vector.x]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color="var(--color-accent-light)" />
        </mesh>
      )}
    </Canvas>
  );
}

export default function ResultsPanel({ results, error, onReRun, onClose }) {
  const [showRaw, setShowRaw] = useState(false);
  const [showTheoretical, setShowTheoretical] = useState(false);

  if (error) {
    return (
      <div className="w-full bg-[var(--color-accent-deep)] rounded-[16px] p-6 text-white shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-[20px] font-semibold flex items-center gap-3">
            Simulation Error
          </h2>
          <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white cursor-pointer border-none transition-colors">
            <IconClose />
          </button>
        </div>
        <div className="bg-black/20 border border-[#ef4444]/30 rounded-[12px] p-5">
          <p className="text-[15px] text-[#ef4444] font-medium m-0">{error}</p>
        </div>
        <div className="mt-5">
          <button 
            onClick={onReRun}
            className="px-6 py-2 bg-white text-[var(--color-accent-deep)] rounded-full text-[14px] font-semibold border-none cursor-pointer hover:bg-white/90 transition-colors"
          >
            Retry Simulation
          </button>
        </div>
      </div>
    );
  }

  if (!results) return null;

  // Prepare chart data
  let chartData = [];
  if (results.hasMeasurement && results.counts && !showTheoretical) {
    const totalShots = Object.values(results.counts).reduce((a, b) => a + b, 0);
    chartData = Object.keys(results.counts).map(key => ({
      state: `|${key}⟩`,
      value: (results.counts[key] / totalShots) * 100
    }));
  } else {
    chartData = results.probabilities.map(p => ({
      state: p.basisState,
      value: p.probability * 100
    }));
  }

  return (
    <div className="w-full bg-[var(--color-accent-deep)] rounded-[16px] p-6 md:p-8 text-white shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-300">
      
      {/* HEADER ROW */}
      <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
        <div className="flex items-center gap-4">
          <h2 className="font-display text-[24px] font-semibold m-0">Results</h2>
          <span className="px-2.5 py-1 bg-[#1E3A2B] border border-[#2A523D] rounded-[6px] text-[11px] font-mono font-bold text-[#A7C8B5] uppercase tracking-wider">
            Ran on Qiskit Aer
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onReRun} className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white cursor-pointer transition-colors" title="Re-run Simulation">
            <IconRefresh />
          </button>
          <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white cursor-pointer transition-colors" title="Close Panel">
            <IconClose />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* MEASUREMENT PROBABILITIES */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-medium text-white/90">Probabilities</h3>
            {results.hasMeasurement && (
              <button 
                onClick={() => setShowTheoretical(!showTheoretical)}
                className="text-[12px] font-medium bg-black/20 hover:bg-black/40 border border-white/10 px-3 py-1.5 rounded-full text-white/80 cursor-pointer transition-colors"
              >
                {showTheoretical ? "Show Observed Counts" : "Show Theoretical"}
              </button>
            )}
          </div>
          <div className="bg-black/20 border border-white/5 rounded-[16px] p-5 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="state" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val.toFixed(0)}%`} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                  contentStyle={{ backgroundColor: '#161514', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontFamily: 'monospace' }}
                  formatter={(value) => [`${value.toFixed(2)}%`, 'Probability']}
                />
                <Bar dataKey="value" fill="#E4EEE3" stroke="var(--color-accent-deep)" strokeWidth={2} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* STATE VECTOR TABLE */}
        <div className="flex flex-col">
          <h3 className="text-[16px] font-medium text-white/90 mb-4">State Vector</h3>
          <div className="bg-black/20 border border-white/5 rounded-[16px] overflow-hidden flex-1 flex flex-col">
            <div className="grid grid-cols-3 gap-2 p-3 border-b border-white/10 bg-white/5 text-[12px] font-bold uppercase tracking-wider text-white/50">
              <div>Basis State</div>
              <div>Amplitude (a + bi)</div>
              <div>Probability</div>
            </div>
            <div className="overflow-y-auto max-h-[235px] p-2 custom-scrollbar">
              {results.stateVector.map((sv, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-2 p-2 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors font-mono text-[13px] items-center">
                  <div className="text-[var(--color-accent-light)] font-bold">{sv.basisState}</div>
                  <div className="text-white/80">
                    {sv.real > 0 && idx !== 0 ? '+' : ''}{sv.real.toFixed(3)} {sv.imag >= 0 ? '+' : '-'} {Math.abs(sv.imag).toFixed(3)}i
                  </div>
                  <div className="text-white/60">{(sv.amplitude ** 2 * 100).toFixed(1)}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* BLOCH SPHERES */}
      {results.blochVectors && results.blochVectors.length > 0 && (
        <div className="mb-8">
          <h3 className="text-[16px] font-medium text-white/90 mb-4">Bloch Spheres</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
            {results.blochVectors.map((bv, idx) => (
              <div key={idx} className="bg-black/20 border border-white/5 rounded-[16px] p-4 flex flex-col items-center shrink-0 w-[200px]">
                <div className="text-[13px] font-mono text-white/70 mb-2 font-bold bg-white/5 px-3 py-1 rounded-full">Qubit {bv.qubit}</div>
                <div className="w-[160px] h-[160px] cursor-move">
                  <BlochSphere vector={bv} />
                </div>
                <div className="flex gap-2 text-[10px] font-mono text-white/40 mt-3">
                  <span>X: {bv.x.toFixed(2)}</span>
                  <span>Y: {bv.y.toFixed(2)}</span>
                  <span>Z: {bv.z.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RAW JSON TOGGLE */}
      <div className="border-t border-white/10 pt-4">
        <button 
          onClick={() => setShowRaw(!showRaw)}
          className="text-[13px] font-medium text-white/50 hover:text-white bg-transparent border-none cursor-pointer transition-colors flex items-center gap-2"
        >
          {showRaw ? 'Hide' : 'View'} raw simulation output
        </button>
        
        {showRaw && (
          <div className="mt-4 p-4 bg-black/40 border border-white/10 rounded-[12px] overflow-auto max-h-[300px] custom-scrollbar">
            <pre className="text-[12px] font-mono text-[var(--color-accent-light)] m-0">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}
      </div>

    </div>
  );
}
