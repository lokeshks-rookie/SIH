import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useProgressStore } from '../../stores/useProgressStore';

export default function TestHistoryChart() {
  const { testHistory, getWeakTopics, submitTestResult } = useProgressStore();
  const [timeframe, setTimeframe] = useState('weekly'); // 'weekly' or 'monthly'
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all'); // 'all', 'quiz', 'challenge'
  const [retryingTopic, setRetryingTopic] = useState(null);
  const [retryFeedback, setRetryFeedback] = useState(null);

  const weakTopics = getWeakTopics();

  // Format chart data based on weekly or monthly timeframe
  const chartData = useMemo(() => {
    if (!testHistory || testHistory.length === 0) return [];

    // Chronological order for chart
    const reversed = [...testHistory].reverse();

    if (timeframe === 'weekly') {
      return reversed.slice(-7).map((item, index) => ({
        name: `Test ${index + 1}`,
        date: item.date.slice(5), // MM-DD
        score: Math.round((item.score / item.maxScore) * 100),
        title: item.title,
        passed: item.passed
      }));
    } else {
      return reversed.map((item, index) => ({
        name: item.date.slice(5),
        date: item.date,
        score: Math.round((item.score / item.maxScore) * 100),
        title: item.title,
        passed: item.passed
      }));
    }
  }, [testHistory, timeframe]);

  // Average score & pass rate
  const avgScore = useMemo(() => {
    if (!testHistory || testHistory.length === 0) return 0;
    const sum = testHistory.reduce((acc, t) => acc + ((t.score / t.maxScore) * 100), 0);
    return Math.round(sum / testHistory.length);
  }, [testHistory]);

  const passRate = useMemo(() => {
    if (!testHistory || testHistory.length === 0) return 0;
    const passed = testHistory.filter(t => t.passed).length;
    return Math.round((passed / testHistory.length) * 100);
  }, [testHistory]);

  // Filtered test history table rows
  const filteredHistory = useMemo(() => {
    return testHistory.filter(item => {
      if (selectedTypeFilter === 'all') return true;
      return item.type === selectedTypeFilter;
    });
  }, [testHistory, selectedTypeFilter]);

  const handleRetakeQuiz = (weak) => {
    setRetryingTopic(weak.topic);
    setTimeout(() => {
      // Simulate successful retake with improved score
      submitTestResult({
        title: `${weak.topic} Mastery Retake`,
        topic: weak.topic,
        type: 'quiz',
        difficulty: 'Intermediate',
        score: 95,
        maxScore: 100,
        timeTaken: '4m 10s',
        weakPoints: []
      });
      setRetryingTopic(null);
      setRetryFeedback(`🎉 Retake complete for ${weak.topic}! Score updated to 95%.`);
      setTimeout(() => setRetryFeedback(null), 4000);
    }, 1000);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[var(--color-structural-dark)] text-white text-[12px] p-2.5 rounded-lg shadow-lg border border-white/10">
          <p className="font-semibold text-white m-0">{data.title}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-white/70">Score:</span>
            <span className="font-mono font-bold text-[var(--color-accent-light)]">{data.score}%</span>
            <span className={`px-1.5 py-0.2 text-[10px] rounded ${data.passed ? 'bg-emerald-900 text-emerald-300' : 'bg-rose-900 text-rose-300'}`}>
              {data.passed ? 'Passed' : 'Failed'}
            </span>
          </div>
          <p className="text-[10px] text-white/50 m-0 mt-0.5">Date: {data.date}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Retake feedback toast */}
      {retryFeedback && (
        <div className="p-3.5 bg-[var(--color-accent-light)] border border-[var(--color-accent-deep)]/30 text-[var(--color-accent-deep)] text-[13px] font-medium rounded-xl flex items-center justify-between">
          <span>{retryFeedback}</span>
          <button onClick={() => setRetryFeedback(null)} className="text-[var(--color-accent-deep)] hover:opacity-75 bg-transparent border-none cursor-pointer">✕</button>
        </div>
      )}

      {/* 1. Performance Trend Chart Card */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[16px] p-5 md:p-6 flex flex-col gap-6">
        
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-[18px] font-semibold text-[var(--color-text)] m-0">
              Performance & Score Trajectory
            </h3>
            <p className="text-[13px] text-[var(--color-text)]/65 m-0 mt-0.5">
              Historical accuracy trend across assessments and algorithmic challenges
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Aggregate Stats */}
            <div className="hidden md:flex items-center gap-4 text-[12px] border-r border-[var(--color-border)] pr-4">
              <div>
                <span className="text-[var(--color-text)]/50">Avg Score: </span>
                <strong className="text-[var(--color-accent-deep)] font-mono text-[14px]">{avgScore}%</strong>
              </div>
              <div>
                <span className="text-[var(--color-text)]/50">Pass Rate: </span>
                <strong className="text-[var(--color-accent-deep)] font-mono text-[14px]">{passRate}%</strong>
              </div>
            </div>

            {/* Timeframe Toggle */}
            <div className="flex items-center gap-1 bg-[var(--color-base)] border border-[var(--color-border)] p-0.5 rounded-lg text-[12px] font-medium">
              <button
                onClick={() => setTimeframe('weekly')}
                className={`px-3 py-1 rounded-md transition-colors border-none cursor-pointer ${
                  timeframe === 'weekly'
                    ? 'bg-[var(--color-card)] font-semibold text-[var(--color-text)] shadow-2xs'
                    : 'bg-transparent text-[var(--color-text)]/60 hover:text-[var(--color-text)]'
                }`}
              >
                Recent
              </button>
              <button
                onClick={() => setTimeframe('monthly')}
                className={`px-3 py-1 rounded-md transition-colors border-none cursor-pointer ${
                  timeframe === 'monthly'
                    ? 'bg-[var(--color-card)] font-semibold text-[var(--color-text)] shadow-2xs'
                    : 'bg-transparent text-[var(--color-text)]/60 hover:text-[var(--color-text)]'
                }`}
              >
                All Time
              </button>
            </div>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="w-full h-[220px] pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-accent-deep)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--color-accent-deep)" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} opacity={0.6} />
              <XAxis
                dataKey="date"
                tick={{ fill: 'var(--color-text)', fontSize: 11, opacity: 0.6 }}
                axisLine={{ stroke: 'var(--color-border)' }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: 'var(--color-text)', fontSize: 11, opacity: 0.6 }}
                axisLine={{ stroke: 'var(--color-border)' }}
                tickLine={false}
                ticks={[0, 25, 50, 75, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="score"
                stroke="var(--color-accent-deep)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#scoreGradient)"
                activeDot={{ r: 5, fill: 'var(--color-accent-deep)', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* 2. Weak Topics Spotlight ("Areas for Growth") */}
      {weakTopics && weakTopics.length > 0 && (
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-[16px] p-5 md:p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-amber-700">⚠️</span>
            <h4 className="font-display text-[16px] font-bold text-amber-900 m-0">
              Areas for Growth (Based on Recent Test Mistakes)
            </h4>
          </div>
          <p className="text-[13px] text-amber-800/80 m-0 mb-4 leading-relaxed">
            Our AI diagnostic identified low accuracy on the following quantum topics. Review the theory or retake the targeted quiz to reinforce retention.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {weakTopics.map((weak, idx) => (
              <div
                key={idx}
                className="bg-white/90 border border-amber-200 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-[14px] text-[var(--color-text)]">
                      {weak.topic}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-rose-50 text-rose-700 border border-rose-200">
                      {weak.accuracy}% Accuracy
                    </span>
                  </div>

                  {weak.weakPoints && weak.weakPoints.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {weak.weakPoints.map((pt, pIdx) => (
                        <span key={pIdx} className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-100/70 text-amber-900">
                          Needs Review: {pt}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-amber-100">
                  <button
                    onClick={() => handleRetakeQuiz(weak)}
                    disabled={retryingTopic === weak.topic}
                    className="flex-1 py-1.5 px-3 bg-[var(--color-action)] text-white hover:bg-[var(--color-accent-deep)] rounded-lg text-[12px] font-semibold transition-colors cursor-pointer border-none text-center"
                  >
                    {retryingTopic === weak.topic ? 'Generating Quiz...' : 'Retake Assessment →'}
                  </button>
                  <a
                    href="/lesson/10"
                    className="py-1.5 px-3 bg-[var(--color-card)] hover:bg-[var(--color-base)] text-[var(--color-text)] border border-[var(--color-border)] rounded-lg text-[12px] font-medium no-underline transition-colors text-center"
                  >
                    Review Lesson
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Past Daily Tests and Challenges Log Table */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[16px] p-5 md:p-6 flex flex-col gap-4">
        
        {/* Table Controls Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[var(--color-border)]/60">
          <div>
            <h4 className="font-display text-[17px] font-semibold text-[var(--color-text)] m-0">
              Assessment & Challenge History Log
            </h4>
            <p className="text-[13px] text-[var(--color-text)]/65 m-0 mt-0.5">
              Detailed breakdown of scores, duration, and completion status
            </p>
          </div>

          <div className="flex items-center gap-1 bg-[var(--color-base)] border border-[var(--color-border)] p-1 rounded-lg text-[12px] font-medium">
            {[
              { id: 'all', label: 'All History' },
              { id: 'quiz', label: 'Quizzes' },
              { id: 'challenge', label: 'Challenges' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTypeFilter(tab.id)}
                className={`px-3 py-1 rounded-md transition-colors border-none cursor-pointer ${
                  selectedTypeFilter === tab.id
                    ? 'bg-[var(--color-card)] font-semibold text-[var(--color-text)] shadow-2xs'
                    : 'bg-transparent text-[var(--color-text)]/60 hover:text-[var(--color-text)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto algorithm-scroll">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[12px] uppercase font-semibold text-[var(--color-text)]/60">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Assessment / Challenge</th>
                <th className="py-2.5 px-3 hidden md:table-cell">Topic</th>
                <th className="py-2.5 px-3">Difficulty</th>
                <th className="py-2.5 px-3 text-right">Score</th>
                <th className="py-2.5 px-3 hidden sm:table-cell text-right">Time</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]/50">
              {filteredHistory.map((item) => (
                <tr key={item.id} className="hover:bg-[var(--color-base)]/60 transition-colors group">
                  <td className="py-3 px-3 font-mono text-[12px] text-[var(--color-text)]/70 whitespace-nowrap">
                    {item.date}
                  </td>
                  <td className="py-3 px-3 font-medium text-[var(--color-text)]">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px]">
                        {item.type === 'challenge' ? '⚡' : '📝'}
                      </span>
                      <span>{item.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[var(--color-text)]/70 hidden md:table-cell">
                    <span className="line-clamp-1">{item.topic}</span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      item.difficulty === 'Beginner'
                        ? 'bg-[var(--color-accent-light)] text-[var(--color-accent-deep)]'
                        : item.difficulty === 'Intermediate'
                        ? 'bg-amber-50 text-amber-800'
                        : 'bg-purple-50 text-purple-800'
                    }`}>
                      {item.difficulty}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <span className={`font-mono font-semibold px-2 py-0.5 rounded text-[12px] ${
                      item.passed
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {item.score}/{item.maxScore} ({Math.round((item.score / item.maxScore) * 100)}%)
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-[12px] text-[var(--color-text)]/60 hidden sm:table-cell whitespace-nowrap">
                    {item.timeTaken}
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleRetakeQuiz({ topic: item.topic })}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-[var(--color-base)] hover:bg-[var(--color-action)] hover:text-white border border-[var(--color-border)] rounded-full transition-colors cursor-pointer"
                    >
                      {item.passed ? 'Review' : 'Retry'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
