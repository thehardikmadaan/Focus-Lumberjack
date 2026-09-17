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
      <div className="flex items-center gap-2 text-storybook-forest-dark font-black text-xl tracking-tight drop-shadow-sm">
        <Trees className="w-6 h-6 text-storybook-forest-base" />
        <span>Focus Lumberjack</span>
      </div>

      <div className="flex items-center gap-4">
        {isGuest ? (
          <button
            onClick={() => setShowLogin(true)}
            className="flex items-center gap-2 text-sm font-bold text-storybook-forest-dark bg-amber-200 hover:bg-amber-300 px-4 py-2 rounded-full transition-colors border-2 border-storybook-forest-dark shadow-sm"
          >
            <User className="w-4 h-4" />
            Sign In
          </button>
        ) : (
          <div className="flex items-center gap-4 bg-amber-100/80 px-4 py-2 rounded-full border-2 border-storybook-forest-dark shadow-sm backdrop-blur">
            <span className="text-sm font-medium text-storybook-forest-base">
              Welcome, <strong className="text-storybook-forest-dark font-black">{username}</strong>
            </span>
            <button
              onClick={logout}
              className="p-1.5 text-storybook-rust-base hover:text-white hover:bg-storybook-rust-base rounded-full transition-colors border-2 border-transparent hover:border-storybook-forest-dark"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {showLogin && (
        <div className="fixed inset-0 bg-storybook-forest-dark/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-amber-50 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 border-4 border-storybook-forest-dark">
            <h2 className="text-xl font-black text-storybook-forest-dark mb-2">Join the Crew</h2>
            <p className="text-storybook-teal-base font-medium text-sm mb-6">Enter a name to save your progress (Mock Auth for MVP).</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="text"
                placeholder="Lumberjack Name"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                autoFocus
                className="w-full px-4 py-3 border-2 border-storybook-forest-dark bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-storybook-rust-base font-bold text-storybook-forest-base"
              />
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogin(false)}
                  className="px-4 py-2 text-storybook-forest-base font-bold hover:bg-amber-200 rounded-lg border-2 border-transparent hover:border-storybook-forest-dark transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-storybook-forest-base text-amber-50 font-bold rounded-lg hover:bg-storybook-forest-light transition-colors border-2 border-storybook-forest-dark shadow-sm"
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
