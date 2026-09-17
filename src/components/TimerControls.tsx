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
    <div className="flex flex-col items-center bg-amber-50/80 backdrop-blur p-6 rounded-2xl shadow-sm border-2 border-storybook-forest-dark mt-6 w-full max-w-lg mx-auto">
      <div className="text-sm font-bold text-storybook-rust-base uppercase tracking-wider mb-2">
        {phaseLabels[timerPhase]} • Cycle {currentCycle}
      </div>

      <div className="text-6xl font-black text-storybook-forest-dark tabular-nums tracking-tighter mb-8 drop-shadow-sm">
        {timeString}
      </div>

      <div className="flex items-center gap-4">
        {timerStatus !== 'running' ? (
          <button
            onClick={startTimer}
            className="flex items-center justify-center w-16 h-16 bg-storybook-forest-base text-amber-50 rounded-full hover:bg-storybook-forest-light active:scale-95 transition-all shadow-md border-2 border-storybook-forest-dark"
            aria-label="Start Timer"
          >
            <Play className="w-8 h-8 ml-1" fill="currentColor" />
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="flex items-center justify-center w-16 h-16 bg-storybook-rust-base text-amber-50 rounded-full hover:bg-storybook-rust-light active:scale-95 transition-all shadow-md border-2 border-storybook-forest-dark"
            aria-label="Pause Timer"
          >
            <Pause className="w-8 h-8" fill="currentColor" />
          </button>
        )}

        {timerStatus !== 'idle' && (
           <button
            onClick={stopTimer}
            className="flex items-center justify-center w-12 h-12 bg-storybook-teal-light text-amber-50 rounded-full hover:bg-storybook-teal-base active:scale-95 transition-all border-2 border-storybook-forest-dark"
            aria-label="Stop Timer"
          >
            <Square className="w-5 h-5" fill="currentColor" />
          </button>
        )}

        <button
          onClick={skipPhase}
          className="flex items-center justify-center w-12 h-12 bg-amber-200 text-storybook-forest-dark rounded-full hover:bg-amber-300 active:scale-95 transition-all border-2 border-storybook-forest-dark"
          aria-label="Skip Phase"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
