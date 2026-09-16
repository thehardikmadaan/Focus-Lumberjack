import { useTimer } from '../lib/useTimer';
import { Play, Pause, Square, SkipForward } from 'lucide-react';

export function TimerControls() {
  const {
    timeLeft,
    timerPhase,
    timerStatus,
    currentCycle,
    startTimer,
    pauseTimer,
    stopTimer,
    skipPhase,
  } = useTimer();

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const phaseLabels = {
    focus: 'Focus',
    short_break: 'Short Break',
    long_break: 'Long Break',
  };

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mt-6 w-full max-w-lg mx-auto">
      <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
        {phaseLabels[timerPhase]} • Cycle {currentCycle}
      </div>

      <div className="text-6xl font-black text-slate-800 tabular-nums tracking-tighter mb-8">
        {timeString}
      </div>

      <div className="flex items-center gap-4">
        {timerStatus !== 'running' ? (
          <button
            onClick={startTimer}
            className="flex items-center justify-center w-16 h-16 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 active:scale-95 transition-all shadow-md"
            aria-label="Start Timer"
          >
            <Play className="w-8 h-8 ml-1" fill="currentColor" />
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="flex items-center justify-center w-16 h-16 bg-amber-500 text-white rounded-full hover:bg-amber-600 active:scale-95 transition-all shadow-md"
            aria-label="Pause Timer"
          >
            <Pause className="w-8 h-8" fill="currentColor" />
          </button>
        )}

        {timerStatus !== 'idle' && (
           <button
            onClick={stopTimer}
            className="flex items-center justify-center w-12 h-12 bg-slate-200 text-slate-700 rounded-full hover:bg-slate-300 active:scale-95 transition-all"
            aria-label="Stop Timer"
          >
            <Square className="w-5 h-5" fill="currentColor" />
          </button>
        )}

        <button
          onClick={skipPhase}
          className="flex items-center justify-center w-12 h-12 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 active:scale-95 transition-all"
          aria-label="Skip Phase"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
