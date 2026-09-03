import React, { useState } from 'react';
import { useProgressStore } from '../../stores/useProgressStore';

const IconCheck = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconChevronDown = ({ isOpen }) => (
  <svg
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function TopicProgressList() {
  const { topics, updateModuleStatus } = useProgressStore();
  const [expandedTopics, setExpandedTopics] = useState({ 'topic-1': true, 'topic-2': true, 'topic-4': true });
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  const toggleTopic = (id) => {
    setExpandedTopics(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Calculate difficulty stats
  let totalEasy = 0, completedEasy = 0;
  let totalMed = 0, completedMed = 0;
  let totalHard = 0, completedHard = 0;
  let totalAll = 0, completedAll = 0;

  topics.forEach(t => {
    t.modules.forEach(m => {
      totalAll++;
      if (m.status === 'completed') completedAll++;

      if (m.difficulty === 'Beginner') {
        totalEasy++;
        if (m.status === 'completed') completedEasy++;
      } else if (m.difficulty === 'Intermediate') {
        totalMed++;
        if (m.status === 'completed') completedMed++;
      } else if (m.difficulty === 'Advanced') {
        totalHard++;
        if (m.status === 'completed') completedHard++;
      }
    });
  });

  const overallPercent = totalAll > 0 ? Math.round((completedAll / totalAll) * 100) : 0;

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'Beginner':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[var(--color-accent-light)] text-[var(--color-accent-deep)] border border-[var(--color-accent-deep)]/20">
            Beginner
          </span>
        );
      case 'Intermediate':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            Intermediate
          </span>
        );
      case 'Advanced':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">
            Advanced
          </span>
        );
      default:
        return null;
    }
  };

  const filteredTopics = topics.filter(t => {
    if (filterDifficulty === 'all') return true;
    return t.difficulty.toLowerCase() === filterDifficulty.toLowerCase();
  });

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* 1. LeetCode-style Summary Banner */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[16px] p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Left: Circular overall progress */}
          <div className="flex items-center gap-5">
            <div className="relative w-18 h-18 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[var(--color-base)] stroke-current"
                  strokeWidth="3.5"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[var(--color-accent-deep)] stroke-current transition-all duration-700 ease-out"
                  strokeDasharray={`${overallPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="font-display text-[17px] font-bold text-[var(--color-text)] leading-none">
                  {completedAll}
                </span>
                <span className="text-[9px] font-medium text-[var(--color-text)]/50 uppercase">
                  /{totalAll}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-[20px] font-bold text-[var(--color-text)] m-0">
                  Concept Mastery
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--color-accent-light)] text-[var(--color-accent-deep)]">
                  {overallPercent}% Complete
                </span>
              </div>
              <p className="text-[13px] text-[var(--color-text)]/65 m-0 mt-1">
                Progress across foundational physics and quantum algorithms
              </p>
            </div>
          </div>

          {/* Right: Difficulty Tier Breakdown Bars */}
          <div className="flex-1 max-w-md grid grid-cols-3 gap-3">
            
            {/* Beginner */}
            <div className="bg-[var(--color-base)] border border-[var(--color-border)] rounded-xl p-3 flex flex-col justify-between">
              <div className="flex justify-between items-center text-[12px] font-medium text-[var(--color-accent-deep)] mb-1">
                <span>Beginner</span>
                <span className="font-mono font-semibold">{completedEasy}/{totalEasy}</span>
              </div>
              <div className="w-full h-1.5 bg-[var(--color-border)]/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--color-accent-deep)] rounded-full transition-all"
                  style={{ width: `${totalEasy > 0 ? (completedEasy / totalEasy) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Intermediate */}
            <div className="bg-[var(--color-base)] border border-[var(--color-border)] rounded-xl p-3 flex flex-col justify-between">
              <div className="flex justify-between items-center text-[12px] font-medium text-amber-800 mb-1">
                <span>Medium</span>
                <span className="font-mono font-semibold">{completedMed}/{totalMed}</span>
              </div>
              <div className="w-full h-1.5 bg-[var(--color-border)]/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-600 rounded-full transition-all"
                  style={{ width: `${totalMed > 0 ? (completedMed / totalMed) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Advanced */}
            <div className="bg-[var(--color-base)] border border-[var(--color-border)] rounded-xl p-3 flex flex-col justify-between">
              <div className="flex justify-between items-center text-[12px] font-medium text-purple-800 mb-1">
                <span>Advanced</span>
                <span className="font-mono font-semibold">{completedHard}/{totalHard}</span>
              </div>
              <div className="w-full h-1.5 bg-[var(--color-border)]/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 rounded-full transition-all"
                  style={{ width: `${totalHard > 0 ? (completedHard / totalHard) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 2. Topics Filter Tabs */}
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-display text-[18px] font-semibold text-[var(--color-text)] m-0">
          Topics & Modules
        </h3>
        
        <div className="flex items-center gap-1 bg-[var(--color-card)] border border-[var(--color-border)] p-1 rounded-lg text-[12px] font-medium">
          {['all', 'beginner', 'intermediate', 'advanced'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterDifficulty(lvl)}
              className={`px-3 py-1 rounded-md capitalize transition-colors border-none cursor-pointer ${
                filterDifficulty === lvl
                  ? 'bg-[var(--color-base)] font-semibold text-[var(--color-text)] shadow-2xs'
                  : 'bg-transparent text-[var(--color-text)]/60 hover:text-[var(--color-text)]'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Topic Cards List */}
      <div className="flex flex-col gap-4">
        {filteredTopics.map((topic) => {
          const totalInTopic = topic.modules.length;
          const completedInTopic = topic.modules.filter(m => m.status === 'completed').length;
          const topicPercent = totalInTopic > 0 ? Math.round((completedInTopic / totalInTopic) * 100) : 0;
          const isExpanded = !!expandedTopics[topic.id];

          return (
            <div
              key={topic.id}
              className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[14px] overflow-hidden transition-all"
            >
              {/* Topic Header Summary Bar */}
              <div
                onClick={() => toggleTopic(topic.id)}
                className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-[var(--color-base)]/40 transition-colors select-none"
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[var(--color-base)] border border-[var(--color-border)] flex items-center justify-center font-display font-bold text-[14px] text-[var(--color-accent-deep)] shrink-0">
                    {completedInTopic === totalInTopic ? '✓' : `${completedInTopic}/${totalInTopic}`}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <h4 className="font-display text-[16px] font-semibold text-[var(--color-text)] m-0 truncate">
                        {topic.title}
                      </h4>
                      {getDifficultyBadge(topic.difficulty)}
                    </div>
                    <p className="text-[13px] text-[var(--color-text)]/65 m-0 line-clamp-1">
                      {topic.description}
                    </p>
                  </div>
                </div>

                {/* Progress bar + Expand chevron */}
                <div className="flex items-center gap-4 shrink-0 self-end sm:self-center">
                  <div className="w-28 sm:w-36 flex flex-col gap-1">
                    <div className="flex justify-between text-[11px] font-medium text-[var(--color-text)]/60">
                      <span>{completedInTopic}/{totalInTopic} Modules</span>
                      <span className="font-mono font-semibold text-[var(--color-accent-deep)]">{topicPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--color-base)] border border-[var(--color-border)]/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--color-accent-deep)] rounded-full transition-all duration-300"
                        style={{ width: `${topicPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  <span className="text-[var(--color-text)]/50 hover:text-[var(--color-text)] p-1">
                    <IconChevronDown isOpen={isExpanded} />
                  </span>
                </div>
              </div>

              {/* Expandable Module Sub-Items */}
              {isExpanded && (
                <div className="border-t border-[var(--color-border)]/70 bg-[var(--color-base)] divide-y divide-[var(--color-border)]/50">
                  {topic.modules.map((mod) => (
                    <div
                      key={mod.id}
                      className="px-4 md:px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-[var(--color-card)]/40 transition-colors group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Status Icon */}
                        <button
                          onClick={() => {
                            const next = mod.status === 'completed' ? 'in-progress' : mod.status === 'in-progress' ? 'not-started' : 'completed';
                            updateModuleStatus(mod.id, next);
                          }}
                          title={`Click to cycle status: ${mod.status}`}
                          className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all cursor-pointer shrink-0 ${
                            mod.status === 'completed'
                              ? 'bg-[var(--color-accent-deep)] border-[var(--color-accent-deep)] text-white'
                              : mod.status === 'in-progress'
                              ? 'bg-[var(--color-accent-light)] border-[var(--color-accent-deep)]'
                              : 'bg-transparent border-[var(--color-border)] hover:border-[var(--color-accent-deep)]'
                          }`}
                        >
                          {mod.status === 'completed' && <IconCheck />}
                          {mod.status === 'in-progress' && <div className="w-1.5 h-1.5 bg-[var(--color-accent-deep)] rounded-full animate-ping"></div>}
                        </button>

                        <div className="flex flex-col min-w-0">
                          <span className={`text-[14px] font-medium truncate ${
                            mod.status === 'completed'
                              ? 'text-[var(--color-text)]'
                              : mod.status === 'in-progress'
                              ? 'text-[var(--color-text)] font-semibold'
                              : 'text-[var(--color-text)]/70'
                          }`}>
                            {mod.title}
                          </span>
                          <div className="flex items-center gap-2 text-[11px] text-[var(--color-text)]/50 mt-0.5">
                            <span>{mod.difficulty}</span>
                            {mod.timeSpent && <span>• {mod.timeSpent} spent</span>}
                            {mod.score && <span className="text-[var(--color-accent-deep)] font-medium">• Quiz: {mod.score}%</span>}
                          </div>
                        </div>
                      </div>

                      {/* Navigation Action Button */}
                      <a
                        href={`/lesson/${mod.id}`}
                        className="px-3.5 py-1.5 text-[12px] font-medium rounded-full border border-[var(--color-border)] bg-[var(--color-card)] group-hover:bg-[var(--color-action)] group-hover:text-white group-hover:border-[var(--color-action)] transition-all no-underline text-[var(--color-text)] shrink-0"
                      >
                        {mod.status === 'completed' ? 'Review Lesson →' : mod.status === 'in-progress' ? 'Continue →' : 'Start Lesson →'}
                      </a>
                    </div>
                  ))}
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
