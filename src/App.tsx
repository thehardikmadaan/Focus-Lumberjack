import { Scene } from './components/Scene';
import { TimerControls } from './components/TimerControls';
import { SettingsModal } from './components/SettingsModal';
import { AuthNav } from './components/AuthNav';
import { StatsDashboard } from './components/StatsDashboard';
import { useAppStore } from './store/useAppStore';

function App() {
  const { timerStatus, timerPhase } = useAppStore();

  return (
    <div className="min-h-screen bg-amber-50 text-storybook-forest-dark font-sans pb-20">
      <AuthNav />

      <main className="px-4 flex flex-col items-center">
        {/* Top Controls (Settings) */}
        <div className="w-full max-w-lg flex justify-end mb-4">
          <SettingsModal />
        </div>

        {/* Visualizer */}
        <Scene status={timerStatus} phase={timerPhase} />

        {/* Core Timer UI */}
        <TimerControls />

        {/* Stats */}
        <StatsDashboard />
      </main>
    </div>
  );
}

export default App;
