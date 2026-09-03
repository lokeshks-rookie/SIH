import React, { useState, useMemo } from 'react';
import { useProgressStore } from '../stores/useProgressStore';
import ChallengeCard from '../components/progress/ChallengeCard';
import TestHistoryChart from '../components/progress/TestHistoryChart';

// SVG Icons
const IconTrophy = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.45 1-1 1H8c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1h8c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1h-1c-.55 0-1-.45-1-1v-2.34" />
    <path d="M18 4H6v7a6 6 0 0 0 12 0V4z" />
  </svg>
);

const IconCode = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const IconCheck = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconSparkle = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.91 5.81c.21.64.71 1.14 1.35 1.35L21 12l-5.74 1.84c-.64.21-1.14.71-1.35 1.35L12 21l-1.91-5.81c-.21-.64-.71-1.14-1.35-1.35L3 12l5.74-1.84c.64-.21 1.14-.71 1.35-1.35z" />
  </svg>
);

const IconPlay = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const IconHelp = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

// Comprehensive quantum challenges catalog
const CHALLENGES_CATALOG = [
  {
    id: 'ch-ghz-3',
    title: 'Construct a 3-Qubit GHZ Entangled State',
    category: 'Entanglement',
    difficulty: 'Intermediate',
    xp: 150,
    time: '8-10 mins',
    tags: ['Entanglement', 'Multi-Qubit', 'Bell Basis'],
    description: 'Create the maximally entangled 3-qubit Greenberger-Horne-Zeilinger state (|000⟩ + |111⟩)/√2 using Hadamard and CNOT gates.',
    isDaily: true,
    status: 'in-progress', // 'completed', 'in-progress', 'ready'
    circuitHref: '/circuit-builder'
  },
  {
    id: 'ch-bell-phi-plus',
    title: '2-Qubit Bell State Generator (Φ+)',
    category: 'Gates & Circuits',
    difficulty: 'Beginner',
    xp: 100,
    time: '4-5 mins',
    tags: ['Bell State', 'H-Gate', 'CNOT'],
    description: 'Transform two ground-state qubits |00⟩ into the canonical Bell state (|00⟩ + |11⟩)/√2 using single-qubit rotation and entanglement.',
    isDaily: false,
    status: 'completed',
    circuitHref: '/circuit-builder'
  },
  {
    id: 'ch-teleportation',
    title: 'Quantum Teleportation Protocol Wire-up',
    category: 'Entanglement',
    difficulty: 'Intermediate',
    xp: 180,
    time: '12-15 mins',
    tags: ['Teleportation', 'EPR Pair', 'Measurement'],
    description: 'Transmit an unknown qubit state across two parties using a shared EPR pair and classical feed-forward correction operations.',
    isDaily: false,
    status: 'ready',
    circuitHref: '/circuit-builder'
  },
  {
    id: 'ch-deutsch-jozsa',
    title: 'Deutsch–Jozsa Constant vs Balanced Oracle',
    category: 'Quantum Algorithms',
    difficulty: 'Beginner',
    xp: 120,
    time: '6-8 mins',
    tags: ['Oracle', 'Quantum Speedup', 'Phase Kickback'],
    description: 'Distinguish between a constant function and a balanced function in a single query using quantum superposition interference.',
    isDaily: false,
    status: 'completed',
    circuitHref: '/circuit-builder'
  },
  {
    id: 'ch-grover-diffusion',
    title: "Grover's Diffusion Operator (Inversion About Mean)",
    category: 'Quantum Algorithms',
    difficulty: 'Intermediate',
    xp: 175,
    time: '12-15 mins',
    tags: ['Amplitude Amplification', 'Grover', 'Search'],
    description: 'Synthesize the diffusion reflection operator 2|s⟩⟨s| - I to amplify the marked target state probability amplitude.',
    isDaily: false,
    status: 'ready',
    circuitHref: '/circuit-builder'
  },
  {
    id: 'ch-qft-3',
    title: '3-Qubit Quantum Fourier Transform (QFT)',
    category: 'Quantum Algorithms',
    difficulty: 'Advanced',
    xp: 250,
    time: '18-20 mins',
    tags: ['QFT', 'Phase Gates', 'Shor Basis'],
    description: 'Implement the full 3-qubit discrete quantum Fourier transform with Hadamard gates, controlled phase rotations (R2, R3), and swap gates.',
    isDaily: false,
    status: 'in-progress',
    circuitHref: '/circuit-builder'
  },
  {
    id: 'ch-bitflip-code',
    title: '3-Qubit Bit-Flip Quantum Error Correction',
    category: 'Error Mitigation',
    difficulty: 'Advanced',
    xp: 220,
    time: '15-18 mins',
    tags: ['Error Correction', 'Syndrome Measurement', 'Stabilizers'],
    description: 'Protect a single logical qubit against single bit-flip (X) channel noise using 2 ancilla syndrome measurement qubits.',
    isDaily: false,
    status: 'ready',
    circuitHref: '/circuit-builder'
  },
  {
    id: 'ch-bb84-key',
    title: 'BB84 Quantum Key Distribution Protocol',
    category: 'Cryptography',
    difficulty: 'Intermediate',
    xp: 160,
    time: '10-12 mins',
    tags: ['BB84', 'No-Cloning', 'Security'],
    description: 'Simulate Alice encoding random bits in rectilinear and diagonal bases with Bob performing conjugate measurements to detect eavesdropping.',
    isDaily: false,
    status: 'ready',
    circuitHref: '/circuit-builder'
  }
];

export default function Challenges() {
  const { studentName, currentStreak, getStats, testHistory, submitTestResult } = useProgressStore();
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'daily', 'problem-sets', 'tests'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuizModal, setActiveQuizModal] = useState(null);
  const [quizScore, setQuizScore] = useState(null);

  const stats = getStats();

  // Filtered challenges list
  const filteredChallenges = useMemo(() => {
    return CHALLENGES_CATALOG.filter(ch => {
      if (selectedCategory !== 'all' && ch.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      if (selectedDifficulty !== 'all' && ch.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase()) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchTitle = ch.title.toLowerCase().includes(q);
        const matchDesc = ch.description.toLowerCase().includes(q);
        const matchTag = ch.tags.some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchTag) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  const categories = ['all', 'Gates & Circuits', 'Entanglement', 'Quantum Algorithms', 'Error Mitigation', 'Cryptography'];

  const handleStartQuickQuiz = (topicName) => {
    setActiveQuizModal({
      topic: topicName,
      questions: [
        {
          q: "What gate creates an equal superposition (|0⟩ + |1⟩)/√2 from the |0⟩ basis state?",
          options: ["Pauli-X Gate", "Hadamard (H) Gate", "Phase (S) Gate", "CNOT Gate"],
          correct: 1
        },
        {
          q: "What is the probability of measuring |1⟩ for the state ψ = 1/2|0⟩ + √3/2|1⟩?",
          options: ["25%", "50%", "75%", "100%"],
          correct: 2
        },
        {
          q: "Which property makes quantum entanglement distinct from classical correlation?",
          options: ["It violates Bell's Inequality", "It travels faster than light", "It only works on 1 qubit", "It has zero entropy"],
          correct: 0
        }
      ],
      userAnswers: {},
      submitted: false
    });
  };

  const handleSelectQuizOption = (qIdx, optIdx) => {
    setActiveQuizModal(prev => ({
      ...prev,
      userAnswers: { ...prev.userAnswers, [qIdx]: optIdx }
    }));
  };

  const handleSubmitQuiz = () => {
    if (!activeQuizModal) return;
    let correctCount = 0;
    activeQuizModal.questions.forEach((q, idx) => {
      if (activeQuizModal.userAnswers[idx] === q.correct) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / activeQuizModal.questions.length) * 100);
    setQuizScore(calculatedScore);

    submitTestResult({
      title: `${activeQuizModal.topic} Quick Diagnostic`,
      topic: activeQuizModal.topic,
      type: 'quiz',
      difficulty: 'Intermediate',
      score: calculatedScore,
      maxScore: 100,
      timeTaken: '2m 15s',
      weakPoints: calculatedScore < 70 ? [`${activeQuizModal.topic} Core Theory`] : []
    });

    setActiveQuizModal(prev => ({ ...prev, submitted: true }));
  };

  return (
    <div className="flex flex-col gap-10 pb-16">
      
      {/* 1. CHALLENGES & ASSESSMENTS HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1 rounded-md bg-[var(--color-accent-light)] text-[var(--color-accent-deep)]"><IconTrophy /></span>
            <span className="text-[13px] font-semibold text-[var(--color-accent-deep)] uppercase tracking-wider">Practice & Test Hub</span>
          </div>
          <h1 className="font-display text-[32px] md:text-[40px] font-bold tracking-tight text-[var(--color-text)] mb-2">
            Challenges & Skill Assessments
          </h1>
          <p className="text-[15px] text-[var(--color-text)]/70 font-medium m-0">
            Build circuits to solve daily puzzles, test quantum algorithms, and verify mastery with diagnostic quizzes.
          </p>
        </div>

        {/* Top Navigation Tabs */}
        <div className="flex items-center gap-1 bg-[var(--color-card)] border border-[var(--color-border)] p-1 rounded-xl text-[12px] font-medium self-start md:self-auto">
          {[
            { id: 'all', label: 'All Challenges & Tests' },
            { id: 'daily', label: "Today's Challenge" },
            { id: 'problem-sets', label: 'Problem Sets' },
            { id: 'tests', label: 'Diagnostic History' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-colors border-none cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[var(--color-base)] font-semibold text-[var(--color-text)] shadow-2xs'
                  : 'bg-transparent text-[var(--color-text)]/65 hover:text-[var(--color-text)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. CHALLENGE PERFORMANCE STATS STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Challenges Solved", value: `${stats.challengesPassed} / 50`, subtext: "Algorithmic builds", icon: "🏆" },
          { label: "Daily Streak Status", value: `${currentStreak} Days`, subtext: "Streak locked today", icon: "🔥" },
          { label: "Assessment Average", value: `${stats.quizAverage}%`, subtext: "Diagnostic accuracy", icon: "📊" },
          { label: "Total Challenge XP", value: `${stats.totalPoints} XP`, subtext: "Earned from builds & tests", icon: "⚡" }
        ].map((stat, i) => (
          <div key={i} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[14px] p-4 flex flex-col justify-center relative overflow-hidden">
            <div className="flex justify-between items-start mb-1">
              <span className="text-[12px] text-[var(--color-text)]/60 font-medium">{stat.label}</span>
              <span className="text-[16px]">{stat.icon}</span>
            </div>
            <span className="font-display text-[22px] font-semibold text-[var(--color-text)]">{stat.value}</span>
            <span className="text-[11px] text-[var(--color-text)]/50 font-medium mt-0.5">{stat.subtext}</span>
          </div>
        ))}
      </div>

      {/* 3. TODAY'S FEATURED DAILY CHALLENGE (With countdown timer & streak lock) */}
      {(activeTab === 'all' || activeTab === 'daily') && (
        <section id="daily-challenge" className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[20px] font-bold text-[var(--color-text)] m-0 flex items-center gap-2">
              <span>⚡</span> Featured Daily Challenge
            </h2>
            <span className="text-[12px] text-[var(--color-text)]/60 font-medium">New challenge unlocks daily at midnight</span>
          </div>
          <ChallengeCard />
        </section>
      )}

      {/* 4. QUICK DIAGNOSTIC TEST LAUNCHER BANNER */}
      {(activeTab === 'all' || activeTab === 'tests') && (
        <div className="bg-[var(--color-accent-deep)] text-white rounded-[16px] p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[240px] h-[240px] bg-white/5 rounded-full blur-[50px] pointer-events-none"></div>
          
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 mt-0.5">
              <IconSparkle />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-400 text-emerald-950 font-mono">AI DIAGNOSTIC</span>
                <span className="text-[12px] text-white/70">3-Minute Rapid Assessment</span>
              </div>
              <h3 className="font-display text-[18px] md:text-[20px] font-semibold text-white m-0 mb-1">
                Quantum State & Gate Mastery Check
              </h3>
              <p className="text-[13px] text-white/80 m-0 max-w-xl">
                Benchmark your understanding of wave collapse, phase kickback, and entangled measurement bases.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
            <button
              onClick={() => handleStartQuickQuiz("Quantum State & Gate Mastery")}
              className="px-5 py-2.5 bg-white text-[var(--color-accent-deep)] rounded-full text-[13px] font-semibold border-none cursor-pointer hover:bg-[var(--color-accent-light)] transition-colors"
            >
              Start Diagnostic Quiz →
            </button>
          </div>
        </div>
      )}

      {/* 5. INTERACTIVE PROBLEM SETS & CHALLENGES LIBRARY */}
      {(activeTab === 'all' || activeTab === 'problem-sets') && (
        <section id="problem-sets" className="flex flex-col gap-5">
          
          {/* Section Header & Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-[20px] font-bold text-[var(--color-text)] m-0">
                Quantum Problem Sets & Circuit Challenges
              </h2>
              <p className="text-[13px] text-[var(--color-text)]/65 m-0 mt-0.5">
                Select a problem to synthesize in the circuit simulator and verify your quantum state
              </p>
            </div>

            {/* Search Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search challenges by name or gate..."
                className="w-full sm:w-[220px] px-3.5 py-1.5 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg text-[13px] text-[var(--color-text)] outline-none focus:border-[var(--color-accent-deep)] transition-colors placeholder:text-[var(--color-text)]/40"
              />
            </div>
          </div>

          {/* Category & Difficulty Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[var(--color-border)]/60">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors border cursor-pointer capitalize ${
                    selectedCategory === cat
                      ? 'bg-[var(--color-action)] text-white border-[var(--color-action)] font-semibold'
                      : 'bg-[var(--color-card)] text-[var(--color-text)]/70 border-[var(--color-border)] hover:text-[var(--color-text)] hover:border-[var(--color-accent-deep)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-1 bg-[var(--color-card)] border border-[var(--color-border)] p-0.5 rounded-lg text-[11px] font-medium">
              {['all', 'beginner', 'intermediate', 'advanced'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedDifficulty(lvl)}
                  className={`px-2.5 py-1 rounded-md capitalize transition-colors border-none cursor-pointer ${
                    selectedDifficulty === lvl
                      ? 'bg-[var(--color-base)] font-semibold text-[var(--color-text)] shadow-2xs'
                      : 'bg-transparent text-[var(--color-text)]/60 hover:text-[var(--color-text)]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Challenges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredChallenges.map((ch) => (
              <div
                key={ch.id}
                className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[16px] p-5 flex flex-col justify-between gap-4 hover:border-[var(--color-accent-deep)]/60 transition-all group"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        ch.difficulty === 'Beginner'
                          ? 'bg-[var(--color-accent-light)] text-[var(--color-accent-deep)]'
                          : ch.difficulty === 'Intermediate'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-purple-50 text-purple-800 border border-purple-200'
                      }`}>
                        {ch.difficulty}
                      </span>
                      <span className="text-[11px] font-medium text-[var(--color-text)]/50">
                        {ch.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-[var(--color-base)] text-[var(--color-accent-deep)] border border-[var(--color-border)]">
                        +{ch.xp} XP
                      </span>
                      {ch.status === 'completed' && (
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]" title="Completed">
                          ✓
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-display text-[16px] font-bold text-[var(--color-text)] m-0 mb-1.5 group-hover:text-[var(--color-accent-deep)] transition-colors">
                    {ch.title}
                  </h3>
                  <p className="text-[13px] text-[var(--color-text)]/70 m-0 leading-relaxed mb-3 line-clamp-2">
                    {ch.description}
                  </p>

                  {/* Tags & Time */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-[var(--color-text)]/50 mr-1">⏱ {ch.time}</span>
                    {ch.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--color-base)] text-[var(--color-text)]/60 border border-[var(--color-border)]/60">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="flex items-center justify-between gap-3 pt-3 border-t border-[var(--color-border)]/60 mt-1">
                  <span className="text-[12px] font-medium text-[var(--color-text)]/60">
                    {ch.status === 'completed' ? 'Status: Solved' : ch.status === 'in-progress' ? 'Status: In Progress' : 'Status: Ready to Solve'}
                  </span>

                  <a
                    href={ch.circuitHref}
                    className="px-4 py-1.5 rounded-full text-[12px] font-semibold bg-[var(--color-action)] text-white hover:bg-[var(--color-accent-deep)] transition-colors no-underline text-center shrink-0"
                  >
                    {ch.status === 'completed' ? 'Re-open Circuit →' : 'Solve in Circuit Builder →'}
                  </a>
                </div>

              </div>
            ))}
          </div>

        </section>
      )}

      {/* 6. DIAGNOSTIC PERFORMANCE HISTORY & WEAK TOPICS CHART */}
      {(activeTab === 'all' || activeTab === 'tests') && (
        <section id="tests" className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[20px] font-bold text-[var(--color-text)] m-0">
              Assessment Trajectory & Mistake Diagnostic
            </h2>
          </div>
          <TestHistoryChart />
        </section>
      )}

      {/* 7. QUICK QUIZ MODAL */}
      {activeQuizModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[20px] max-w-lg w-full p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
              <div>
                <span className="text-[11px] font-semibold text-[var(--color-accent-deep)] uppercase font-mono">Diagnostic Quiz</span>
                <h3 className="font-display text-[18px] font-bold text-[var(--color-text)] m-0">
                  {activeQuizModal.topic}
                </h3>
              </div>
              <button
                onClick={() => setActiveQuizModal(null)}
                className="w-8 h-8 rounded-full bg-[var(--color-base)] border border-[var(--color-border)] text-[var(--color-text)] flex items-center justify-center cursor-pointer hover:bg-black/10 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Questions List */}
            <div className="flex flex-col gap-5">
              {activeQuizModal.questions.map((q, qIdx) => (
                <div key={qIdx} className="flex flex-col gap-2.5">
                  <p className="text-[14px] font-medium text-[var(--color-text)] m-0">
                    <span className="font-bold text-[var(--color-accent-deep)] mr-1.5">{qIdx + 1}.</span>
                    {q.q}
                  </p>
                  <div className="flex flex-col gap-1.5 pl-4">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = activeQuizModal.userAnswers[qIdx] === optIdx;
                      const isCorrect = q.correct === optIdx;
                      let optionStyle = "bg-[var(--color-base)] border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-accent-deep)]";

                      if (activeQuizModal.submitted) {
                        if (isCorrect) {
                          optionStyle = "bg-emerald-100 border-emerald-500 text-emerald-950 font-semibold";
                        } else if (isSelected && !isCorrect) {
                          optionStyle = "bg-rose-100 border-rose-400 text-rose-950";
                        }
                      } else if (isSelected) {
                        optionStyle = "bg-[var(--color-accent-light)] border-[var(--color-accent-deep)] text-[var(--color-accent-deep)] font-semibold";
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={activeQuizModal.submitted}
                          onClick={() => handleSelectQuizOption(qIdx, optIdx)}
                          className={`text-left p-2.5 rounded-xl border text-[13px] transition-all cursor-pointer ${optionStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Result / Submit Footer */}
            <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
              {activeQuizModal.submitted ? (
                <div className="flex items-center justify-between w-full">
                  <div>
                    <span className="text-[13px] font-medium text-[var(--color-text)]/70">Quiz Score: </span>
                    <strong className="font-mono text-[16px] text-[var(--color-accent-deep)]">{quizScore}%</strong>
                  </div>
                  <button
                    onClick={() => setActiveQuizModal(null)}
                    className="px-5 py-2 bg-[var(--color-action)] text-white rounded-full text-[13px] font-semibold cursor-pointer border-none hover:bg-[var(--color-accent-deep)] transition-colors"
                  >
                    Done & View History
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(activeQuizModal.userAnswers).length < activeQuizModal.questions.length}
                  className={`w-full py-2.5 rounded-full text-[13px] font-semibold transition-colors border-none ${
                    Object.keys(activeQuizModal.userAnswers).length >= activeQuizModal.questions.length
                      ? 'bg-[var(--color-action)] text-white cursor-pointer hover:bg-[var(--color-accent-deep)]'
                      : 'bg-[var(--color-border)] text-[var(--color-text)]/40 cursor-not-allowed'
                  }`}
                >
                  Submit & Record Score
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
