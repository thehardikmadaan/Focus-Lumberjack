import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { User, LogOut, Trees } from 'lucide-react';

export function AuthNav() {
  const { isGuest, username, login, logout } = useAppStore();
  const [showLogin, setShowLogin] = useState(false);
  const [inputName, setInputName] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputName.trim()) {
      login(inputName.trim());
      setShowLogin(false);
      setInputName('');
    }
  };

  return (
    <nav className="flex justify-between items-center py-4 px-6 mb-8 w-full max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-emerald-800 font-black text-xl tracking-tight">
        <Trees className="w-6 h-6" />
        <span>Focus Lumberjack</span>
      </div>

      <div className="flex items-center gap-4">
        {isGuest ? (
          <button
            onClick={() => setShowLogin(true)}
            className="flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-4 py-2 rounded-full transition-colors"
          >
            <User className="w-4 h-4" />
            Sign In
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600">
              Welcome, <strong className="text-slate-900">{username}</strong>
            </span>
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {showLogin && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Join the Crew</h2>
            <p className="text-slate-500 text-sm mb-6">Enter a name to save your progress (Mock Auth for MVP).</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="text"
                placeholder="Lumberjack Name"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                autoFocus
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowLogin(false)}
                  className="px-4 py-2 text-slate-500 font-medium hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}
