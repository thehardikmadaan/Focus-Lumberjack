import { type TimerStatus, type TimerPhase, useAppStore } from '../store/useAppStore';

interface SceneProps {
  status: TimerStatus;
  phase: TimerPhase;
}

export function Scene({ status, phase }: SceneProps) {
  const { stats } = useAppStore();

  // Determine if we are focusing
  const isFocusing = phase === 'focus';
  const isChopping = isFocusing && status === 'running';
  const isPaused = status === 'paused';
  const isResting = !isFocusing;

  // Calculate wood progression
  // 1 log per 25 minutes of focus time
  const totalLogs = Math.floor(stats.totalFocusSeconds / (25 * 60));

  // Progression Logic:
  // Clearing: 0–4 logs
  // Campsite: 5–19 logs
  // Cabin: 20–49 logs
  // Homestead: 50–119 logs
  // Village: 120+ logs
  const getStage = () => {
    if (totalLogs >= 120) return 'Village';
    if (totalLogs >= 50) return 'Homestead';
    if (totalLogs >= 20) return 'Cabin';
    if (totalLogs >= 5) return 'Campsite';
    return 'Clearing';
  };

  const stage = getStage();

  const getCharacterSprite = () => {
    // We'll use the 'chop-strike.svg' as the base for the smooth animation
    // because it has the arms extended, making it easier to rotate cleanly.
    if (isResting) return '/assets/Character/idle.svg';
    if (isPaused) return '/assets/Character/idle.svg';
    if (isFocusing && !isChopping) return '/assets/Character/idle.svg';
    return '/assets/Character/chop-strike.svg';
  };

  return (
    <div className={`relative w-full max-w-lg aspect-video rounded-xl mx-auto flex items-end justify-center transition-colors duration-1000`}>
      <div className="relative z-10 flex items-end justify-center w-full h-full pb-6">

        {/* Village Progression Render using downloaded assets */}
        <div className="absolute bottom-6 left-8 flex items-end">
          {stage === 'Campsite' && (
             <img src="/assets/woodpile-small.svg" className="w-24 h-auto drop-shadow-lg" alt="Campsite Woodpile" />
          )}
          {['Cabin', 'Homestead', 'Village'].includes(stage) && (
             <img src="/assets/woodpile-large.svg" className="w-40 h-auto drop-shadow-lg" alt="Village Woodpile" />
          )}
        </div>

        {/* Environmental Props */}
        {isFocusing && (
          <div className="relative mr-8">
             <img src="/assets/standing-tree.svg" className="w-40 h-auto drop-shadow-xl z-20 relative" alt="Target Tree" />
             {/* Axe hit effect overlay */}
             {isChopping && (
               <div className="absolute top-[40%] left-6 w-8 h-2 bg-white/80 rounded animate-[ping_1s_infinite_ease-out] z-30 mix-blend-overlay" />
             )}
          </div>
        )}

        {isResting && (
          <div className="relative mr-12 bottom-0 flex flex-col items-center">
            <img src="/assets/campfire.svg" className="w-32 h-auto drop-shadow-2xl opacity-90" alt="Campfire" />
          </div>
        )}

        {/* Character Sprite Render */}
        <div className="relative w-40 h-40 flex flex-col items-center justify-end -ml-4 z-30">
            <img
              src={getCharacterSprite()!}
              className={`w-full h-full object-contain drop-shadow-xl origin-[50%_80%] ${isChopping ? 'animate-[smoothSwing_1.2s_ease-in-out_infinite]' : ''}`}
              alt="Lumberjack"
            />
        </div>
      </div>

      <style>{`
        @keyframes smoothSwing {
          /* Physics-based swing:
             0% - Rest/start
             30% - Wind up (pull back slowly)
             45% - Strike (fast downward arc)
             55% - Recoil (bounce off wood)
             100% - Recover back to start
          */
          0% { transform: rotate(0deg) translateX(0px); }
          30% { transform: rotate(25deg) translateX(10px) translateY(-5px); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
          45% { transform: rotate(-15deg) translateX(-15px) translateY(5px); animation-timing-function: ease-out; }
          55% { transform: rotate(-5deg) translateX(-5px) translateY(2px); animation-timing-function: ease-in-out; }
          100% { transform: rotate(0deg) translateX(0px); }
        }
      `}</style>
    </div>
  );
}
