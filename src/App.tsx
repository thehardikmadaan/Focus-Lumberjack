import { Scene } from './components/Scene';
import { TimerControls } from './components/TimerControls';
import { SettingsModal } from './components/SettingsModal';
import { AuthNav } from './components/AuthNav';
import { StatsDashboard } from './components/StatsDashboard';
import { TaskManager } from './components/TaskManager';
import { AudioPlayer } from './components/AudioPlayer';
import { useAppStore } from './store/useAppStore';

function App() {
  const { timerStatus, timerPhase } = useAppStore();

  const isFocusing = timerPhase === 'focus';
  const backgroundUrl = isFocusing ? '/assets/bg-dusk.svg' : '/assets/bg-night.svg';

  return (
    <div
      className="min-h-screen text-storybook-forest-dark font-sans pb-20 bg-cover bg-center bg-no-repeat transition-all duration-1000 bg-fixed"
      style={{ backgroundImage: `url('${backgroundUrl}')` }}
    >
      {/* Overlay to ensure text readability if needed */}
      <div className="absolute inset-0 bg-black/5 pointer-events-none transition-colors duration-1000 z-0" />

      <div className="relative z-10">
        <AuthNav />

        <main className="px-4 flex flex-col items-center">
        {/* Top Controls (Audio & Settings) */}
        <div className="w-full max-w-lg flex justify-between items-center mb-4">
          <AudioPlayer />
          <SettingsModal />
        </div>

        {/* Visualizer */}
        <Scene status={timerStatus} phase={timerPhase} />

        {/* Core Timer UI */}
        <TimerControls />

        {/* Tasks */}
        <TaskManager />

        {/* Stats */}
        <StatsDashboard />
      </main>
      </div>
    </div>
  );
}

export default App;
