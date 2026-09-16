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
        className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
      >
        <Settings className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Settings</h2>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-100 rounded-full text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Focus (minutes)</label>
            <input
              type="number"
              min="1"
              value={focus}
              onChange={(e) => setFocus(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Short Break (minutes)</label>
            <input
              type="number"
              min="1"
              value={shortBreak}
              onChange={(e) => setShortBreak(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Long Break (minutes)</label>
            <input
              type="number"
              min="1"
              value={longBreak}
              onChange={(e) => setLongBreak(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Cycles before Long Break</label>
            <input
              type="number"
              min="1"
              value={cycles}
              onChange={(e) => setCycles(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
