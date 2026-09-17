import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Settings, X } from 'lucide-react';

export function SettingsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, updateSettings } = useAppStore();

  const [focus, setFocus] = useState(settings.focusDuration / 60);
  const [shortBreak, setShortBreak] = useState(settings.shortBreakDuration / 60);
  const [longBreak, setLongBreak] = useState(settings.longBreakDuration / 60);
  const [cycles, setCycles] = useState(settings.cyclesBeforeLongBreak);

  const handleSave = () => {
    updateSettings({
      focusDuration: focus * 60,
      shortBreakDuration: shortBreak * 60,
      longBreakDuration: longBreak * 60,
      cyclesBeforeLongBreak: cycles,
    });
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-storybook-forest-base hover:text-storybook-forest-dark hover:bg-amber-100 rounded-full transition-colors border-2 border-transparent hover:border-storybook-forest-dark"
      >
        <Settings className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-storybook-forest-dark/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-amber-50 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border-4 border-storybook-forest-dark">
        <div className="flex justify-between items-center p-4 border-b-2 border-storybook-forest-dark bg-amber-100/50">
          <h2 className="text-lg font-bold text-storybook-forest-dark">Settings</h2>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-amber-200 rounded-full text-storybook-forest-base border-2 border-transparent hover:border-storybook-forest-dark transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-storybook-forest-dark mb-1">Focus (minutes)</label>
            <input
              type="number"
              min="1"
              value={focus}
              onChange={(e) => setFocus(Number(e.target.value))}
              className="w-full px-3 py-2 border-2 border-storybook-forest-dark bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-storybook-rust-base font-bold text-storybook-forest-base"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-storybook-forest-dark mb-1">Short Break (minutes)</label>
            <input
              type="number"
              min="1"
              value={shortBreak}
              onChange={(e) => setShortBreak(Number(e.target.value))}
              className="w-full px-3 py-2 border-2 border-storybook-forest-dark bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-storybook-rust-base font-bold text-storybook-forest-base"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-storybook-forest-dark mb-1">Long Break (minutes)</label>
            <input
              type="number"
              min="1"
              value={longBreak}
              onChange={(e) => setLongBreak(Number(e.target.value))}
              className="w-full px-3 py-2 border-2 border-storybook-forest-dark bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-storybook-rust-base font-bold text-storybook-forest-base"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-storybook-forest-dark mb-1">Cycles before Long Break</label>
            <input
              type="number"
              min="1"
              value={cycles}
              onChange={(e) => setCycles(Number(e.target.value))}
              className="w-full px-3 py-2 border-2 border-storybook-forest-dark bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-storybook-rust-base font-bold text-storybook-forest-base"
            />
          </div>
        </div>

        <div className="p-4 bg-amber-100/50 border-t-2 border-storybook-forest-dark flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-storybook-forest-base text-amber-50 font-bold rounded-lg hover:bg-storybook-forest-light transition-colors border-2 border-storybook-forest-dark"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
