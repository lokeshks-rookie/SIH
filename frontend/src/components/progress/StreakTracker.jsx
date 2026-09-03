import React, { useState } from 'react';
import { useProgressStore, getTodayDateStr } from '../../stores/useProgressStore';

export default function StreakTracker() {
  const {
    currentStreak,
    longestStreak,
    freezePassesAvailable,
    freezePassesTotal,
    lastActiveDate,
    recordActivity,
    useStreakFreezePass
  } = useProgressStore();

  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const todayStr = getTodayDateStr();
  const isActiveToday = lastActiveDate === todayStr;

  // Next milestone calculation (e.g. 7, 14, 30, 50, 100 days)
  const milestones = [7, 14, 30, 50, 100, 365];
  const nextMilestone = milestones.find(m => m > currentStreak) || (currentStreak + 10);
  const prevMilestone = milestones.slice().reverse().find(m => m <= currentStreak) || 0;
  const milestoneProgress = Math.min(100, Math.round(((currentStreak - prevMilestone) / (nextMilestone - prevMilestone)) * 100));

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSimulateStudy = () => {
    recordActivity({
      type: 'study',
      title: 'Practiced Quantum Superposition',
      score: '95%',
      xp: 30
    });
    showToast('✨ Practice logged! Streak updated.');
  };

  const handleUseFreeze = () => {
    if (freezePassesAvailable > 0) {
      useStreakFreezePass();
      showToast('❄️ Streak Freeze activated for protection!');
    }
  };

  return (
    <div className="w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-[16px] p-5 md:p-6 relative overflow-hidden transition-all">
      {/* Toast popup */}
      {toastMessage && (
        <div className="absolute top-3 right-4 z-30 px-3.5 py-1.5 bg-[var(--color-accent-deep)] text-white text-[13px] font-medium rounded-full shadow-md animate-bounce">
          {toastMessage}
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left: Main Streak Indicators */}
        <div className="flex flex-wrap items-center gap-6 md:gap-8">
          
          {/* Current Streak */}
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-[var(--color-base)] border border-[var(--color-border)] flex items-center justify-center text-2xl shadow-xs">
              🔥
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-[32px] font-bold text-[var(--color-text)] tracking-tight leading-none">
                  {currentStreak}
                </span>
                <span className="text-[14px] font-semibold text-[var(--color-text)] uppercase tracking-wide">
                  Days
                </span>
              </div>
              <p className="text-[12px] font-medium text-[var(--color-text)]/60 m-0 mt-0.5">
                Current Active Streak
              </p>
            </div>
          </div>

          <div className="hidden sm:block w-[1px] h-10 bg-[var(--color-border)]"></div>

          {/* Longest Streak Record */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[var(--color-base)] border border-[var(--color-border)] flex items-center justify-center text-xl">
              🏆
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-[22px] font-bold text-[var(--color-text)] leading-none">
                  {longestStreak}
                </span>
                <span className="text-[12px] font-semibold text-[var(--color-text)]/70 uppercase">
                  Days
                </span>
              </div>
              <p className="text-[12px] font-medium text-[var(--color-text)]/60 m-0 mt-0.5">
                All-time Longest Record
              </p>
            </div>
          </div>

          <div className="hidden sm:block w-[1px] h-10 bg-[var(--color-border)]"></div>

          {/* Streak Freeze Status */}
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => setShowFreezeModal(!showFreezeModal)}
              title="Click to view Streak Freeze info"
              className="w-11 h-11 rounded-xl bg-[var(--color-base)] border border-[var(--color-border)] hover:border-[var(--color-accent-deep)] flex items-center justify-center text-xl transition-colors cursor-pointer group"
            >
              ❄️
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display text-[18px] font-bold text-[var(--color-accent-deep)] leading-none">
                  {freezePassesAvailable}/{freezePassesTotal}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-accent-deep)] bg-[var(--color-accent-light)] px-1.5 py-0.5 rounded">
                  Freezes
                </span>
              </div>
              <button
                onClick={() => setShowFreezeModal(true)}
                className="text-[12px] font-medium text-[var(--color-text)]/60 hover:text-[var(--color-accent-deep)] underline decoration-dotted bg-transparent border-none p-0 cursor-pointer text-left mt-0.5"
              >
                Monthly Protection
              </button>
            </div>
          </div>

        </div>

        {/* Right: Milestone Progress & Today's Status */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-[var(--color-border)]/60">
          
          {/* Milestone bar */}
          <div className="min-w-[180px]">
            <div className="flex justify-between items-center text-[12px] font-medium mb-1.5 text-[var(--color-text)]/70">
              <span>Goal: {nextMilestone} Days</span>
              <span className="font-mono text-[11px] font-semibold text-[var(--color-accent-deep)]">{milestoneProgress}%</span>
            </div>
            <div className="w-full h-2 bg-[var(--color-base)] border border-[var(--color-border)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-accent-deep)] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${milestoneProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Today's Status Pill */}
          <div className="flex items-center gap-2">
            {isActiveToday ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-accent-light)] text-[var(--color-accent-deep)] rounded-full text-[12px] font-medium border border-[var(--color-accent-deep)]/20">
                <span className="w-2 h-2 rounded-full bg-[var(--color-accent-deep)]"></span>
                Active Today
              </div>
            ) : (
              <button
                onClick={handleSimulateStudy}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[var(--color-action)] text-white hover:bg-[var(--color-accent-deep)] rounded-full text-[12px] font-semibold transition-colors cursor-pointer border-none"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                Complete Activity Today
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Streak Freeze Info Modal */}
      {showFreezeModal && (
        <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-[var(--color-base)]/80 p-3.5 rounded-xl text-[13px]">
          <div className="flex items-start gap-2.5">
            <span className="text-lg">❄️</span>
            <div>
              <p className="font-semibold text-[var(--color-text)] m-0">Streak Freeze Protection</p>
              <p className="text-[var(--color-text)]/70 m-0 mt-0.5 leading-relaxed">
                You get 2 free passes per month. If you miss a calendar day of practice, a freeze pass automatically preserves your consecutive streak.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            {freezePassesAvailable > 0 && (
              <button
                onClick={handleUseFreeze}
                className="px-3 py-1 bg-[var(--color-card)] hover:bg-[var(--color-accent-light)] text-[var(--color-text)] border border-[var(--color-border)] rounded-full text-[12px] font-medium transition-colors cursor-pointer"
              >
                Reserve Pass
              </button>
            )}
            <button
              onClick={() => setShowFreezeModal(false)}
              className="px-3 py-1 bg-transparent hover:bg-[var(--color-card)] text-[var(--color-text)]/70 border border-transparent rounded-full text-[12px] cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
