import React, { useState, useMemo } from 'react';
import { useProgressStore, getTodayDateStr } from '../../stores/useProgressStore';

export default function HeatmapCalendar() {
  const { activityHistory } = useProgressStore();
  const [hoveredDay, setHoveredDay] = useState(null);
  const [selectedRange, setSelectedRange] = useState('6months'); // '6months' or 'year'

  // Generate calendar grid (weeks x 7 days)
  const { weeks, monthLabels, totalActivitiesCount, totalActiveDays } = useMemo(() => {
    const daysToShow = selectedRange === 'year' ? 364 : 182; // 52 or 26 weeks
    const today = new Date();
    const days = [];

    // Calculate start date so that the last day aligns with today
    // Align end to Saturday of current week to form complete columns
    const endDayOfWeek = today.getDay(); // 0 is Sunday
    const totalCells = Math.ceil((daysToShow + endDayOfWeek) / 7) * 7;
    
    let totalAct = 0;
    let activeDays = 0;

    for (let i = totalCells - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const isFuture = d > today;

      const record = activityHistory[dateStr] || { count: 0, activities: [] };
      const count = isFuture ? 0 : record.count;
      
      if (count > 0) {
        totalAct += count;
        activeDays += 1;
      }

      days.push({
        date: dateStr,
        dateObj: d,
        count,
        activities: record.activities || [],
        isFuture,
        dayOfWeek: d.getDay(), // 0 = Sun, 1 = Mon ...
        month: d.toLocaleString('default', { month: 'short' }),
        dayOfMonth: d.getDate()
      });
    }

    // Chunk into 7-day columns (weeks)
    const weekChunks = [];
    for (let i = 0; i < days.length; i += 7) {
      weekChunks.push(days.slice(i, i + 7));
    }

    // Build month labels with week index positions
    const mLabels = [];
    let lastMonth = '';
    weekChunks.forEach((week, wIndex) => {
      const firstDay = week[0];
      if (firstDay && firstDay.month !== lastMonth) {
        mLabels.push({ month: firstDay.month, weekIndex: wIndex });
        lastMonth = firstDay.month;
      }
    });

    return {
      weeks: weekChunks,
      monthLabels: mLabels,
      totalActivitiesCount: totalAct,
      totalActiveDays: activeDays
    };
  }, [activityHistory, selectedRange]);

  // Determine color level based on activity count (LeetCode activity heatmap green palette)
  const getColorClass = (count, isFuture) => {
    if (isFuture) return 'bg-transparent border-dashed border-[var(--color-border)]/40';
    if (!count || count === 0) return 'bg-[#ebedf0] border border-[var(--color-border)]/60';
    if (count === 1) return 'bg-[#9be9a8] border border-[#85df93]';
    if (count === 2) return 'bg-[#40c463] border border-[#36b658]';
    if (count === 3) return 'bg-[#30a14e] border border-[#288d44]';
    return 'bg-[#216e39] border border-[#1b5d30]';
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-[16px] p-5 md:p-6 flex flex-col gap-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[var(--color-border)]/60">
        <div>
          <h3 className="font-display text-[18px] font-semibold text-[var(--color-text)] m-0">
            Activity Heatmap
          </h3>
          <p className="text-[13px] text-[var(--color-text)]/65 m-0 mt-0.5">
            {totalActivitiesCount} learning activities across {totalActiveDays} active days
          </p>
        </div>

        {/* View Range Selector */}
        <div className="flex items-center gap-1 bg-[var(--color-base)] border border-[var(--color-border)] p-0.5 rounded-lg text-[12px] font-medium self-start sm:self-auto">
          <button
            onClick={() => setSelectedRange('6months')}
            className={`px-3 py-1 rounded-md transition-colors border-none cursor-pointer ${
              selectedRange === '6months'
                ? 'bg-[var(--color-card)] font-semibold text-[var(--color-text)] shadow-2xs'
                : 'bg-transparent text-[var(--color-text)]/60 hover:text-[var(--color-text)]'
            }`}
          >
            Past 6 Months
          </button>
          <button
            onClick={() => setSelectedRange('year')}
            className={`px-3 py-1 rounded-md transition-colors border-none cursor-pointer ${
              selectedRange === 'year'
                ? 'bg-[var(--color-card)] font-semibold text-[var(--color-text)] shadow-2xs'
                : 'bg-transparent text-[var(--color-text)]/60 hover:text-[var(--color-text)]'
            }`}
          >
            1 Year
          </button>
        </div>
      </div>

      {/* Heatmap Grid & Tooltip Area */}
      <div className="relative overflow-x-auto algorithm-scroll py-2">
        <div className="min-w-[680px] flex flex-col gap-1.5">
          
          {/* Month Labels */}
          <div className="flex text-[11px] text-[var(--color-text)]/60 font-medium pl-8 relative h-4">
            {monthLabels.map((lbl, idx) => (
              <span
                key={idx}
                className="absolute"
                style={{ left: `${32 + lbl.weekIndex * 15}px` }}
              >
                {lbl.month}
              </span>
            ))}
          </div>

          {/* Grid with Weekdays Column */}
          <div className="flex gap-1.5 items-start">
            
            {/* Weekday indicators (Mon, Wed, Fri) */}
            <div className="flex flex-col gap-[3px] text-[10px] text-[var(--color-text)]/50 font-medium pr-1 pt-[1px] select-none">
              <span className="h-[12px] leading-[12px]"></span>
              <span className="h-[12px] leading-[12px]">Mon</span>
              <span className="h-[12px] leading-[12px]"></span>
              <span className="h-[12px] leading-[12px]">Wed</span>
              <span className="h-[12px] leading-[12px]"></span>
              <span className="h-[12px] leading-[12px]">Fri</span>
              <span className="h-[12px] leading-[12px]"></span>
            </div>

            {/* Weeks Columns */}
            <div className="flex gap-[3px]">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-[3px]">
                  {week.map((day, dIdx) => (
                    <div
                      key={dIdx}
                      onMouseEnter={(e) => {
                        if (!day.isFuture) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setHoveredDay({ ...day, rect });
                        }
                      }}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`w-[12px] h-[12px] rounded-[2.5px] transition-transform hover:scale-125 cursor-pointer relative ${getColorClass(
                        day.count,
                        day.isFuture
                      )}`}
                    />
                  ))}
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Floating Tooltip */}
        {hoveredDay && (
          <div
            className="fixed z-50 bg-[var(--color-structural-dark)] text-white text-[12px] rounded-lg p-2.5 shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2 min-w-[200px] max-w-[260px]"
            style={{
              top: `${hoveredDay.rect.top - 8}px`,
              left: `${hoveredDay.rect.left + 6}px`
            }}
          >
            <div className="font-semibold text-white mb-1 flex items-center justify-between border-b border-white/20 pb-1">
              <span>{new Date(hoveredDay.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span className="text-[var(--color-accent-light)] font-mono">{hoveredDay.count} {hoveredDay.count === 1 ? 'task' : 'tasks'}</span>
            </div>
            {hoveredDay.activities && hoveredDay.activities.length > 0 ? (
              <ul className="m-0 p-0 pl-3 flex flex-col gap-1 text-[11px] text-white/85">
                {hoveredDay.activities.map((act, idx) => (
                  <li key={idx} className="leading-tight">
                    <span className="font-medium text-white">{act.title}</span>
                    {act.score && <span className="text-emerald-400 ml-1">({act.score})</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="m-0 text-[11px] text-white/60">No quantum activities recorded</p>
            )}
          </div>
        )}

      </div>

      {/* Footer / Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[var(--color-border)]/60 text-[12px] text-[var(--color-text)]/65">
        <div className="flex items-center gap-4">
          <span>Active Streak: <strong className="text-[var(--color-text)]">Active</strong></span>
          <span>Consistent Time: <strong className="text-[var(--color-text)]">Morning/Evening</strong></span>
        </div>

        {/* Intensity scale */}
        <div className="flex items-center gap-1.5 text-[11px]">
          <span>Less</span>
          <div className="w-[11px] h-[11px] rounded-[2px] bg-[#ebedf0] border border-[var(--color-border)]/60"></div>
          <div className="w-[11px] h-[11px] rounded-[2px] bg-[#9be9a8] border border-[#85df93]"></div>
          <div className="w-[11px] h-[11px] rounded-[2px] bg-[#40c463] border border-[#36b658]"></div>
          <div className="w-[11px] h-[11px] rounded-[2px] bg-[#30a14e] border border-[#288d44]"></div>
          <div className="w-[11px] h-[11px] rounded-[2px] bg-[#216e39] border border-[#1b5d30]"></div>
          <span>More</span>
        </div>
      </div>

    </div>
  );
}
