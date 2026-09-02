# AI-Based Interactive Quantum Algorithm Learning Platform

**Smart India Hackathon — Problem Statement ID 26140**
Organization: Egreen Quanta | Category: Software | Theme: Smart Education

This document is the single source of truth for the project. Read this in full before generating any code, page, or component.

---

## 1. Problem Statement

Quantum computing education is held back by abstract concepts (qubits, superposition, entanglement, algorithms) taught through static, theory-heavy material with no hands-on interaction, and by limited access to real quantum hardware. This platform solves that by combining structured theory, visual circuit design, real-time simulation, and AI-guided tutoring in one integrated web app.

**Core objectives:**
- Interactive web platform for learning quantum computing and quantum algorithms
- Graphical (drag-and-drop) AND code-based circuit design
- Real-time execution/simulation across multiple backends (Qiskit Aer, PennyLane, Cirq, qBraid)
- AI-assisted tutoring: concept explanation, code generation, debugging, personalized learning paths
- Visualization: quantum states, Bloch spheres, measurement probabilities, execution results
- Assessment modules, coding challenges, progress tracking, instructor dashboards

**What we are building for the prototype:** the full platform (all pages below), not a cut-down MVP — student is building this in a single focused day using Google Antigravity for agentic, task-level development rather than manual line-by-line coding.

---

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React (Vite) + TailwindCSS | Team's existing MERN experience; fast iteration |
| Circuit builder UI | React Flow | Node/edge graph library — a quantum circuit is a natural node/edge model (qubits as rows, gates as draggable nodes); avoids building drag-and-drop from scratch |
| Charts | Recharts / Chart.js | Measurement probability bars, amplitude visualizations |
| 3D | react-three-fiber (Three.js) | Bloch sphere with rotating state vector |
| Main backend | Node.js + Express | Auth, user accounts, saved circuits, lesson content CRUD, progress tracking, quiz logic — everything that doesn't need Python |
| Simulation microservice | Python + FastAPI | The one required Python service. Receives a circuit definition (JSON: gates, qubits, order), runs it on Qiskit Aer (primary backend for prototype; PennyLane/Cirq as stretch goals), returns state vector + measurement probabilities. Isolated as its own small service so only the "Run" button depends on unfamiliar territory. |
| Database | MongoDB (Atlas) | Circuits, lesson content, and quiz questions are naturally document-shaped JSON; team has existing Mongoose fluency |
| Auth | Firebase Auth | Fastest path to working login/signup (email/password + Google) without hand-rolling JWT flows |
| AI Tutor | Claude or Gemini API, called from Express backend | Grounded on the 17-concept content JSON (Section 4) fed as context — no vector DB needed at this content scale |
| Deployment | Frontend → Vercel · Express API → Render/Railway · FastAPI sim service → Render/Railway · DB → MongoDB Atlas free tier | Fast, zero-cost-tier deploys for a hackathon prototype |

**Why not pure Python (FastAPI + React, no Express)?** Cleaner architecturally, but would force the whole non-simulation surface (auth, CRUD, dashboards) into an unfamiliar framework on a single build day. Instead: MERN stays the workhorse; FastAPI + Qiskit Aer is a small bolted-on simulation service — isolates the one genuinely new tool to the smallest possible surface area.

---

## 3. Design System

**All visual design MUST follow `SIH_brand_guidelines.md`** (color palette, typography, iconography, spacing, component shapes, layout rhythm). Every page prompt in this project will explicitly reference that file. Motion/transitions are not covered by the guidelines file and are left to tasteful implementation judgment per page.

Quick reference (full detail in the guidelines file):
- Background: warm off-white `#F8F6F0`; text: near-black `#161514`
- Single accent: forest green `#1E3A2B`, used sparingly (one meaningful element per screen)
- Type: serif display (headlines) + sans body (UI/copy) + monospace (equations, code, gate notation)
- Icons: thin-line, 1.5px stroke, Lucide/Phosphor Light
- Components: pill buttons, 12–16px card radius, no drop shadows, flat surfaces
- Layout rhythm: mostly light background, one dark (green or charcoal) anchor per page

---

## 4. Content Library — 17 Core Concepts

Sourced from the project's study guide (animation series). This is the curriculum backbone powering the Learning Modules, Concept Detail pages, AI tutor grounding, and Assessment question generation. Each concept has: what it teaches, the interactive visualization it needs, and its key equation.

### Part 1 — Foundational Phenomena

1. **Double-slit experiment** — wave-particle duality. Viz: particles accumulating into an interference pattern, with a which-path detector toggle that collapses it to two bands. `P(x) ∝ cos²(πdx/λL)`
2. **Superposition & measurement** — a qubit as a weighted mix of |0⟩ and |1⟩ until measured. Viz: two probability bars + a MEASURE action that collapses them randomly per the probabilities. `|ψ⟩ = α|0⟩ + β|1⟩, P(0)=|α|², P(1)=|β|²`
3. **Stern–Gerlach experiment** — spin is discrete, not continuous. Viz: particles deflecting into two sharp bands vs. a faint "classical expectation" cloud. `Sz = ±ℏ/2`
4. **Entanglement** — correlated outcomes with no signal passing between particles. Viz: synced-flash two-detector demo with an angle slider tracking live match-rate against the predicted curve. `P(same) = sin²(θ/2)`
5. **Quantum tunneling** — nonzero probability of passing a classically-forbidden barrier. Viz: wave packet splitting into reflected/transmitted components; barrier height/width sliders. `T ≈ exp(−2κL)`
6. **Quantum Zeno effect** — frequent measurement freezes evolution. Viz: probability bar drifting toward another state, snapped back by a measurement-frequency slider. `P_survival → 1 as dt → 0`
7. **Delayed-choice quantum eraser** — interference pattern depends on a later choice about entangled-partner path information. Viz: build last, only after 1/2/4 feel intuitive.

### Part 2 — Quantum Algorithms

8. **Deutsch–Jozsa algorithm** — first proven quantum speedup; determines constant vs. balanced with one query. Viz: superposition + single oracle query + interference sort, vs. many classical queries side by side.
9. **Grover's search algorithm** — √N search via amplitude amplification. Viz: amplitude bar chart, oracle flip + diffusion reflection steps, marked bar visibly growing each round. `Iterations ≈ (π/4)√N` — **primary demo target for the Circuit Builder** (small, well-known circuit).
10. **Quantum Fourier Transform (QFT)** — amplitude pattern → frequency components; core of Shor's algorithm. Viz: spinning phase wheels per qubit, controlled rotations, redistributed amplitude.
11. **Shor's algorithm** — exponential factoring via period-finding + QFT. Viz: periodic signal from modular exponentiation, QFT spikes at the hidden period.
12. **Quantum teleportation** — moves a state via entanglement + 2 classical bits, no physical transmission. Viz: Bell measurement → classical bits → Bob's qubit snaps to original state (visible delay, no faster-than-light implication).
13. **Superdense coding** — 2 classical bits sent via 1 transmitted qubit. Viz: gate choice (I/X/Z/XZ) based on 2 bits, joint measurement recovers both.
14. **Quantum walks** — quadratically faster spreading than classical random walk. Viz: two race histograms, classical (√t width) vs. quantum (linear-t width, two-humped).
15. **BB84 quantum key distribution** — provably secure key exchange; eavesdropping is detectable. Viz: random-basis photon send/measure, eavesdropper insertion spikes the error rate.
16. **Quantum error correction** — protecting fragile qubits via redundancy + syndrome measurement. Viz: 3-qubit bit-flip code, simulated noise, syndrome-based correction without direct readout.
17. **VQE & QAOA** — hybrid quantum/classical optimization loop. Viz: energy-landscape curve, ball rolling downhill as the classical optimizer nudges circuit parameters.

**Note:** Bloch sphere visualization is an explicit platform objective not covered by the study guide — build separately (single-qubit sphere + rotation controls via react-three-fiber).

---

## 5. Pages / Routes

Full sitemap, in recommended build order (Circuit Builder + Simulation first — it's the objective the whole problem statement is graded on):

| # | Page | Route | Purpose |
|---|---|---|---|
| 1 | Circuit Builder | `/circuit-builder` | Drag-and-drop gate palette + canvas (React Flow) + code-view toggle. Core demo centerpiece. |
| 2 | Simulation & Results | panel within Circuit Builder, or `/circuit-builder/results` | Measurement probability bar chart, state vector, Bloch sphere — wired to real Qiskit Aer backend |
| 3 | Learning Modules Library | `/learn` | Grid of all 17 concepts as cards, filterable by phenomenon/algorithm |
| 4 | Concept Detail / Lesson | `/lesson/:id` | "What it shows" text + interactive animation + key equation per concept |
| 5 | Algorithm Playground | `/playground` | Pre-built loadable circuit templates for the 10 algorithms; "Load into Circuit Builder" |
| 6 | Student Dashboard | `/dashboard` | Post-login home: continue-progress card, module summary, quick links |
| 7 | Landing/Home | `/` | Public entry point, hero, feature highlights, CTAs |
| 8 | AI Tutor Panel | persistent drawer, all pages 3–5 | Chat grounded on Section 4 content; explains, debugs, suggests |
| 9 | Coding Challenges | `/challenges` | Guided exercises (e.g. "build a Bell state") with embedded code editor + pass/fail check |
| 10 | Assessment / Quiz | `/quiz/:moduleId` | MCQs/short-answer seeded from each concept's explanation + equation |
| 11 | Progress & Analytics | `/progress` | Per-module progress, quiz scores, challenges completed |
| 12 | Auth (Login/Signup) | `/login`, `/signup` | Firebase Auth — email/password + Google |
| 13 | Instructor Dashboard | `/instructor` | Class-level student list, aggregate progress, quiz performance — mock data acceptable for prototype |
| 14 | Profile/Settings | `/profile` | Account info, role, theme toggle |

Each page will be built via its own prompt referencing `SIH_brand_guidelines.md` for design and this README for content/data/architecture context.

---

## 6. Data Model Sketch

- `concepts` collection: `{ id, part, title, whatItShows, animationSpec, equation, difficulty }` — seeded from Section 4
- `circuits` collection: `{ userId, name, gates[], qubitCount, createdAt }` — user-saved circuit builder states
- `users` collection: `{ firebaseUid, role: 'student'|'instructor', progress{}, }`
- `quizzes` collection: `{ conceptId, questions[] }`
- Simulation requests: not persisted long-term — POST circuit JSON to FastAPI `/simulate`, receive state vector + probabilities synchronously

---

## 7. Scope Notes

- Real backend execution only needs to work for Qiskit Aer in the prototype; PennyLane/Cirq/qBraid are "supported in architecture, stretch goal in demo."
- Instructor Dashboard and Assessment can use realistic mock/seed data rather than fully live pipelines if time is short — flag this honestly in the pitch, don't fake it silently.
- AI Tutor grounding = the Section 4 content table passed as system-prompt context. No RAG/vector DB needed at 17-item scale.
