import { useTimer } from '../lib/useTimer';
import { Play, Pause, Square, SkipForward } from 'lucide-react';
import { PipButton } from './PipButton';

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
    <div className="relative flex flex-col items-center p-6 w-full max-w-lg mx-auto">
      <div className="absolute top-0 right-0">
        <PipButton />
      </div>
      <div className="text-sm font-bold text-storybook-rust-base uppercase tracking-wider mb-2 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">
        {phaseLabels[timerPhase]} • Cycle {currentCycle}
      </div>

      <div className="text-7xl font-black text-storybook-forest-dark tabular-nums tracking-tighter mb-6 drop-shadow-[0_2px_10px_rgba(255,255,255,0.6)]">
        {timeString}
      </div>

      <div className="flex items-center gap-4">
        {timerStatus !== 'running' ? (
          <button
            onClick={startTimer}
            className="flex items-center justify-center w-16 h-16 bg-storybook-forest-base text-amber-50 rounded-full hover:bg-storybook-forest-light active:scale-95 transition-all shadow-xl border-2 border-storybook-forest-dark"
            aria-label="Start Timer"
          >
            <Play className="w-8 h-8 ml-1" fill="currentColor" />
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="flex items-center justify-center w-16 h-16 bg-storybook-rust-base text-amber-50 rounded-full hover:bg-storybook-rust-light active:scale-95 transition-all shadow-xl border-2 border-storybook-forest-dark"
            aria-label="Pause Timer"
          >
            <Pause className="w-8 h-8" fill="currentColor" />
          </button>
        )}

        {timerStatus !== 'idle' && (
           <button
            onClick={stopTimer}
            className="flex items-center justify-center w-12 h-12 bg-storybook-teal-light text-amber-50 rounded-full hover:bg-storybook-teal-base active:scale-95 transition-all shadow-lg border-2 border-storybook-forest-dark"
            aria-label="Stop Timer"
          >
            <Square className="w-5 h-5" fill="currentColor" />
          </button>
        )}

        <button
          onClick={skipPhase}
          className="flex items-center justify-center w-12 h-12 bg-amber-200 text-storybook-forest-dark rounded-full hover:bg-amber-300 active:scale-95 transition-all shadow-lg border-2 border-storybook-forest-dark"
          aria-label="Skip Phase"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
