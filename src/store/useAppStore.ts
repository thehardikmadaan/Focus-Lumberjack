import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TimerPhase = 'focus' | 'short_break' | 'long_break';
export type TimerStatus = 'idle' | 'running' | 'paused';

export interface UserSettings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  cyclesBeforeLongBreak: number;
  audioVolume: number;
  selectedAudio: 'none' | 'forest' | 'campfire' | 'rain';
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  totalFocusSeconds: number;
  createdAt: number;
}

export interface Session {
  id: string;
  type: TimerPhase;
  plannedDuration: number;
  actualDuration: number;
  startedAt: number;
  endedAt: number | null;
  completed: boolean;
  taskId?: string; // Optional link to a task
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

  // Tasks
  tasks: Task[];
  activeTaskId: string | null;
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  setActiveTask: (id: string | null) => void;
  updateTaskFocusTime: (id: string, additionalSeconds: number) => void;

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
  audioVolume: 0.5,
  selectedAudio: 'none',
  autoStartBreaks: false,
  autoStartFocus: false,
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

      tasks: [],
      activeTaskId: null,
      addTask: (title) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            { id: crypto.randomUUID(), title, completed: false, totalFocusSeconds: 0, createdAt: Date.now() },
          ],
        })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
          activeTaskId: state.activeTaskId === id ? null : state.activeTaskId, // deselect if completed
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
          activeTaskId: state.activeTaskId === id ? null : state.activeTaskId,
        })),
      setActiveTask: (id) => set({ activeTaskId: id }),
      updateTaskFocusTime: (id, additionalSeconds) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, totalFocusSeconds: t.totalFocusSeconds + additionalSeconds } : t
          ),
        })),

      stats: DEFAULT_STATS,
      addSession: (session) =>
        set((state) => {
          const isFocus = session.type === 'focus';
          const newTotal = state.stats.totalFocusSeconds + (isFocus ? session.actualDuration : 0);

          // Refined streak logic using local date strings
          const now = new Date();
          const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split('T')[0];
          let { currentStreakDays, longestStreakDays, lastActiveDate } = state.stats;

          // Check if streak was broken (last active date is before yesterday)
          if (lastActiveDate && lastActiveDate !== today) {
              const yesterday = new Date(now.getTime() - 86400000);
              const yesterdayStr = new Date(yesterday.getTime() - yesterday.getTimezoneOffset() * 60000).toISOString().split('T')[0];

              if (lastActiveDate !== yesterdayStr) {
                  // Streak broken! Reset to 0 if they haven't done anything today yet,
                  // or keep logic simple: if they log something today, it becomes 1.
                  currentStreakDays = 0;
              }
          }

          if (isFocus && session.actualDuration > 0) {
              if (lastActiveDate !== today) {
                  const yesterday = new Date(now.getTime() - 86400000);
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
