import React, { useState, useEffect } from 'react';
import { useProgressStore } from '../../stores/useProgressStore';

export default function ChallengeCard() {
  const { todayChallenge, completeDailyChallenge, currentStreak } = useProgressStore();
  const [timeLeft, setTimeLeft] = useState({ hours: '00', minutes: '00', seconds: '00' });
  const [isSolving, setIsSolving] = useState(false);

  // Countdown timer to midnight local time
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0); // Next midnight
      const diffMs = tomorrow - now;

      if (diffMs <= 0) {
        return { hours: '00', minutes: '00', seconds: '00' };
      }

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      return {
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0')
      };
    };

    setTimeLeft(calculateTimeRemaining());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSimulateSolve = () => {
    setIsSolving(true);
    setTimeout(() => {
      completeDailyChallenge();
      setIsSolving(false);
    }, 600);
  };

  return (
    <div className="w-full bg-[var(--color-structural-dark)] text-white rounded-[16px] p-6 md:p-8 relative overflow-hidden border border-white/10 shadow-sm">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-[260px] h-[260px] bg-[var(--color-accent-deep)] opacity-60 rounded-full blur-[80px] pointer-events-none -translate-y-1/3 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-[180px] h-[180px] bg-white/5 rounded-full blur-[60px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        
        {/* Left Info Column */}
        <div className="flex-1 max-w-2xl">
          
          {/* Header Strip with Tags and Countdown */}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Today's Challenge
            </span>

            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-500/30">
              {todayChallenge.difficulty}
            </span>

            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/10 text-white/90">
              +{todayChallenge.rewardXp} XP Reward
            </span>
          </div>

          <h2 className="font-display text-[24px] md:text-[28px] font-bold text-white mb-2 leading-tight">
            {todayChallenge.title}
          </h2>

          <p className="text-[14px] md:text-[15px] text-white/80 leading-relaxed mb-5">
            {todayChallenge.description}
          </p>

          {/* Tags & Time estimate */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-[12px] text-white/60 font-medium">⏱ Est. {todayChallenge.estimatedTime}</span>
            <span className="text-white/30">•</span>
            {todayChallenge.tags.map((tag, i) => (
              <span key={i} className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/80">
                #{tag}
              </span>
            ))}
          </div>

          {/* Streak Boost Note */}
          <div className="flex items-center gap-2 text-[13px] text-emerald-300/90 font-medium">
            <span>🔥</span>
            <span>Completing today's challenge locks in your <strong>{currentStreak + 1}-day streak</strong>!</span>
          </div>

        </div>

        {/* Right CTA & Countdown Box */}
        <div className="flex flex-col items-center sm:items-end gap-5 shrink-0">
          
          {/* Countdown timer */}
          <div className="bg-black/40 border border-white/10 rounded-xl p-3.5 flex flex-col items-center sm:items-end">
            <span className="text-[11px] text-white/60 uppercase font-semibold tracking-wider mb-1">
              Resets In
            </span>
            <div className="flex items-center gap-1.5 font-mono text-[18px] font-bold text-white">
              <span className="px-2 py-1 bg-white/10 rounded">{timeLeft.hours}h</span>
              <span>:</span>
              <span className="px-2 py-1 bg-white/10 rounded">{timeLeft.minutes}m</span>
              <span>:</span>
              <span className="px-2 py-1 bg-white/10 rounded text-emerald-400">{timeLeft.seconds}s</span>
            </div>
          </div>

          {/* Action Button */}
          {todayChallenge.completed ? (
            <div className="flex items-center gap-2 px-6 py-3 bg-emerald-950 border border-emerald-500/40 text-emerald-300 rounded-full text-[14px] font-semibold">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Challenge Completed (+{todayChallenge.rewardXp} XP)</span>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/circuit-builder"
                className="px-6 py-3 bg-white text-[var(--color-structural-dark)] hover:bg-[var(--color-accent-light)] rounded-full text-[14px] font-semibold transition-colors no-underline shadow-sm"
              >
                Solve in Circuit Builder →
              </a>
              <button
                onClick={handleSimulateSolve}
                disabled={isSolving}
                className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full text-[13px] font-medium border border-white/20 transition-colors cursor-pointer"
              >
                {isSolving ? 'Checking...' : 'Quick Verify'}
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
