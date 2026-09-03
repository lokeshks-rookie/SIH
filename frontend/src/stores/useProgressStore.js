import { create } from 'zustand';

// Helper to format date YYYY-MM-DD
export const getTodayDateStr = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

export const getDaysAgoDateStr = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

// Initial topics structure (LeetCode-style grouping of the 17 standard modules)
export const INITIAL_TOPICS = [
  {
    id: 'topic-1',
    title: 'Qubits, Superposition & Measurement',
    difficulty: 'Beginner',
    description: 'Quantum states, wave function collapse, and the foundation of quantum parallelism.',
    modules: [
      { id: 1, title: 'Double-slit Experiment', difficulty: 'Beginner', status: 'completed', score: 95, timeSpent: '18m' },
      { id: 2, title: 'Superposition & Measurement', difficulty: 'Beginner', status: 'in-progress', score: 80, timeSpent: '24m' },
      { id: 3, title: 'Stern–Gerlach Experiment', difficulty: 'Beginner', status: 'not-started', score: null, timeSpent: null },
    ]
  },
  {
    id: 'topic-2',
    title: 'Quantum Entanglement & Non-Locality',
    difficulty: 'Intermediate',
    description: 'EPR paradox, Bell states, non-local correlations, and quantum erasure.',
    modules: [
      { id: 4, title: 'Quantum Entanglement', difficulty: 'Intermediate', status: 'completed', score: 90, timeSpent: '30m' },
      { id: 7, title: 'Delayed-choice Quantum Eraser', difficulty: 'Intermediate', status: 'not-started', score: null, timeSpent: null },
      { id: 12, title: 'Quantum Teleportation', difficulty: 'Intermediate', status: 'not-started', score: null, timeSpent: null },
      { id: 13, title: 'Superdense Coding', difficulty: 'Intermediate', status: 'not-started', score: null, timeSpent: null },
    ]
  },
  {
    id: 'topic-3',
    title: 'Quantum Gates & Circuit Architecture',
    difficulty: 'Beginner',
    description: 'Single-qubit rotations, multi-qubit entangling gates, and circuit synthesis.',
    modules: [
      { id: 5, title: 'Quantum Tunneling', difficulty: 'Intermediate', status: 'completed', score: 85, timeSpent: '22m' },
      { id: 6, title: 'Quantum Zeno Effect', difficulty: 'Intermediate', status: 'not-started', score: null, timeSpent: null },
    ]
  },
  {
    id: 'topic-4',
    title: 'Quantum Algorithms & Speedups',
    difficulty: 'Advanced',
    description: 'Harnessing quantum interference and phase estimation for polynomial and exponential speedups.',
    modules: [
      { id: 8, title: 'Deutsch–Jozsa Algorithm', difficulty: 'Beginner', status: 'completed', score: 100, timeSpent: '25m' },
      { id: 9, title: "Grover's Search Algorithm", difficulty: 'Intermediate', status: 'completed', score: 90, timeSpent: '45m' },
      { id: 10, title: 'Quantum Fourier Transform', difficulty: 'Advanced', status: 'in-progress', score: 55, timeSpent: '35m' },
      { id: 11, title: "Shor's Algorithm", difficulty: 'Advanced', status: 'not-started', score: null, timeSpent: null },
      { id: 14, title: 'Quantum Walks', difficulty: 'Advanced', status: 'not-started', score: null, timeSpent: null },
    ]
  },
  {
    id: 'topic-5',
    title: 'Quantum Cryptography & Key Distribution',
    difficulty: 'Intermediate',
    description: 'Information-theoretic security guaranteed by quantum mechanics.',
    modules: [
      { id: 15, title: 'BB84 Key Distribution', difficulty: 'Intermediate', status: 'not-started', score: null, timeSpent: null },
    ]
  },
  {
    id: 'topic-6',
    title: 'Error Correction & NISQ Algorithms',
    difficulty: 'Advanced',
    description: 'Stabilizer codes, fault tolerance, and hybrid variational algorithms.',
    modules: [
      { id: 16, title: 'Quantum Error Correction', difficulty: 'Advanced', status: 'not-started', score: null, timeSpent: null },
      { id: 17, title: 'VQE & QAOA', difficulty: 'Advanced', status: 'not-started', score: null, timeSpent: null },
    ]
  }
];

// Helper to generate seed activity heatmap data over the past 180 days
const generateSeedActivityHistory = () => {
  const history = {};
  const today = new Date();

  // Populate realistic sample activity over past months
  for (let i = 180; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    let count = 0;
    const activities = [];

    // Recent 5-day active streak (today - 4 to today)
    if (i <= 4) {
      count = i === 0 ? 3 : (i % 2 === 0 ? 4 : 2);
      activities.push(
        { type: 'module', title: 'Superposition & Measurement Lesson', time: '10:30 AM' },
        { type: 'circuit', title: 'Bell State Circuit Construction', time: '02:15 PM' }
      );
      if (i <= 2) {
        activities.push({ type: 'test', title: "Grover's Algorithm Assessment", score: '90%', time: '06:00 PM' });
      }
    } else if (i >= 7 && i <= 18) {
      // 12-day streak earlier this month
      count = (i % 3) + 1;
      activities.push({ type: 'module', title: 'Quantum Gates Study', time: '11:00 AM' });
      if (count > 2) activities.push({ type: 'challenge', title: 'Daily CNOT Challenge', time: '04:20 PM' });
    } else if (i >= 30 && i <= 45 && !isWeekend) {
      count = (i % 4) + 1;
      activities.push({ type: 'circuit', title: 'Deutsch-Jozsa Oracle Builder', time: '03:00 PM' });
    } else if (i % 5 === 0 && i < 150) {
      count = 1;
      activities.push({ type: 'test', title: 'Quantum Fundamentals Quiz', score: '85%', time: '07:30 PM' });
    }

    if (count > 0) {
      history[dateStr] = {
        date: dateStr,
        count,
        activities
      };
    }
  }

  return history;
};

// Seed past daily test and challenges history
const INITIAL_TEST_HISTORY = [
  {
    id: 'test-1',
    title: "Grover's Algorithm Speedup Quiz",
    topic: 'Quantum Algorithms & Speedups',
    type: 'quiz',
    difficulty: 'Intermediate',
    date: getDaysAgoDateStr(0),
    score: 90,
    maxScore: 100,
    passed: true,
    timeTaken: '4m 15s',
    weakPoints: ['Oracle Phase Inversion']
  },
  {
    id: 'test-2',
    title: 'Daily Challenge: 2-Qubit Bell State Builder',
    topic: 'Quantum Entanglement & Non-Locality',
    type: 'challenge',
    difficulty: 'Beginner',
    date: getDaysAgoDateStr(1),
    score: 100,
    maxScore: 100,
    passed: true,
    timeTaken: '3m 10s',
    weakPoints: []
  },
  {
    id: 'test-3',
    title: 'Quantum Fourier Transform Verification',
    topic: 'Quantum Algorithms & Speedups',
    type: 'quiz',
    difficulty: 'Advanced',
    date: getDaysAgoDateStr(3),
    score: 55,
    maxScore: 100,
    passed: false,
    timeTaken: '8m 40s',
    weakPoints: ['Controlled Phase Rotations (R_k)', 'Bit-Reversal Swaps']
  },
  {
    id: 'test-4',
    title: 'Daily Challenge: Superposition Wave Collapse',
    topic: 'Qubits, Superposition & Measurement',
    type: 'challenge',
    difficulty: 'Beginner',
    date: getDaysAgoDateStr(4),
    score: 85,
    maxScore: 100,
    passed: true,
    timeTaken: '5m 02s',
    weakPoints: ['Born Rule Amplitude Squared']
  },
  {
    id: 'test-5',
    title: 'Deutsch-Jozsa Constant vs Balanced Oracle',
    topic: 'Quantum Algorithms & Speedups',
    type: 'quiz',
    difficulty: 'Beginner',
    date: getDaysAgoDateStr(8),
    score: 100,
    maxScore: 100,
    passed: true,
    timeTaken: '4m 50s',
    weakPoints: []
  },
  {
    id: 'test-6',
    title: 'Quantum Tunneling Barrier Probability',
    topic: 'Quantum Gates & Circuit Architecture',
    type: 'quiz',
    difficulty: 'Intermediate',
    date: getDaysAgoDateStr(12),
    score: 85,
    maxScore: 100,
    passed: true,
    timeTaken: '6m 20s',
    weakPoints: ['Decay Constant Calculation']
  }
];

// Initial today's challenge
const INITIAL_TODAY_CHALLENGE = {
  id: 'daily-ghz-3',
  title: 'Construct a 3-Qubit GHZ Entangled State',
  topic: 'Quantum Entanglement & Non-Locality',
  difficulty: 'Intermediate',
  description: 'Create the maximally entangled 3-qubit Greenberger-Horne-Zeilinger state (|000⟩ + |111⟩)/√2 using Hadamard and CNOT gates.',
  rewardXp: 150,
  estimatedTime: '8-10 mins',
  completed: false,
  completedAt: null,
  tags: ['Entanglement', 'Multi-Qubit', 'Bell Basis'],
  circuitTarget: {
    qubitCount: 3,
    expectedState: 'GHZ (|000⟩ + |111⟩)/√2'
  }
};

const STORAGE_KEY = 'qdemy_user_progress_v1';

export const useProgressStore = create((set, get) => {
  // Load initial from localStorage if available
  let savedState = {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) savedState = JSON.parse(raw);
  } catch (e) {
    console.warn('Could not parse stored progress', e);
  }

  const defaultState = {
    studentName: 'Lokesh',
    currentStreak: 5,
    longestStreak: 14,
    freezePassesAvailable: 2,
    freezePassesTotal: 2,
    freezePassesUsed: 0,
    lastActiveDate: getTodayDateStr(),
    activityHistory: generateSeedActivityHistory(),
    topics: INITIAL_TOPICS,
    testHistory: INITIAL_TEST_HISTORY,
    todayChallenge: INITIAL_TODAY_CHALLENGE,
    totalPoints: 1420,
    circuitsBuiltCount: 24,
    ...savedState
  };

  const persist = (nextState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    } catch (e) {
      console.warn('Could not save progress to localStorage', e);
    }
  };

  return {
    ...defaultState,

    // ── STREAK LOGIC & QUALIFYING ACTIVITIES ──
    recordActivity: (activity) => {
      const state = get();
      const todayStr = getTodayDateStr();
      const currentHistory = { ...state.activityHistory };
      const todayRecord = currentHistory[todayStr] || { date: todayStr, count: 0, activities: [] };

      const newActivities = [
        {
          type: activity.type || 'study',
          title: activity.title || 'Learning Activity',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          score: activity.score || null
        },
        ...todayRecord.activities
      ];

      currentHistory[todayStr] = {
        date: todayStr,
        count: todayRecord.count + 1,
        activities: newActivities
      };

      // Calculate streak change
      let nextStreak = state.currentStreak;
      let nextFreezeUsed = state.freezePassesUsed;
      let nextFreezeAvail = state.freezePassesAvailable;

      if (state.lastActiveDate !== todayStr) {
        // Calculate days difference
        const lastDate = new Date(state.lastActiveDate);
        const todayDate = new Date(todayStr);
        const diffTime = Math.abs(todayDate - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Consecutive day: increment streak
          nextStreak += 1;
        } else if (diffDays === 2 && state.freezePassesAvailable > 0) {
          // Missed 1 day but has a freeze pass: streak saved!
          nextFreezeAvail -= 1;
          nextFreezeUsed += 1;
          nextStreak += 1;
        } else if (diffDays > 1) {
          // Missed without protection: reset streak to 1
          nextStreak = 1;
        }
      }

      const nextLongest = Math.max(state.longestStreak, nextStreak);

      const nextState = {
        ...state,
        currentStreak: nextStreak,
        longestStreak: nextLongest,
        freezePassesAvailable: nextFreezeAvail,
        freezePassesUsed: nextFreezeUsed,
        lastActiveDate: todayStr,
        activityHistory: currentHistory,
        totalPoints: state.totalPoints + (activity.xp || 20)
      };

      set(nextState);
      persist(nextState);
    },

    // ── MODULE STATUS UPDATE ──
    updateModuleStatus: (moduleId, status, score = null) => {
      const state = get();
      let updated = false;

      const newTopics = state.topics.map(topic => {
        const modIndex = topic.modules.findIndex(m => m.id === Number(moduleId));
        if (modIndex === -1) return topic;

        updated = true;
        const newModules = [...topic.modules];
        newModules[modIndex] = {
          ...newModules[modIndex],
          status,
          score: score !== null ? score : newModules[modIndex].score,
          timeSpent: newModules[modIndex].timeSpent || '20m'
        };

        return { ...topic, modules: newModules };
      });

      if (updated) {
        // Qualifying event for daily streak
        get().recordActivity({
          type: 'module',
          title: `Module ${moduleId} marked ${status}`,
          score: score ? `${score}%` : null,
          xp: status === 'completed' ? 50 : 15
        });

        const nextState = { ...state, topics: newTopics };
        set(nextState);
        persist(nextState);
      }
    },

    // ── DAILY TEST / QUIZ SUBMISSION ──
    submitTestResult: ({ title, topic, type = 'quiz', difficulty = 'Intermediate', score, maxScore = 100, timeTaken = '5m 00s', weakPoints = [] }) => {
      const state = get();
      const todayStr = getTodayDateStr();
      const passed = (score / maxScore) >= 0.7;

      const newTest = {
        id: `test-${Date.now()}`,
        title,
        topic,
        type,
        difficulty,
        date: todayStr,
        score,
        maxScore,
        passed,
        timeTaken,
        weakPoints
      };

      const updatedHistory = [newTest, ...state.testHistory];

      get().recordActivity({
        type: type === 'challenge' ? 'challenge' : 'test',
        title: `${title} (${score}/${maxScore})`,
        score: `${Math.round((score / maxScore) * 100)}%`,
        xp: passed ? 60 : 25
      });

      const nextState = {
        ...get(),
        testHistory: updatedHistory
      };

      set(nextState);
      persist(nextState);
    },

    // ── COMPLETE TODAY'S CHALLENGE ──
    completeDailyChallenge: () => {
      const state = get();
      if (state.todayChallenge.completed) return;

      const updatedChallenge = {
        ...state.todayChallenge,
        completed: true,
        completedAt: new Date().toISOString()
      };

      const challengeTestRecord = {
        id: `challenge-${Date.now()}`,
        title: `Daily Challenge: ${state.todayChallenge.title}`,
        topic: state.todayChallenge.topic,
        type: 'challenge',
        difficulty: state.todayChallenge.difficulty,
        date: getTodayDateStr(),
        score: 100,
        maxScore: 100,
        passed: true,
        timeTaken: '6m 45s',
        weakPoints: []
      };

      get().recordActivity({
        type: 'challenge',
        title: `Solved Daily Challenge: ${state.todayChallenge.title}`,
        score: '100%',
        xp: state.todayChallenge.rewardXp
      });

      const nextState = {
        ...get(),
        todayChallenge: updatedChallenge,
        testHistory: [challengeTestRecord, ...get().testHistory],
        circuitsBuiltCount: get().circuitsBuiltCount + 1
      };

      set(nextState);
      persist(nextState);
    },

    // ── USE STREAK FREEZE MANUALLY ──
    useStreakFreezePass: () => {
      const state = get();
      if (state.freezePassesAvailable <= 0) return false;

      const nextState = {
        ...state,
        freezePassesAvailable: state.freezePassesAvailable - 1,
        freezePassesUsed: state.freezePassesUsed + 1
      };

      set(nextState);
      persist(nextState);
      return true;
    },

    // ── COMPUTED ANALYTICS / GETTERS ──
    getStats: () => {
      const state = get();
      let totalModules = 0;
      let completedModules = 0;
      let inProgressModules = 0;

      state.topics.forEach(t => {
        t.modules.forEach(m => {
          totalModules++;
          if (m.status === 'completed') completedModules++;
          else if (m.status === 'in-progress') inProgressModules++;
        });
      });

      const overallPercentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
      
      // Calculate quiz average
      const scoredTests = state.testHistory.filter(t => typeof t.score === 'number');
      const quizAverage = scoredTests.length > 0
        ? Math.round(scoredTests.reduce((acc, t) => acc + (t.score / t.maxScore) * 100, 0) / scoredTests.length)
        : 90;

      return {
        totalModules,
        completedModules,
        inProgressModules,
        overallPercentage,
        quizAverage,
        circuitsBuilt: state.circuitsBuiltCount,
        challengesPassed: state.testHistory.filter(t => t.type === 'challenge' && t.passed).length,
        totalPoints: state.totalPoints
      };
    },

    // Computed Weak Topics from test mistakes
    getWeakTopics: () => {
      const state = get();
      const topicStats = {};

      state.testHistory.forEach(test => {
        if (!topicStats[test.topic]) {
          topicStats[test.topic] = { topic: test.topic, totalScore: 0, totalMax: 0, attempts: 0, weakPoints: [] };
        }
        topicStats[test.topic].totalScore += test.score;
        topicStats[test.topic].totalMax += test.maxScore;
        topicStats[test.topic].attempts += 1;
        if (test.weakPoints && test.weakPoints.length > 0) {
          topicStats[test.topic].weakPoints.push(...test.weakPoints);
        }
      });

      const weakList = Object.values(topicStats)
        .map(ts => ({
          topic: ts.topic,
          accuracy: Math.round((ts.totalScore / ts.totalMax) * 100),
          attempts: ts.attempts,
          weakPoints: Array.from(new Set(ts.weakPoints))
        }))
        .filter(ts => ts.accuracy < 75)
        .sort((a, b) => a.accuracy - b.accuracy);

      return weakList;
    },

    // Reset store to default demo values if needed
    resetProgress: () => {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
      set({
        studentName: 'Lokesh',
        currentStreak: 5,
        longestStreak: 14,
        freezePassesAvailable: 2,
        freezePassesTotal: 2,
        freezePassesUsed: 0,
        lastActiveDate: getTodayDateStr(),
        activityHistory: generateSeedActivityHistory(),
        topics: INITIAL_TOPICS,
        testHistory: INITIAL_TEST_HISTORY,
        todayChallenge: INITIAL_TODAY_CHALLENGE,
        totalPoints: 1420,
        circuitsBuiltCount: 24
      });
    }
  };
});
