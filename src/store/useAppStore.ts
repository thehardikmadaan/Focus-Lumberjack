import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TimerPhase = 'focus' | 'short_break' | 'long_break';
export type TimerStatus = 'idle' | 'running' | 'paused';

export interface UserSettings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  cyclesBeforeLongBreak: number;
}

export interface Session {
  id: string;
  type: TimerPhase;
  plannedDuration: number;
  actualDuration: number;
  startedAt: number;
  endedAt: number | null;
  completed: boolean;
}

export interface UserStats {
  totalFocusSeconds: number;
  currentStreakDays: number;
  longestStreakDays: number;
  lastActiveDate: string | null;
  sessions: Session[];
}

interface AppState {
  // Auth / User
  isGuest: boolean;
  username: string;
  login: (username: string) => void;
  logout: () => void;

  // Settings
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;

  // Stats & Progress
  stats: UserStats;
  addSession: (session: Session) => void;

  // Timer State (persisted so reload doesn't kill it completely)
  timerPhase: TimerPhase;
  timerStatus: TimerStatus;
  currentCycle: number;
  startedAt: number | null;
  pausedAt: number | null;
  accumulatedPausedTime: number; // time spent paused during this session
  expectedEndTime: number | null;

  setTimerState: (state: Partial<AppState>) => void;
  resetTimer: () => void;
}

const DEFAULT_SETTINGS: UserSettings = {
  focusDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  cyclesBeforeLongBreak: 4,
};

const DEFAULT_STATS: UserStats = {
  totalFocusSeconds: 0,
  currentStreakDays: 0,
  longestStreakDays: 0,
  lastActiveDate: null,
  sessions: [],
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isGuest: true,
      username: 'Guest',
      login: (username) => set({ isGuest: false, username }),
      logout: () => set({ isGuest: true, username: 'Guest' }),

      settings: DEFAULT_SETTINGS,
      updateSettings: (newSettings) =>
        set((state) => ({ settings: { ...state.settings, ...newSettings } })),

      stats: DEFAULT_STATS,
      addSession: (session) =>
        set((state) => {
          const isFocus = session.type === 'focus';
          const newTotal = state.stats.totalFocusSeconds + (isFocus ? session.actualDuration : 0);

          // Simple streak logic (could be improved with date checking)
          // Use local date string instead of UTC to avoid streak resets at wrong local time
          const now = new Date();
          const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split('T')[0];
          let { currentStreakDays, longestStreakDays, lastActiveDate } = state.stats;

          if (isFocus && session.actualDuration > 0) {
              if (lastActiveDate !== today) {
                  const yesterday = new Date();
                  yesterday.setDate(yesterday.getDate() - 1);
                  const yesterdayStr = new Date(yesterday.getTime() - yesterday.getTimezoneOffset() * 60000).toISOString().split('T')[0];

                  if (lastActiveDate === yesterdayStr) {
                      currentStreakDays++;
                  } else {
                      currentStreakDays = 1;
                  }
                  longestStreakDays = Math.max(currentStreakDays, longestStreakDays);
                  lastActiveDate = today;
              }
          }

          return {
            stats: {
              ...state.stats,
              totalFocusSeconds: newTotal,
              currentStreakDays,
              longestStreakDays,
              lastActiveDate,
              sessions: [...state.stats.sessions, session],
            }
          };
        }),

      timerPhase: 'focus',
      timerStatus: 'idle',
      currentCycle: 1,
      startedAt: null,
      pausedAt: null,
      accumulatedPausedTime: 0,
      expectedEndTime: null,

      setTimerState: (stateUpdate) => set((state) => ({ ...state, ...stateUpdate })),
      resetTimer: () => set({
          timerStatus: 'idle',
          startedAt: null,
          pausedAt: null,
          accumulatedPausedTime: 0,
          expectedEndTime: null,
      }),
    }),
    {
      name: 'focus-lumberjack-storage',
    }
  )
);
