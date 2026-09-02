import { create } from 'zustand';

// Gate definitions with metadata
export const GATE_DEFS = {
  H:       { label: 'H',  name: 'Hadamard',     qubits: 1, hasParams: false, color: '#4A90D9' },
  X:       { label: 'X',  name: 'Pauli-X',      qubits: 1, hasParams: false, color: '#E74C3C' },
  Y:       { label: 'Y',  name: 'Pauli-Y',      qubits: 1, hasParams: false, color: '#2ECC71' },
  Z:       { label: 'Z',  name: 'Pauli-Z',      qubits: 1, hasParams: false, color: '#3498DB' },
  S:       { label: 'S',  name: 'S Gate',        qubits: 1, hasParams: false, color: '#9B59B6' },
  T:       { label: 'T',  name: 'T Gate',        qubits: 1, hasParams: false, color: '#E67E22' },
  RX:      { label: 'RX', name: 'Rotation X',    qubits: 1, hasParams: true,  paramName: 'θ', color: '#E74C3C' },
  RY:      { label: 'RY', name: 'Rotation Y',    qubits: 1, hasParams: true,  paramName: 'θ', color: '#2ECC71' },
  RZ:      { label: 'RZ', name: 'Rotation Z',    qubits: 1, hasParams: true,  paramName: 'θ', color: '#3498DB' },
  CNOT:    { label: 'CX', name: 'CNOT',          qubits: 2, hasParams: false, color: '#1E3A2B' },
  CZ:      { label: 'CZ', name: 'Controlled-Z',  qubits: 2, hasParams: false, color: '#1E3A2B' },
  MEASURE: { label: 'M',  name: 'Measurement',   qubits: 1, hasParams: false, color: '#161514' },
};

// Algorithm templates (for Playground and Circuit Builder)
export const TEMPLATES = {
  grover2: {
    name: "Grover's Search",
    difficulty: "Advanced",
    description: "Finds a marked item in an unstructured database quadratically faster. This template features the oracle and diffusion operator for a 2-qubit search.",
    qubitCount: 2,
    gates: [
      { id: 'g1', type: 'H', qubit: 0, col: 0 },
      { id: 'g2', type: 'H', qubit: 1, col: 0 },
      { id: 'g3', type: 'CZ', qubit: 0, target: 1, col: 1 },
      { id: 'g4', type: 'H', qubit: 0, col: 2 },
      { id: 'g5', type: 'H', qubit: 1, col: 2 },
      { id: 'g6', type: 'Z', qubit: 0, col: 3 },
      { id: 'g7', type: 'Z', qubit: 1, col: 3 },
      { id: 'g8', type: 'CZ', qubit: 0, target: 1, col: 4 },
      { id: 'g9', type: 'H', qubit: 0, col: 5 },
      { id: 'g10', type: 'H', qubit: 1, col: 5 },
      { id: 'g11', type: 'MEASURE', qubit: 0, col: 6 },
      { id: 'g12', type: 'MEASURE', qubit: 1, col: 6 },
    ],
  },
  deutschJozsa: {
    name: 'Deutsch-Jozsa Algorithm',
    difficulty: "Beginner",
    description: "Determines if a hidden function is constant or balanced with a single query, demonstrating quantum parallelism.",
    qubitCount: 2,
    gates: [
      { id: 'g1', type: 'X', qubit: 1, col: 0 },
      { id: 'g2', type: 'H', qubit: 0, col: 1 },
      { id: 'g3', type: 'H', qubit: 1, col: 1 },
      { id: 'g4', type: 'CNOT', qubit: 0, target: 1, col: 2 },
      { id: 'g5', type: 'H', qubit: 0, col: 3 },
      { id: 'g6', type: 'MEASURE', qubit: 0, col: 4 },
    ],
  },
  qft: {
    name: 'Quantum Fourier Transform',
    difficulty: "Advanced",
    description: "Transforms a quantum state to the frequency domain using a cascade of controlled rotations.",
    qubitCount: 3,
    gates: [
      { id: 'g1', type: 'H', qubit: 0, col: 0 },
      { id: 'g2', type: 'CZ', qubit: 1, target: 0, col: 1 }, // Simulating CP phase
      { id: 'g3', type: 'CZ', qubit: 2, target: 0, col: 2 },
      { id: 'g4', type: 'H', qubit: 1, col: 3 },
      { id: 'g5', type: 'CZ', qubit: 2, target: 1, col: 4 },
      { id: 'g6', type: 'H', qubit: 2, col: 5 },
    ],
  },
  shor: {
    name: "Shor's Algorithm (Demo)",
    difficulty: "Advanced",
    description: "A scoped-down teaching version showing the phase estimation subroutine of Shor's factoring algorithm.",
    qubitCount: 3,
    gates: [
      { id: 'g1', type: 'H', qubit: 0, col: 0 },
      { id: 'g2', type: 'H', qubit: 1, col: 0 },
      { id: 'g3', type: 'X', qubit: 2, col: 1 }, // Eigenstate
      { id: 'g4', type: 'CNOT', qubit: 1, target: 2, col: 2 }, // Controlled-U
      { id: 'g5', type: 'CNOT', qubit: 0, target: 2, col: 3 }, // Controlled-U^2
      { id: 'g6', type: 'H', qubit: 0, col: 4 }, // Inverse QFT start
      { id: 'g7', type: 'MEASURE', qubit: 0, col: 5 },
      { id: 'g8', type: 'MEASURE', qubit: 1, col: 5 },
    ],
  },
  teleportation: {
    name: 'Quantum Teleportation',
    difficulty: "Intermediate",
    description: "Transmits a qubit's exact quantum state from one location to another using entanglement and classical communication.",
    qubitCount: 3,
    gates: [
      { id: 'g1', type: 'H', qubit: 1, col: 0 },
      { id: 'g2', type: 'CNOT', qubit: 1, target: 2, col: 1 },
      { id: 'g3', type: 'CNOT', qubit: 0, target: 1, col: 2 },
      { id: 'g4', type: 'H', qubit: 0, col: 3 },
      { id: 'g5', type: 'MEASURE', qubit: 0, col: 4 },
      { id: 'g6', type: 'MEASURE', qubit: 1, col: 4 },
    ],
  },
  superDense: {
    name: 'Superdense Coding',
    difficulty: "Intermediate",
    description: "Transmits two classical bits of information using only a single qubit and an entangled pair.",
    qubitCount: 2,
    gates: [
      { id: 'g1', type: 'H', qubit: 0, col: 0 },
      { id: 'g2', type: 'CNOT', qubit: 0, target: 1, col: 1 },
      { id: 'g3', type: 'X', qubit: 0, col: 2 },
      { id: 'g4', type: 'Z', qubit: 0, col: 3 },
      { id: 'g5', type: 'CNOT', qubit: 0, target: 1, col: 4 },
      { id: 'g6', type: 'H', qubit: 0, col: 5 },
      { id: 'g7', type: 'MEASURE', qubit: 0, col: 6 },
      { id: 'g8', type: 'MEASURE', qubit: 1, col: 6 },
    ],
  },
  quantumWalks: {
    name: 'Quantum Walks',
    difficulty: "Intermediate",
    description: "A small step-based circuit representing a discrete quantum random walk on a short line.",
    qubitCount: 3,
    gates: [
      { id: 'g1', type: 'H', qubit: 0, col: 0 }, // Coin flip
      { id: 'g2', type: 'CNOT', qubit: 0, target: 1, col: 1 }, // Conditional shift
      { id: 'g3', type: 'X', qubit: 0, col: 2 },
      { id: 'g4', type: 'CNOT', qubit: 0, target: 2, col: 3 },
      { id: 'g5', type: 'X', qubit: 0, col: 4 },
      { id: 'g6', type: 'MEASURE', qubit: 1, col: 5 },
      { id: 'g7', type: 'MEASURE', qubit: 2, col: 5 },
    ],
  },
  bb84: {
    name: 'BB84 Key Distribution',
    difficulty: "Beginner",
    description: "Illustrative circuit showing basis choice and measurement for quantum cryptography.",
    qubitCount: 1,
    gates: [
      { id: 'g1', type: 'H', qubit: 0, col: 0 }, // Alice encodes in X basis
      { id: 'g2', type: 'H', qubit: 0, col: 1 }, // Bob measures in X basis
      { id: 'g3', type: 'MEASURE', qubit: 0, col: 2 },
    ],
  },
  qec: {
    name: 'Quantum Error Correction',
    difficulty: "Advanced",
    description: "A 3-qubit bit-flip code showing encoding, simulated noise, and syndrome correction.",
    qubitCount: 3,
    gates: [
      { id: 'g1', type: 'CNOT', qubit: 0, target: 1, col: 0 }, // Encode
      { id: 'g2', type: 'CNOT', qubit: 0, target: 2, col: 1 },
      { id: 'g3', type: 'X', qubit: 1, col: 2 }, // Simulated error on Q1
      { id: 'g4', type: 'CNOT', qubit: 0, target: 1, col: 3 }, // Decode
      { id: 'g5', type: 'CNOT', qubit: 0, target: 2, col: 4 },
      { id: 'g6', type: 'MEASURE', qubit: 0, col: 5 },
    ],
  },
  vqe: {
    name: 'VQE / QAOA Iteration',
    difficulty: "Advanced",
    description: "A minimal parameterized circuit representing one iteration of a hybrid quantum-classical loop.",
    qubitCount: 2,
    gates: [
      { id: 'g1', type: 'H', qubit: 0, col: 0 },
      { id: 'g2', type: 'H', qubit: 1, col: 0 },
      { id: 'g3', type: 'RY', qubit: 0, params: { angle: Math.PI / 4 }, col: 1 },
      { id: 'g4', type: 'RY', qubit: 1, params: { angle: Math.PI / 3 }, col: 1 },
      { id: 'g5', type: 'CNOT', qubit: 0, target: 1, col: 2 },
      { id: 'g6', type: 'RZ', qubit: 1, params: { angle: Math.PI / 2 }, col: 3 },
      { id: 'g7', type: 'CNOT', qubit: 0, target: 1, col: 4 },
      { id: 'g8', type: 'MEASURE', qubit: 0, col: 5 },
      { id: 'g9', type: 'MEASURE', qubit: 1, col: 5 },
    ],
  }
};

let _gateIdCounter = 100;

const useCircuitStore = create((set, get) => ({
  circuitName: 'Untitled Circuit',
  qubitCount: 2,
  gates: [],
  selectedGateId: null,
  results: null,
  isRunning: false,
  error: null,
  mode: 'visual', // 'visual' | 'code'
  codeStyle: 'qiskit', // 'qiskit' | 'pennylane' | 'cirq'

  setCircuitName: (name) => set({ circuitName: name }),
  setMode: (mode) => set({ mode }),
  setCodeStyle: (style) => set({ codeStyle: style }),
  selectGate: (id) => set({ selectedGateId: id }),
  clearResults: () => set({ results: null, error: null }),

  setQubitCount: (count) => {
    const clamped = Math.max(1, Math.min(6, count));
    set((state) => ({
      qubitCount: clamped,
      gates: state.gates.filter(g => {
        if (g.qubit >= clamped) return false;
        if (g.target !== undefined && g.target >= clamped) return false;
        return true;
      }),
    }));
  },

  addGate: (type, qubit, target, params) => {
    const id = `gate-${_gateIdCounter++}`;
    const state = get();
    // Find the next available column for this qubit
    const qubitGates = state.gates.filter(g => g.qubit === qubit || g.target === qubit);
    const maxCol = qubitGates.length > 0 ? Math.max(...qubitGates.map(g => g.col)) + 1 : 0;
    
    set((s) => ({
      gates: [...s.gates, { id, type, qubit, target, params, col: maxCol }],
      error: null,
    }));
  },

  removeGate: (id) => set((s) => ({
    gates: s.gates.filter(g => g.id !== id),
    selectedGateId: s.selectedGateId === id ? null : s.selectedGateId,
  })),

  clearCircuit: () => set({
    gates: [],
    selectedGateId: null,
    results: null,
    error: null,
  }),

  loadTemplate: (templateKey) => {
    const template = TEMPLATES[templateKey];
    if (!template) return;
    _gateIdCounter += 50;
    const gates = template.gates.map((g, i) => ({
      ...g,
      id: `gate-${_gateIdCounter + i}`,
    }));
    set({
      circuitName: `${template.name} — Copy`,
      qubitCount: template.qubitCount,
      gates,
      selectedGateId: null,
      results: null,
      error: null,
    });
  },

  // Generate Qiskit code from current circuit state
  toCode: () => {
    const { qubitCount, gates, codeStyle } = get();
    const sortedGates = [...gates].sort((a, b) => a.col - b.col || a.qubit - b.qubit);

    if (codeStyle === 'qiskit') {
      let code = `from qiskit import QuantumCircuit\n\n`;
      code += `qc = QuantumCircuit(${qubitCount}, ${qubitCount})\n\n`;
      for (const g of sortedGates) {
        switch (g.type) {
          case 'H': code += `qc.h(${g.qubit})\n`; break;
          case 'X': code += `qc.x(${g.qubit})\n`; break;
          case 'Y': code += `qc.y(${g.qubit})\n`; break;
          case 'Z': code += `qc.z(${g.qubit})\n`; break;
          case 'S': code += `qc.s(${g.qubit})\n`; break;
          case 'T': code += `qc.t(${g.qubit})\n`; break;
          case 'RX': code += `qc.rx(${g.params?.angle ?? 'pi/2'}, ${g.qubit})\n`; break;
          case 'RY': code += `qc.ry(${g.params?.angle ?? 'pi/2'}, ${g.qubit})\n`; break;
          case 'RZ': code += `qc.rz(${g.params?.angle ?? 'pi/2'}, ${g.qubit})\n`; break;
          case 'CNOT': code += `qc.cx(${g.qubit}, ${g.target})\n`; break;
          case 'CZ': code += `qc.cz(${g.qubit}, ${g.target})\n`; break;
          case 'MEASURE': code += `qc.measure(${g.qubit}, ${g.qubit})\n`; break;
        }
      }
      return code;
    }

    if (codeStyle === 'pennylane') {
      let code = `import pennylane as qml\n\n`;
      code += `dev = qml.device("default.qubit", wires=${qubitCount})\n\n`;
      code += `@qml.qnode(dev)\ndef circuit():\n`;
      for (const g of sortedGates) {
        switch (g.type) {
          case 'H': code += `    qml.Hadamard(wires=${g.qubit})\n`; break;
          case 'X': code += `    qml.PauliX(wires=${g.qubit})\n`; break;
          case 'Y': code += `    qml.PauliY(wires=${g.qubit})\n`; break;
          case 'Z': code += `    qml.PauliZ(wires=${g.qubit})\n`; break;
          case 'S': code += `    qml.S(wires=${g.qubit})\n`; break;
          case 'T': code += `    qml.T(wires=${g.qubit})\n`; break;
          case 'CNOT': code += `    qml.CNOT(wires=[${g.qubit}, ${g.target}])\n`; break;
          case 'CZ': code += `    qml.CZ(wires=[${g.qubit}, ${g.target}])\n`; break;
          case 'MEASURE': break; // PennyLane uses return statement
        }
      }
      code += `    return qml.probs(wires=range(${qubitCount}))\n`;
      return code;
    }

    if (codeStyle === 'cirq') {
      let code = `import cirq\n\n`;
      code += `qubits = cirq.LineQubit.range(${qubitCount})\ncircuit = cirq.Circuit()\n\n`;
      for (const g of sortedGates) {
        switch (g.type) {
          case 'H': code += `circuit.append(cirq.H(qubits[${g.qubit}]))\n`; break;
          case 'X': code += `circuit.append(cirq.X(qubits[${g.qubit}]))\n`; break;
          case 'Y': code += `circuit.append(cirq.Y(qubits[${g.qubit}]))\n`; break;
          case 'Z': code += `circuit.append(cirq.Z(qubits[${g.qubit}]))\n`; break;
          case 'S': code += `circuit.append(cirq.S(qubits[${g.qubit}]))\n`; break;
          case 'T': code += `circuit.append(cirq.T(qubits[${g.qubit}]))\n`; break;
          case 'CNOT': code += `circuit.append(cirq.CNOT(qubits[${g.qubit}], qubits[${g.target}]))\n`; break;
          case 'CZ': code += `circuit.append(cirq.CZ(qubits[${g.qubit}], qubits[${g.target}]))\n`; break;
          case 'MEASURE': code += `circuit.append(cirq.measure(qubits[${g.qubit}], key='q${g.qubit}'))\n`; break;
        }
      }
      return code;
    }

    return '';
  },

  // Circuit JSON for the simulation endpoint
  toCircuitJSON: () => {
    const { qubitCount, gates } = get();
    const sortedGates = [...gates].sort((a, b) => a.col - b.col || a.qubit - b.qubit);
    return {
      qubitCount,
      gates: sortedGates.map(g => ({
        type: g.type,
        qubit: g.qubit,
        ...(g.target !== undefined && { target: g.target }),
        ...(g.params && { params: g.params }),
      })),
    };
  },

  // Run simulation
  runSimulation: async () => {
    const state = get();
    // The requirement states to only warn if there's no measurement gate for the frontend UI.
    // The backend now safely handles no-measurement states via Statevector.
    if (state.gates.length === 0) {
      set({ error: 'Circuit is empty — drag gates onto the canvas first.' });
      return;
    }

    set({ isRunning: true, error: null, results: null });
    try {
      const circuitJSON = state.toCircuitJSON();
      // Import axios if needed, but fetch works just fine
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/circuits/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(circuitJSON),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        set({ error: data.detail || data.error || 'Simulation service error', isRunning: false });
        return;
      }
      
      set({ results: data, isRunning: false });
    } catch (err) {
      set({ error: 'Failed to connect to the simulation proxy. Ensure the backend is running.', isRunning: false });
    }
  },
}));

export default useCircuitStore;
