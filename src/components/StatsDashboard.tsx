import { useAppStore } from '../store/useAppStore';
import { Flame, Clock, CalendarDays, CheckCircle2, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function StatsDashboard() {
  const { stats } = useAppStore();

  const totalMinutes = Math.floor(stats.totalFocusSeconds / 60);
  const totalHours = (totalMinutes / 60).toFixed(1);

  // Get last 5 sessions
  const recentSessions = [...stats.sessions].reverse().slice(0, 5);

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
      {/* Overview Cards */}
      <div className="bg-amber-50/80 backdrop-blur p-6 rounded-2xl shadow-sm border-2 border-storybook-forest-dark flex items-center gap-4">
        <div className="w-12 h-12 bg-amber-200 text-storybook-rust-base rounded-xl flex items-center justify-center border-2 border-storybook-forest-dark">
          <Flame className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-bold text-storybook-rust-base">Current Streak</p>
          <p className="text-2xl font-black text-storybook-forest-dark">{stats.currentStreakDays} days</p>
        </div>
      </div>

      <div className="bg-amber-50/80 backdrop-blur p-6 rounded-2xl shadow-sm border-2 border-storybook-forest-dark flex items-center gap-4">
        <div className="w-12 h-12 bg-storybook-forest-light/30 text-storybook-forest-base rounded-xl flex items-center justify-center border-2 border-storybook-forest-dark">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-bold text-storybook-rust-base">Total Focus</p>
          <p className="text-2xl font-black text-storybook-forest-dark">{totalHours} hrs</p>
        </div>
      </div>

      <div className="bg-amber-50/80 backdrop-blur p-6 rounded-2xl shadow-sm border-2 border-storybook-forest-dark flex items-center gap-4">
         <div className="w-12 h-12 bg-storybook-teal-light/30 text-storybook-teal-base rounded-xl flex items-center justify-center border-2 border-storybook-forest-dark">
          <CalendarDays className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-bold text-storybook-rust-base">Longest Streak</p>
          <p className="text-2xl font-black text-storybook-forest-dark">{stats.longestStreakDays} days</p>
        </div>
      </div>

      {/* History List */}
      <div className="md:col-span-3 bg-amber-50/80 backdrop-blur rounded-2xl shadow-sm border-2 border-storybook-forest-dark overflow-hidden mt-4">
        <div className="p-4 border-b-2 border-storybook-forest-dark bg-amber-100/50">
          <h3 className="font-bold text-storybook-forest-dark">Recent Sessions</h3>
        </div>
        {recentSessions.length === 0 ? (
          <div className="p-8 text-center text-storybook-teal-base font-medium">
            No sessions yet. Time to chop some wood!
          </div>
        ) : (
          <div className="divide-y-2 divide-storybook-forest-dark/10">
            {recentSessions.map((session) => (
              <div key={session.id} className="p-4 flex items-center justify-between hover:bg-amber-100/50 transition-colors">
                <div className="flex items-center gap-3">
                  {session.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-storybook-forest-base" />
                  ) : (
                    <XCircle className="w-5 h-5 text-storybook-rust-base opacity-70" />
                  )}
                  <div>
                    <p className="font-bold text-storybook-forest-dark capitalize">
                      {session.type.replace('_', ' ')}
                    </p>
                    <p className="text-xs font-semibold text-storybook-teal-base">
                      {formatDistanceToNow(session.startedAt, { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-storybook-forest-dark">
                    {Math.round(session.actualDuration / 60)} min
                  </p>
                  {!session.completed && (
                    <span className="text-xs font-bold text-amber-100 bg-storybook-rust-base px-2 py-0.5 rounded-full border border-storybook-forest-dark">
                      Left Early
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
