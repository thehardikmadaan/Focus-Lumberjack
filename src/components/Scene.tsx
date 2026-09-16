import { type TimerStatus, type TimerPhase } from '../store/useAppStore';

interface SceneProps {
  status: TimerStatus;
  phase: TimerPhase;
}

export function Scene({ status, phase }: SceneProps) {
  // Determine if we are focusing
  const isFocusing = phase === 'focus';
  const isChopping = isFocusing && status === 'running';
  const isPaused = status === 'paused';
  const isResting = !isFocusing;

  return (
    <div className="relative w-full max-w-lg aspect-video bg-sky-100 rounded-xl overflow-hidden border-4 border-sky-900 shadow-xl mx-auto flex items-end justify-center">
      {/* Ground */}
      <div className="absolute bottom-0 w-full h-1/3 bg-emerald-600 border-t-4 border-emerald-800" />

      {/* Mountains (Background) */}
      <div className="absolute bottom-1/3 left-4 w-32 h-32 bg-slate-300 rounded-tl-full rotate-45 transform translate-y-16 -z-10 border-t-2 border-l-2 border-slate-400" />
      <div className="absolute bottom-1/3 right-12 w-40 h-40 bg-slate-400 rounded-tl-full rotate-45 transform translate-y-20 -z-10 border-t-2 border-l-2 border-slate-500" />

      {/* Sun/Moon */}
      <div className={`absolute top-6 right-8 w-12 h-12 rounded-full transition-colors duration-1000 ${isResting ? 'bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.5)]' : 'bg-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.6)]'}`} />

      {/* Cloud 1 */}
      <svg className="absolute top-8 left-10 w-24 h-12 opacity-80 animate-[bounce_10s_infinite_alternate]" viewBox="0 0 24 12" fill="white">
        <path d="M18.5,4A3.5,3.5,0,0,0,15,6.5a4.5,4.5,0,0,0-8,0A3.5,3.5,0,0,0,3.5,10h15a2.5,2.5,0,0,0,0-6Z" />
      </svg>
      {/* Cloud 2 */}
       <svg className="absolute top-16 left-1/2 w-16 h-8 opacity-60 animate-[bounce_12s_infinite_alternate-reverse]" viewBox="0 0 24 12" fill="white">
        <path d="M18.5,4A3.5,3.5,0,0,0,15,6.5a4.5,4.5,0,0,0-8,0A3.5,3.5,0,0,0,3.5,10h15a2.5,2.5,0,0,0,0-6Z" />
      </svg>

      <div className="relative z-10 flex items-end justify-center w-full h-full pb-8">

        {/* Tree (Only shows if focusing or paused) */}
        {isFocusing && (
          <div className="relative mr-4">
             {/* Leaves */}
             <div className="absolute -top-16 -left-6 w-24 h-24 bg-green-700 rounded-full z-10 border-4 border-green-900" />
             <div className="absolute -top-20 left-2 w-20 h-20 bg-green-600 rounded-full z-10 border-4 border-green-900" />
             <div className="absolute -top-12 left-6 w-24 h-24 bg-green-800 rounded-full z-10 border-4 border-green-900" />
             {/* Trunk */}
             <div className="w-10 h-32 bg-amber-800 border-x-4 border-amber-950 rounded-t-sm" />

             {/* Axe hit effect */}
             {isChopping && (
               <div className="absolute top-1/2 -left-2 w-4 h-1 bg-yellow-300 rounded animate-[ping_1s_infinite]" />
             )}
          </div>
        )}

        {/* Campfire (Only shows if resting) */}
        {isResting && (
          <div className="relative mr-8 bottom-0 flex flex-col items-center">
            {/* Flames */}
            <div className="relative w-12 h-16 flex justify-center items-end">
                <div className="absolute bottom-2 w-6 h-12 bg-orange-500 rounded-full animate-[pulse_0.5s_infinite_alternate] opacity-80 mix-blend-screen transform scale-y-110 blur-sm" />
                <div className="absolute bottom-2 w-4 h-10 bg-yellow-400 rounded-full animate-[pulse_0.3s_infinite_alternate-reverse] opacity-90 mix-blend-screen" />
                <div className="absolute bottom-2 w-2 h-6 bg-white rounded-full animate-[pulse_0.2s_infinite_alternate]" />
            </div>
            {/* Logs */}
            <div className="flex -mt-2">
                <div className="w-10 h-3 bg-amber-900 rounded-full rotate-12 -mr-4 border border-black" />
                <div className="w-10 h-3 bg-amber-900 rounded-full -rotate-12 border border-black" />
            </div>
          </div>
        )}


        {/* Lumberjack */}
        <div className="relative">
          {/* Head */}
          <div className="w-12 h-12 bg-orange-200 rounded-md border-2 border-black relative z-20 overflow-hidden">
             {/* Beanie */}
             <div className="absolute top-0 w-full h-4 bg-red-600 border-b-2 border-black" />
             {/* Beard */}
             <div className="absolute bottom-0 w-full h-5 bg-amber-900" />
             {/* Eyes */}
             <div className={`absolute top-5 left-3 w-1.5 h-1.5 bg-black rounded-full ${isResting ? 'animate-pulse' : ''}`} />
             <div className={`absolute top-5 right-3 w-1.5 h-1.5 bg-black rounded-full ${isResting ? 'animate-pulse' : ''}`} />
          </div>

          {/* Body */}
          <div className="w-14 h-16 bg-red-600 border-2 border-black -ml-1 relative z-10 overflow-hidden mt-1">
             {/* Flannel pattern (simple grid) */}
             <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(90deg, transparent 50%, rgba(0,0,0,0.2) 50%), linear-gradient(rgba(0,0,0,0.2) 50%, transparent 50%)', backgroundSize: '8px 8px' }} />
          </div>

          {/* Legs */}
          <div className="flex justify-between w-12 ml-0 mt-0">
             <div className="w-5 h-8 bg-blue-800 border-2 border-t-0 border-black" />
             <div className="w-5 h-8 bg-blue-800 border-2 border-t-0 border-black" />
          </div>

          {/* Boots */}
          <div className="flex justify-between w-14 -ml-1 mt-0">
             <div className="w-6 h-4 bg-amber-950 border-2 border-black rounded-t-md" />
             <div className="w-6 h-4 bg-amber-950 border-2 border-black rounded-t-md" />
          </div>

          {/* Arms and Axe */}
          {isFocusing && (
             <div className={`absolute top-16 left-[-2rem] origin-bottom-right z-30 transition-transform ${isChopping ? 'animate-[spin_1s_infinite_linear]' : isPaused ? 'rotate-[45deg]' : 'rotate-[20deg]'}`} style={isChopping ? { animation: 'chop 1s infinite' } : {}}>
                {/* Arm */}
                <div className="w-12 h-4 bg-red-600 border-2 border-black rounded-full relative">
                   <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(90deg, transparent 50%, rgba(0,0,0,0.2) 50%), linear-gradient(rgba(0,0,0,0.2) 50%, transparent 50%)', backgroundSize: '8px 8px' }} />
                </div>
                {/* Axe handle */}
                <div className="absolute top-2 -left-6 w-16 h-2 bg-amber-700 border-2 border-black rotate-[-45deg] origin-right" />
                {/* Axe Head */}
                <div className="absolute -top-2 -left-8 w-6 h-8 bg-slate-300 border-2 border-black rounded-l-full rotate-[-45deg]" />
             </div>
          )}

           {isResting && (
             <div className="absolute top-16 left-2 origin-top z-30 rotate-12">
                {/* Arm resting */}
                <div className="w-4 h-10 bg-red-600 border-2 border-black rounded-full relative">
                   <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(90deg, transparent 50%, rgba(0,0,0,0.2) 50%), linear-gradient(rgba(0,0,0,0.2) 50%, transparent 50%)', backgroundSize: '8px 8px' }} />
                </div>
             </div>
          )}
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
