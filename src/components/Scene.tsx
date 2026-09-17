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

  // Base background class determined by phase
  const backgroundClass = isFocusing ? 'bg-dusk-gradient' : 'bg-night-gradient';

  return (
    <div className={`relative w-full max-w-lg aspect-video ${backgroundClass} rounded-xl overflow-hidden border-4 border-storybook-forest-dark shadow-xl mx-auto flex items-end justify-center transition-colors duration-1000`}>

      {/* Background Placeholders (Replace with AI vectors later) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {/* Placeholder for noise/grain texture */}
        <div className="w-full h-full" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")', opacity: 0.15 }} />
      </div>

      {/* Distant Trees/Mountains Silhouette (Focus) */}
      {isFocusing && (
        <div className="absolute bottom-1/4 w-full flex justify-around opacity-40">
           <div className="w-0 h-0 border-l-[40px] border-l-transparent border-b-[80px] border-b-storybook-forest-dark border-r-[40px] border-r-transparent" />
           <div className="w-0 h-0 border-l-[60px] border-l-transparent border-b-[120px] border-b-storybook-forest-dark border-r-[60px] border-r-transparent -ml-10" />
           <div className="w-0 h-0 border-l-[50px] border-l-transparent border-b-[100px] border-b-storybook-forest-dark border-r-[50px] border-r-transparent" />
        </div>
      )}

      {/* Sun/Moon */}
      <div className={`absolute top-6 right-8 w-12 h-12 rounded-full transition-all duration-1000 ${isResting ? 'bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.4)] translate-y-4' : 'bg-storybook-ochre shadow-[0_0_40px_rgba(217,160,91,0.6)]'}`} />

      {/* Ground/Forest Floor */}
      <div className={`absolute bottom-0 w-full h-1/4 ${isFocusing ? 'bg-storybook-forest-base' : 'bg-storybook-teal-dark'} border-t-2 ${isFocusing ? 'border-storybook-forest-light' : 'border-storybook-teal-base'} transition-colors duration-1000`} />

      <div className="relative z-10 flex items-end justify-center w-full h-full pb-6">

        {/* --- Environmental Props / Village Progression Placeholder --- */}

        {/* Village Progression Render */}
        <div className="absolute bottom-6 left-8 flex items-end">
          {stage === 'Clearing' && (
             <div className="flex flex-col items-center opacity-60">
                <div className="w-8 h-2 bg-storybook-forest-dark/30 rounded-full" />
                <span className="text-[10px] font-bold text-storybook-forest-dark mt-1">Clearing</span>
             </div>
          )}
          {stage === 'Campsite' && (
             <div className="flex flex-col items-center">
                {/* Tent placeholder */}
                <div className="w-0 h-0 border-l-[16px] border-l-transparent border-b-[24px] border-b-storybook-rust-base border-r-[16px] border-r-transparent relative">
                   <div className="absolute top-[8px] -left-[4px] w-0 h-0 border-l-[4px] border-l-transparent border-b-[16px] border-b-storybook-forest-dark border-r-[4px] border-r-transparent" />
                </div>
                <span className="text-[10px] font-bold text-storybook-forest-dark mt-1 bg-white/50 px-1 rounded">Campsite</span>
             </div>
          )}
          {stage === 'Cabin' && (
             <div className="flex flex-col items-center">
                {/* Cabin placeholder */}
                <div className="w-20 h-16 bg-storybook-wood border-2 border-storybook-forest-dark rounded-sm relative flex flex-col justify-end items-center pb-2">
                   <div className="absolute -top-6 -left-2 w-24 h-6 bg-storybook-rust-base border-2 border-storybook-forest-dark rounded-sm" />
                   <div className="w-4 h-6 bg-storybook-forest-dark rounded-t-sm" />
                </div>
                <span className="text-[10px] font-bold text-storybook-forest-dark mt-1 bg-white/50 px-1 rounded">Cabin</span>
             </div>
          )}
          {stage === 'Homestead' && (
             <div className="flex flex-col items-center">
                {/* Homestead placeholder */}
                <div className="flex items-end">
                  <div className="w-12 h-10 bg-storybook-rust-light border-2 border-storybook-forest-dark rounded-sm mb-0 -mr-2 relative z-0">
                      <div className="absolute -top-4 -left-1 w-14 h-4 bg-storybook-rust-base border-2 border-storybook-forest-dark rounded-sm" />
                  </div>
                  <div className="w-24 h-20 bg-storybook-wood border-2 border-storybook-forest-dark rounded-sm relative z-10 flex justify-center items-end pb-2">
                    <div className="absolute -top-8 -left-2 w-28 h-8 bg-storybook-rust-base border-2 border-storybook-forest-dark rounded-sm" />
                    <div className="w-6 h-8 bg-storybook-forest-dark rounded-t-sm" />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-storybook-forest-dark mt-1 bg-white/50 px-1 rounded">Homestead</span>
             </div>
          )}
          {stage === 'Village' && (
             <div className="flex flex-col items-center">
                {/* Village placeholder */}
                <div className="flex items-end gap-2">
                  <div className="w-16 h-12 bg-storybook-wood border-2 border-storybook-forest-dark rounded-sm relative flex justify-center items-end pb-1">
                    <div className="absolute -top-6 -left-1 w-18 h-6 bg-storybook-rust-base border-2 border-storybook-forest-dark rounded-sm" />
                    <div className="w-4 h-6 bg-storybook-forest-dark rounded-t-sm" />
                  </div>
                  <div className="w-24 h-20 bg-storybook-wood border-2 border-storybook-forest-dark rounded-sm relative flex justify-center items-end pb-2">
                    <div className="absolute -top-8 -left-2 w-28 h-8 bg-storybook-rust-base border-2 border-storybook-forest-dark rounded-sm" />
                    <div className="w-6 h-8 bg-storybook-forest-dark rounded-t-sm" />
                  </div>
                  <div className="w-20 h-16 bg-storybook-wood border-2 border-storybook-forest-dark rounded-sm relative flex justify-center items-end pb-2">
                    <div className="absolute -top-6 -left-2 w-24 h-6 bg-storybook-rust-base border-2 border-storybook-forest-dark rounded-sm" />
                    <div className="w-4 h-6 bg-storybook-forest-dark rounded-t-sm" />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-storybook-forest-dark mt-1 bg-white/50 px-1 rounded">Village</span>
             </div>
          )}
        </div>

        {/* Focus Target Tree */}
        {isFocusing && (
          <div className="relative mr-8">
             {/* Standing Tree Placeholder (Replace with 'Standing tree' vector) */}
             {/* Using simple shapes to represent the asset for now */}
             <div className="w-12 h-32 bg-storybook-wood border-x-2 border-storybook-forest-dark rounded-t-sm relative">
                <div className="absolute -top-16 -left-8 w-28 h-28 bg-storybook-forest-base rounded-full z-10 opacity-90 border-b-4 border-storybook-forest-dark" />
             </div>
             {/* Axe hit effect */}
             {isChopping && (
               <div className="absolute top-1/2 -left-2 w-4 h-1 bg-storybook-ochre rounded animate-[ping_1s_infinite]" />
             )}
          </div>
        )}

        {isResting && (
          <div className="relative mr-12 bottom-0 flex flex-col items-center">
            {/* Campfire Placeholder (Replace with 'Campfire' vector) */}
             <div className="relative w-16 h-16 flex justify-center items-end">
                <div className="absolute bottom-2 w-8 h-14 bg-storybook-rust-light rounded-full animate-[pulse_0.5s_infinite_alternate] opacity-80 mix-blend-screen transform scale-y-110 blur-sm" />
                <div className="absolute bottom-2 w-6 h-10 bg-storybook-ochre rounded-full animate-[pulse_0.3s_infinite_alternate-reverse] opacity-90 mix-blend-screen" />
                <div className="absolute bottom-2 w-3 h-6 bg-white rounded-full animate-[pulse_0.2s_infinite_alternate]" />
            </div>
            <div className="w-16 h-4 bg-storybook-wood rounded-full border border-storybook-forest-dark -mt-2 shadow-lg" />
          </div>
        )}


        {/* --- Character Sprites Placeholder --- */}
        {/*
            When swapping to real assets, this entire div tree will be replaced by something like:
            <img src={getCharacterStateImage()} className="w-32 h-32 object-contain drop-shadow-xl" />
        */}
        <div className="relative w-24 h-32 flex flex-col items-center justify-end">

          {/* Base Character Block (Simple rounded silhouette placeholder) */}
          <div className="w-16 h-20 bg-storybook-rust-base rounded-t-2xl rounded-b-md border-2 border-storybook-forest-dark relative z-10 shadow-lg flex flex-col items-center">
             {/* Head area */}
             <div className="w-12 h-10 mt-1 bg-amber-100 rounded-full border border-storybook-forest-dark relative overflow-hidden">
                {/* Beanie placeholder */}
                <div className="absolute top-0 w-full h-4 bg-storybook-forest-base" />
             </div>

             {/* State-specific overlays */}
             {isChopping && (
                 <div className="absolute top-10 -left-6 origin-bottom-right z-30 animate-[spin_1s_infinite_linear]" style={{ animation: 'chop 1s infinite' }}>
                    <div className="w-16 h-2 bg-storybook-wood border border-storybook-forest-dark rotate-[-45deg] origin-right" />
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-slate-300 rounded-sm rotate-[-45deg]" />
                 </div>
             )}

             {isPaused && (
                 <div className="absolute top-10 left-0 z-30">
                    <div className="w-2 h-16 bg-storybook-wood border border-storybook-forest-dark" />
                 </div>
             )}

             {isResting && (
                 <div className="absolute top-12 left-2 z-30">
                     {/* Resting arms placeholder */}
                    <div className="w-8 h-4 bg-storybook-rust-light rounded-full" />
                 </div>
             )}
          </div>

          {/* Legs */}
          <div className="flex justify-between w-12 mt-0">
             <div className="w-5 h-8 bg-storybook-teal-base border-2 border-t-0 border-storybook-forest-dark" />
             <div className="w-5 h-8 bg-storybook-teal-base border-2 border-t-0 border-storybook-forest-dark" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes chop {
          0% { transform: rotate(10deg); }
          20% { transform: rotate(-45deg); }
          50% { transform: rotate(-45deg); }
          80% { transform: rotate(30deg); }
          100% { transform: rotate(10deg); }
        }
      `}</style>
    </div>
  );
}
