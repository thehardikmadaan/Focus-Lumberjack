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
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
          <Flame className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Current Streak</p>
          <p className="text-2xl font-black text-slate-800">{stats.currentStreakDays} days</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Total Focus</p>
          <p className="text-2xl font-black text-slate-800">{totalHours} hrs</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
         <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
          <CalendarDays className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Longest Streak</p>
          <p className="text-2xl font-black text-slate-800">{stats.longestStreakDays} days</p>
        </div>
      </div>

      {/* History List */}
      <div className="md:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-4">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-800">Recent Sessions</h3>
        </div>
        {recentSessions.length === 0 ? (
          <div className="p-8 text-center text-slate-400 font-medium">
            No sessions yet. Time to chop some wood!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentSessions.map((session) => (
              <div key={session.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  {session.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-slate-300" />
                  )}
                  <div>
                    <p className="font-medium text-slate-800 capitalize">
                      {session.type.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDistanceToNow(session.startedAt, { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-700">
                    {Math.round(session.actualDuration / 60)} min
                  </p>
                  {!session.completed && (
                    <span className="text-xs font-semibold text-orange-500 bg-orange-100 px-2 py-0.5 rounded-full">
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
