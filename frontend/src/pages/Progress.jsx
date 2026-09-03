import React, { useState } from 'react';
import { useProgressStore } from '../stores/useProgressStore';
import StreakTracker from '../components/progress/StreakTracker';
import HeatmapCalendar from '../components/progress/HeatmapCalendar';
import TopicProgressList from '../components/progress/TopicProgressList';

// SVG Icons
const IconActivity = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const IconBookOpen = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const IconCircuit = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 6h10" /><path d="M6 12h12" /><path d="M8 18h10" /><path d="M3 12h3" /><path d="M18 12h3" /><rect x="6" y="4" width="4" height="4" rx="1" /><rect x="14" y="10" width="4" height="4" rx="1" /><rect x="6" y="16" width="4" height="4" rx="1" />
  </svg>
);

export default function Progress() {
  const { studentName, currentStreak, getStats, activityHistory } = useProgressStore();
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'streak', 'topics'

  const stats = getStats();

  const recentLearningActivities = [
    { text: "Explored module: Superposition & Measurement", time: "2 hours ago", type: "lesson" },
    { text: "Synthesized circuit: Bell State (Φ+)", time: "5 hours ago", type: "circuit" },
    { text: "Reviewed theory: Quantum Tunneling Barrier", time: "Yesterday", type: "lesson" },
    { text: "Completed lesson: Deutsch–Jozsa Algorithm", time: "2 days ago", type: "lesson" },
  ];

  return (
    <div className="flex flex-col gap-10 pb-16">
      
      {/* 1. PROGRESS HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-[32px] md:text-[40px] font-bold tracking-tight text-[var(--color-text)] mb-2">
            Learning Progress & Analytics
          </h1>
          <p className="text-[15px] text-[var(--color-text)]/70 font-medium m-0">
            🔥 {currentStreak}-day active streak • Overall Concept Mastery: <span className="text-[var(--color-accent-deep)] font-semibold">{stats.overallPercentage}%</span>
          </p>
        </div>

        {/* Filter Navigation Tabs for Progress */}
        <div className="flex items-center gap-1 bg-[var(--color-card)] border border-[var(--color-border)] p-1 rounded-xl text-[12px] font-medium self-start md:self-auto">
          {[
            { id: 'all', label: 'All Progress' },
            { id: 'streak', label: 'Streak & Heatmap' },
            { id: 'topics', label: 'Topics & Mastery' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg transition-colors border-none cursor-pointer ${
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

      {/* 2. LEARNING STATS OVERVIEW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Concepts Completed", value: `${stats.completedModules} / ${stats.totalModules}`, subtext: `${stats.overallPercentage}% overall mastery` },
          { label: "Circuits Synthesized", value: String(stats.circuitsBuilt), subtext: "Interactive builds" },
          { label: "Current Active Streak", value: `${currentStreak} Days`, subtext: "Consistent learner" },
          { label: "Learning Modules", value: `${stats.inProgressModules} Active`, subtext: "In progress now" }
        ].map((stat, i) => (
          <div key={i} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[14px] p-4 flex flex-col justify-center">
            <span className="text-[12px] text-[var(--color-text)]/60 font-medium mb-1">{stat.label}</span>
            <span className="font-display text-[22px] font-semibold text-[var(--color-text)]">{stat.value}</span>
            <span className="text-[11px] text-[var(--color-text)]/50 font-medium mt-0.5">{stat.subtext}</span>
          </div>
        ))}
      </div>

      {/* 3. DAILY STREAK COUNTER & HEATMAP */}
      {(activeTab === 'all' || activeTab === 'streak') && (
        <section className="flex flex-col gap-6">
          <StreakTracker />
          <HeatmapCalendar />
        </section>
      )}

      {/* 4. TOPIC & PROBLEM PROGRESS TRACKER */}
      {(activeTab === 'all' || activeTab === 'topics') && (
        <section id="topics">
          <TopicProgressList />
        </section>
      )}

      {/* 5. AI TUTOR RECOMMENDED NEXT CONCEPTS & RECENT LEARNING STREAM */}
      {(activeTab === 'all') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4 border-t border-[var(--color-border)]/60">
          
          {/* AI Concept Recommendation */}
          <div className="lg:col-span-1">
            <h2 className="font-display text-[20px] font-semibold text-[var(--color-text)] mb-4">Recommended Next Topic</h2>
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[16px] p-5 flex flex-col justify-between h-[calc(100%-2.5rem)]">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[var(--color-accent-deep)]"><IconBookOpen /></span>
                  <span className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-accent-deep)]">Core Theory</span>
                </div>
                <h3 className="text-[16px] font-semibold text-[var(--color-text)] mb-2">Superposition & Measurement</h3>
                <p className="text-[13px] text-[var(--color-text)]/70 leading-relaxed mb-4">
                  Master the Born rule and understand how probability amplitudes govern qubit measurements in Hilbert space.
                </p>
              </div>
              <a
                href="/lesson/2"
                className="inline-block w-full py-2.5 bg-[var(--color-action)] text-white rounded-full text-[13px] font-semibold no-underline text-center hover:bg-[var(--color-accent-deep)] transition-colors"
              >
                Continue Lesson (40% Complete) →
              </a>
            </div>
          </div>

          {/* Recent Learning Stream */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-[20px] font-semibold text-[var(--color-text)] mb-4">Recent Learning Stream</h2>
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[16px] p-5 flex flex-col gap-4">
              {recentLearningActivities.map((act, i) => (
                <div key={i} className="flex items-start gap-3.5 pb-3.5 border-b border-[var(--color-border)]/60 last:border-b-0 last:pb-0">
                  <div className="mt-0.5 w-7 h-7 rounded-lg bg-[var(--color-base)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-accent-deep)] shrink-0">
                    {act.type === 'circuit' ? <IconCircuit /> : <IconActivity />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-[var(--color-text)] m-0">{act.text}</p>
                    <p className="text-[12px] text-[var(--color-text)]/50 m-0 mt-0.5">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
