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
    if (isResting) return '/assets/Character/idle.svg';
    if (isPaused) return '/assets/Character/idle.svg';
    if (isFocusing && !isChopping) return '/assets/Character/idle.svg';
    return null; // CSS animation handles the chopping state
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
             <img src="/assets/standing-tree.svg" className="w-40 h-auto drop-shadow-xl" alt="Target Tree" />
             {/* Axe hit effect overlay */}
             {isChopping && (
               <div className="absolute top-1/2 left-4 w-4 h-1 bg-storybook-ochre rounded animate-[ping_1s_infinite]" />
             )}
          </div>
        )}

        {isResting && (
          <div className="relative mr-12 bottom-0 flex flex-col items-center">
            <img src="/assets/campfire.svg" className="w-32 h-auto drop-shadow-2xl opacity-90" alt="Campfire" />
          </div>
        )}

        {/* Character Sprite Render */}
        <div className="relative w-40 h-40 flex flex-col items-center justify-end -ml-4">
            {isChopping ? (
                // CSS toggle for chopping animation frames
                <div className="w-full h-full relative">
                    <img src="/assets/Character/chop-windup.svg" className="absolute inset-0 w-full h-full object-contain animate-[chopFrame_1s_steps(1,end)_infinite]" />
                    <img src="/assets/Character/chop-strike.svg" className="absolute inset-0 w-full h-full object-contain opacity-0 animate-[chopFrameStrike_1s_steps(1,end)_infinite]" />
                </div>
            ) : (
                <img src={getCharacterSprite()!} className="w-full h-full object-contain drop-shadow-xl" alt="Lumberjack" />
            )}
        </div>
      </div>

      <style>{`
        @keyframes chopFrame {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes chopFrameStrike {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
