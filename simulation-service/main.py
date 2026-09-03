from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Tuple

# Qiskit imports
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator
from qiskit.quantum_info import Statevector, partial_trace

app = FastAPI(title="Quantum Simulation Service (Qiskit Backend)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class GateInput(BaseModel):
    type: str
    qubit: int
    target: Optional[int] = None
    params: Optional[dict] = None

class CircuitInput(BaseModel):
    qubitCount: int = Field(..., gt=0, le=10) # Prevent massive memory usage
    gates: List[GateInput]
    shots: int = 1024

def build_circuit(n: int, gates: List[GateInput], include_measure: bool = True) -> Tuple[QuantumCircuit, bool]:
    qc = QuantumCircuit(n, n) if include_measure else QuantumCircuit(n)
    has_measure = False
    for g in gates:
        try:
            if g.type == "H":
                qc.h(g.qubit)
            elif g.type == "X":
                qc.x(g.qubit)
            elif g.type == "Y":
                qc.y(g.qubit)
            elif g.type == "Z":
                qc.z(g.qubit)
            elif g.type == "S":
                qc.s(g.qubit)
            elif g.type == "T":
                qc.t(g.qubit)
            elif g.type == "CNOT" or g.type == "CX":
                if g.target is None:
                    raise ValueError(f"Target qubit required for {g.type}")
                qc.cx(g.qubit, g.target)
            elif g.type == "CZ":
                if g.target is None:
                    raise ValueError(f"Target qubit required for CZ")
                qc.cz(g.qubit, g.target)
            elif g.type == "RX":
                angle = float(g.params.get("angle", 0.0)) if g.params else 0.0
                qc.rx(angle, g.qubit)
            elif g.type == "RY":
                angle = float(g.params.get("angle", 0.0)) if g.params else 0.0
                qc.ry(angle, g.qubit)
            elif g.type == "RZ":
                angle = float(g.params.get("angle", 0.0)) if g.params else 0.0
                qc.rz(angle, g.qubit)
            elif g.type == "MEASURE":
                if include_measure:
                    qc.measure(g.qubit, g.qubit)
                has_measure = True
            else:
                raise ValueError(f"Unsupported gate type: {g.type}")
        except Exception as e:
            raise ValueError(f"Invalid operation for gate {g.type} on qubit {g.qubit}: {str(e)}")
            
    return qc, has_measure

@app.post("/simulate")
def simulate(circuit_input: CircuitInput):
    n = circuit_input.qubitCount
    
    try:
        # Build the full circuit
        qc, has_measure = build_circuit(n, circuit_input.gates, include_measure=True)
        
        # Build a copy WITHOUT measurements for calculating theoretical Statevector & Bloch vectors
        qc_no_measure, _ = build_circuit(n, circuit_input.gates, include_measure=False)

        # 1. Theoretical Statevector
        state = Statevector.from_instruction(qc_no_measure)
        sv_data = state.data
        
        state_vector_out = []
        probabilities = []
        for i, amp in enumerate(sv_data):
            # Qiskit uses little-endian (q0 is rightmost bit), so we reverse the binary string to match standard textbook notation
            bin_str = format(i, f'0{n}b')[::-1]
            key = f"|{bin_str}⟩"
            prob = abs(amp) ** 2
            
            state_vector_out.append({
                "basisState": key,
                "real": round(amp.real, 6),
                "imag": round(amp.imag, 6),
                "amplitude": round(abs(amp), 6)
            })
            
            probabilities.append({
                "basisState": key,
                "probability": round(prob, 6)
            })

        # 2. Bloch Vectors via Partial Trace
        bloch_vectors = []
        for q in range(n):
            # Trace out all qubits EXCEPT q
            q_to_trace_out = [i for i in range(n) if i != q]
            try:
                # partial_trace handles empty lists correctly by returning the full density matrix
                rho = partial_trace(state, q_to_trace_out)
                
                # Get the 2x2 density matrix elements
                matrix = rho.data
                x = 2 * matrix[0][1].real
                y = 2 * matrix[1][0].imag
                z = (matrix[0][0] - matrix[1][1]).real
                
                bloch_vectors.append({
                    "qubit": q,
                    "x": round(float(x), 4),
                    "y": round(float(y), 4),
                    "z": round(float(z), 4)
                })
            except Exception:
                pass # Skip if tracing fails

        result = {
            "stateVector": state_vector_out,
            "probabilities": probabilities,
            "blochVectors": bloch_vectors,
            "hasMeasurement": has_measure,
            "counts": {}
        }

        # 3. Shot-based Measurement
        if has_measure:
            sim = AerSimulator()
            job = sim.run(qc, shots=circuit_input.shots)
            counts = job.result().get_counts()
            
            # Format counts (reverse endianness to match statevector)
            formatted_counts = {}
            for k, v in counts.items():
                reversed_k = k[::-1]
                formatted_counts[reversed_k] = v
            result["counts"] = formatted_counts

        return result
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Simulation error: {str(e)}")

@app.get("/health")
@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.get("/api/models")
def get_models():
    return {
        "models": [
            {"name": "qiskit-aer", "type": "quantum-simulator", "backends": ["AerSimulator", "Statevector"]},
            {"name": "statevector", "type": "theoretical-exact"}
        ]
    }
