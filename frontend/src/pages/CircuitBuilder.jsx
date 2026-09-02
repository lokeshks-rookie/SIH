import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, Line } from '@react-three/drei';
import {
  Play, Save, FolderOpen, Plus, Minus, Trash2, RotateCcw,
  Sparkles, ChevronDown, AlertCircle, Loader2, Monitor,
} from 'lucide-react';
import useCircuitStore, { GATE_DEFS, TEMPLATES } from '../stores/circuitStore';
import ResultsPanel from '../components/circuit/ResultsPanel';

/* ═══════════════════════════════════════════
   GATE NODE — custom React Flow node
   ═══════════════════════════════════════════ */
function GateNode({ data }) {
  const def = GATE_DEFS[data.gateType];
  const isSelected = data.isSelected;
  const is2Qubit = def?.qubits === 2;

  return (
    <div
      className={`
        flex items-center justify-center
        w-[44px] h-[44px] rounded-[8px]
        font-mono text-[16px] font-bold
        border-2 cursor-pointer select-none
        transition-all duration-150
        ${isSelected
          ? 'border-[var(--color-accent-deep)] shadow-[0_0_0_2px_var(--color-accent-light)]'
          : 'border-[var(--color-border)] hover:border-[var(--color-text)]/40'
        }
        ${data.gateType === 'MEASURE' ? 'bg-[var(--color-structural-dark)] text-white' : 'bg-white text-[var(--color-text)]'}
      `}
      onClick={() => data.onSelect?.(data.gateId)}
    >
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-[var(--color-border)] !border-none" />
      <span>{def?.label || '?'}</span>
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-[var(--color-border)] !border-none" />
      {is2Qubit && (
        <div className="absolute -bottom-[20px] left-1/2 -translate-x-1/2 w-[2px] h-[20px] bg-[var(--color-accent-deep)]" />
      )}
    </div>
  );
}

const nodeTypes = { gate: GateNode };

/* ═══════════════════════════════════════════
   BLOCH SPHERE 3D — react-three-fiber
   ═══════════════════════════════════════════ */
function BlochSphere3D({ vector = { x: 0, y: 0, z: 1 } }) {
  return (
    <Canvas camera={{ position: [2.5, 2, 2.5], fov: 40 }} style={{ width: '100%', height: '100%' }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls enableZoom={false} enablePan={false} />
      
      {/* Wireframe sphere */}
      <Sphere args={[1, 32, 32]}>
        <meshBasicMaterial wireframe color="#ffffff" opacity={0.15} transparent />
      </Sphere>
      
      {/* Axes */}
      <Line points={[[-1.3,0,0],[1.3,0,0]]} color="#ffffff" opacity={0.3} transparent lineWidth={1} />
      <Line points={[[0,-1.3,0],[0,1.3,0]]} color="#ffffff" opacity={0.3} transparent lineWidth={1} />
      <Line points={[[0,0,-1.3],[0,0,1.3]]} color="#ffffff" opacity={0.3} transparent lineWidth={1} />
      
      {/* State vector arrow */}
      <Line
        points={[[0,0,0], [vector.x, vector.y, vector.z]]}
        color="#E4EEE3"
        lineWidth={3}
      />
      
      {/* State point */}
      <mesh position={[vector.x, vector.y, vector.z]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#E4EEE3" emissive="#E4EEE3" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Poles */}
      <mesh position={[0, 0, 1]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#ffffff" opacity={0.5} transparent />
      </mesh>
      <mesh position={[0, 0, -1]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#ffffff" opacity={0.5} transparent />
      </mesh>
    </Canvas>
  );
}

/* ═══════════════════════════════════════════
   CIRCUIT BUILDER PAGE
   ═══════════════════════════════════════════ */
export default function CircuitBuilder() {
  const {
    circuitName, setCircuitName,
    qubitCount, setQubitCount,
    gates, addGate, removeGate, clearCircuit, loadTemplate,
    selectedGateId, selectGate,
    mode, setMode,
    codeStyle, setCodeStyle,
    results, clearResults,
    isRunning, error,
    runSimulation, toCode,
  } = useCircuitStore();

  const [showTemplates, setShowTemplates] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const [blochQubit, setBlochQubit] = useState(0);
  const templateRef = useRef(null);

  // Close template dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (templateRef.current && !templateRef.current.contains(e.target)) {
        setShowTemplates(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Check mobile
  useEffect(() => {
    if (window.innerWidth < 768) setShowMobileWarning(true);
  }, []);

  // ── Build React Flow nodes & edges from circuit state ──
  const { nodes, edges } = useMemo(() => {
    const CELL_W = 80;
    const CELL_H = 80;
    const OFFSET_X = 200;
    const OFFSET_Y = 60;
    const nodeList = [];
    const edgeList = [];

    // Qubit wire labels
    for (let q = 0; q < qubitCount; q++) {
      nodeList.push({
        id: `qubit-label-${q}`,
        type: 'default',
        position: { x: 20, y: OFFSET_Y + q * CELL_H + 8 },
        data: { label: `q${q}` },
        draggable: false,
        selectable: false,
        style: {
          background: 'transparent',
          border: 'none',
          fontFamily: 'var(--font-mono)',
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--color-text)',
          width: 40,
          padding: 0,
        },
      });
    }

    // Gate nodes
    const maxCol = gates.length > 0 ? Math.max(...gates.map(g => g.col)) + 1 : 0;
    for (const gate of gates) {
      nodeList.push({
        id: gate.id,
        type: 'gate',
        position: {
          x: OFFSET_X + gate.col * CELL_W,
          y: OFFSET_Y + gate.qubit * CELL_H,
        },
        data: {
          gateType: gate.type,
          gateId: gate.id,
          isSelected: gate.id === selectedGateId,
          onSelect: selectGate,
        },
        draggable: false,
      });

      // For two-qubit gates, add connector edge and target marker
      if (gate.target !== undefined) {
        const targetNodeId = `${gate.id}-target`;
        nodeList.push({
          id: targetNodeId,
          type: 'default',
          position: {
            x: OFFSET_X + gate.col * CELL_W + 8,
            y: OFFSET_Y + gate.target * CELL_H + 8,
          },
          data: { label: gate.type === 'CNOT' ? '⊕' : '●' },
          draggable: false,
          selectable: false,
          style: {
            width: 28,
            height: 28,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-accent-deep)',
            color: 'white',
            border: '2px solid var(--color-accent-deep)',
            fontSize: '16px',
            fontWeight: 700,
            padding: 0,
          },
        });

        edgeList.push({
          id: `edge-${gate.id}`,
          source: gate.id,
          target: targetNodeId,
          type: 'straight',
          style: { stroke: 'var(--color-accent-deep)', strokeWidth: 2 },
        });
      }
    }

    return { nodes: nodeList, edges: edgeList };
  }, [gates, qubitCount, selectedGateId, selectGate]);

  // ── Handle gate palette drag/drop ──
  const handleDropGate = useCallback((gateType) => {
    const def = GATE_DEFS[gateType];
    if (!def) return;
    if (def.qubits === 2) {
      if (qubitCount < 2) return;
      addGate(gateType, 0, 1);
    } else {
      addGate(gateType, 0);
    }
  }, [addGate, qubitCount]);

  // ── Result chart data ──
  const chartData = useMemo(() => {
    if (!results?.probabilities) return [];
    return Object.entries(results.probabilities)
      .map(([state, prob]) => ({ state: `|${state}⟩`, probability: prob }))
      .sort((a, b) => a.state.localeCompare(b.state));
  }, [results]);

  // ── Mobile warning ──
  if (showMobileWarning) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
        <Monitor className="w-12 h-12 text-[var(--color-text)]/30 mb-4" />
        <h2 className="font-display text-[24px] font-semibold mb-2">Circuit Builder works best on a larger screen</h2>
        <p className="text-[15px] text-[var(--color-text)]/70 max-w-md mb-6">
          The drag-and-drop circuit canvas needs desktop-level precision. Switch to a wider screen for the full experience.
        </p>
        <button
          onClick={() => setShowMobileWarning(false)}
          className="px-5 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-full text-[14px] font-medium cursor-pointer"
        >
          Continue anyway
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0 -mx-6 md:-mx-8 -mt-6 md:-mt-8 min-h-[calc(100vh-64px)]">

      {/* ═══ TOP TOOLBAR ═══ */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3 border-b border-[var(--color-border)] bg-[var(--color-base)]">
        
        {/* Left: Title */}
        <div className="flex items-center gap-3">
          <h1 className="font-display text-[18px] font-semibold text-[var(--color-text)] whitespace-nowrap">Circuit Builder</h1>
          <span className="text-[var(--color-text)]/30">·</span>
          <input
            type="text"
            value={circuitName}
            onChange={(e) => setCircuitName(e.target.value)}
            className="bg-transparent border-none outline-none text-[15px] font-medium text-[var(--color-text)]/80 w-[180px] focus:text-[var(--color-text)]"
          />
        </div>

        {/* Center: Mode Toggle */}
        <div className="flex items-center bg-[var(--color-card)] rounded-full border border-[var(--color-border)] p-0.5">
          <button
            onClick={() => setMode('visual')}
            className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all cursor-pointer border-none ${
              mode === 'visual'
                ? 'bg-[var(--color-action)] text-white'
                : 'bg-transparent text-[var(--color-text)]/70 hover:text-[var(--color-text)]'
            }`}
          >
            Visual
          </button>
          <button
            onClick={() => setMode('code')}
            className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all cursor-pointer border-none ${
              mode === 'code'
                ? 'bg-[var(--color-action)] text-white'
                : 'bg-transparent text-[var(--color-text)]/70 hover:text-[var(--color-text)]'
            }`}
          >
            Code
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold border border-[var(--color-border)] rounded-full bg-transparent text-[var(--color-text)] hover:bg-[var(--color-card)] transition-colors cursor-pointer">
            <Save size={14} /> Save
          </button>

          {/* Template Dropdown */}
          <div className="relative" ref={templateRef}>
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold border border-[var(--color-border)] rounded-full bg-transparent text-[var(--color-text)] hover:bg-[var(--color-card)] transition-colors cursor-pointer"
            >
              <FolderOpen size={14} /> Load Template <ChevronDown size={12} />
            </button>
            {showTemplates && (
              <div className="absolute right-0 top-full mt-2 w-[240px] bg-white border border-[var(--color-border)] rounded-[12px] shadow-lg z-50 py-2 overflow-hidden">
                {Object.entries(TEMPLATES).map(([key, tmpl]) => (
                  <button
                    key={key}
                    onClick={() => { loadTemplate(key); setShowTemplates(false); }}
                    className="w-full text-left px-4 py-2.5 text-[14px] font-medium text-[var(--color-text)] hover:bg-[var(--color-card)] transition-colors cursor-pointer border-none bg-transparent"
                  >
                    {tmpl.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={runSimulation}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-5 py-2 text-[13px] font-bold rounded-full bg-[var(--color-action)] text-white hover:bg-[var(--color-accent-deep)] transition-colors cursor-pointer border-none disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
          >
            {isRunning ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            {isRunning ? 'Running...' : 'Run'}
          </button>
        </div>
      </div>

      {/* ═══ ERROR BAR ═══ */}
      {error && (
        <div className="flex items-center gap-3 px-6 py-3 bg-[#FEF3F2] border-b border-[#FECDCA]">
          <AlertCircle size={16} className="text-[#D92D20] shrink-0" />
          <p className="text-[14px] font-medium text-[#D92D20]">{error}</p>
        </div>
      )}

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {mode === 'visual' ? (
          /* ── VISUAL MODE ── */
          <div className="flex-1 flex overflow-hidden">

            {/* Gate Palette */}
            <div className="w-[180px] shrink-0 border-r border-[var(--color-border)] bg-[var(--color-card)]/50 p-4 overflow-y-auto">
              <p className="text-[11px] font-bold text-[var(--color-text)]/50 uppercase tracking-widest mb-3">Gates</p>
              
              {/* Qubit controls */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--color-border)]">
                <span className="text-[12px] font-semibold text-[var(--color-text)]/70">Qubits: {qubitCount}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setQubitCount(qubitCount - 1)}
                    disabled={qubitCount <= 1}
                    className="w-6 h-6 rounded flex items-center justify-center border border-[var(--color-border)] bg-white text-[var(--color-text)] cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus size={12} />
                  </button>
                  <button
                    onClick={() => setQubitCount(qubitCount + 1)}
                    disabled={qubitCount >= 6}
                    className="w-6 h-6 rounded flex items-center justify-center border border-[var(--color-border)] bg-white text-[var(--color-text)] cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>

              {/* Gate buttons */}
              <div className="flex flex-col gap-1.5">
                {Object.entries(GATE_DEFS).map(([key, def]) => (
                  <button
                    key={key}
                    onClick={() => {
                      if (def.qubits === 2 && qubitCount < 2) return;
                      addGate(key, 0, def.qubits === 2 ? 1 : undefined);
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-[8px] bg-white border border-[var(--color-border)] hover:border-[var(--color-accent-deep)] hover:bg-[var(--color-accent-light)]/20 transition-all cursor-pointer group"
                    title={def.name}
                  >
                    <span className="w-[30px] h-[30px] rounded-[6px] bg-[var(--color-base)] border border-[var(--color-border)] flex items-center justify-center font-mono text-[14px] font-bold text-[var(--color-text)] group-hover:border-[var(--color-accent-deep)]/30 transition-colors shrink-0">
                      {def.label}
                    </span>
                    <div className="text-left">
                      <span className="text-[12px] font-medium text-[var(--color-text)]/80 block leading-tight">{def.name}</span>
                      {def.hasParams && <span className="text-[10px] text-[var(--color-text)]/50">{def.paramName}</span>}
                    </div>
                  </button>
                ))}
              </div>

              {/* Clear */}
              <button
                onClick={clearCircuit}
                disabled={gates.length === 0}
                className="flex items-center gap-2 w-full mt-4 px-3 py-2 rounded-[8px] bg-transparent border border-[var(--color-border)] text-[var(--color-text)]/60 text-[12px] font-semibold hover:bg-[#FEF3F2] hover:text-[#D92D20] hover:border-[#FECDCA] transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Trash2 size={12} /> Clear Circuit
              </button>
            </div>

            {/* Circuit Canvas */}
            <div className="flex-1 relative bg-white">
              {gates.length === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-card)] border border-[var(--color-border)] flex items-center justify-center mb-4">
                    <Plus size={24} className="text-[var(--color-text)]/30" />
                  </div>
                  <h3 className="text-[17px] font-semibold text-[var(--color-text)]/60 mb-1">Empty canvas</h3>
                  <p className="text-[14px] text-[var(--color-text)]/40 max-w-[260px]">
                    Click a gate from the palette to add it to the circuit, or load a template to get started.
                  </p>
                </div>
              ) : (
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  nodeTypes={nodeTypes}
                  fitView
                  fitViewOptions={{ padding: 0.3 }}
                  nodesDraggable={false}
                  nodesConnectable={false}
                  elementsSelectable={false}
                  panOnDrag
                  zoomOnScroll
                  minZoom={0.5}
                  maxZoom={2}
                  proOptions={{ hideAttribution: true }}
                >
                  <Background color="var(--color-border)" gap={20} size={1} />
                </ReactFlow>
              )}

              {/* Selected gate info bar */}
              {selectedGateId && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 bg-white border border-[var(--color-border)] rounded-full shadow-md z-10">
                  <span className="text-[13px] font-medium text-[var(--color-text)]">
                    {GATE_DEFS[gates.find(g => g.id === selectedGateId)?.type]?.name || 'Gate'}
                  </span>
                  <button
                    onClick={() => { removeGate(selectedGateId); }}
                    className="flex items-center gap-1 px-2 py-1 bg-[#FEF3F2] text-[#D92D20] rounded-full text-[12px] font-semibold border-none cursor-pointer"
                  >
                    <Trash2 size={11} /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ── CODE MODE ── */
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-2 border-b border-[var(--color-border)] bg-[var(--color-card)]/30">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-bold text-[var(--color-text)]/50 uppercase tracking-widest">Code View</span>
              </div>
              <select
                value={codeStyle}
                onChange={(e) => setCodeStyle(e.target.value)}
                className="bg-white border border-[var(--color-border)] rounded-[8px] px-3 py-1.5 text-[13px] font-medium text-[var(--color-text)] outline-none cursor-pointer"
              >
                <option value="qiskit">Qiskit</option>
                <option value="pennylane">PennyLane</option>
                <option value="cirq">Cirq</option>
              </select>
            </div>
            <div className="flex-1 overflow-auto bg-[#0D0D0D]">
              <CodeMirror
                value={toCode()}
                height="100%"
                theme="dark"
                extensions={[python()]}
                editable={false}
                basicSetup={{
                  lineNumbers: true,
                  foldGutter: false,
                }}
                style={{
                  fontSize: '14px',
                  fontFamily: 'var(--font-mono)',
                  minHeight: '400px',
                }}
              />
            </div>
          </div>
        )}

        {/* ═══ RESULTS PANEL ═══ */}
        {(results || error) && (
          <ResultsPanel 
            results={results} 
            error={error} 
            onReRun={runSimulation} 
            onClose={clearResults} 
          />
        )}
      </div>

      {/* ═══ AI TUTOR FAB ═══ */}
      <button
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[var(--color-accent-deep)] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer border-none z-30"
        title="Ask AI Tutor about this circuit"
      >
        <Sparkles size={20} />
      </button>

    </div>
  );
}
