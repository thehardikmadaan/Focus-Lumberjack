import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Plus, Check, Circle, Trash2 } from 'lucide-react';

export function TaskManager() {
  const { tasks, activeTaskId, addTask, toggleTask, deleteTask, setActiveTask } = useAppStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim());
      setNewTaskTitle('');
    }
  };

  const activeTask = tasks.find(t => t.id === activeTaskId);
  const uncompletedTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="w-full max-w-lg mx-auto mt-6 bg-amber-50/80 backdrop-blur rounded-2xl shadow-sm border-2 border-storybook-forest-dark overflow-hidden">
      <div className="p-4 border-b-2 border-storybook-forest-dark bg-amber-100/50">
        <h3 className="font-bold text-storybook-forest-dark flex items-center justify-between">
          <span>Your Tasks</span>
          {activeTask && (
            <span className="text-xs font-semibold bg-storybook-forest-base text-amber-50 px-2 py-1 rounded-full border border-storybook-forest-dark">
              Active: {activeTask.title}
            </span>
          )}
        </h3>
      </div>

      <div className="p-4">
        <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="What are you focusing on?"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="flex-1 px-3 py-2 border-2 border-storybook-forest-dark bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-storybook-rust-base font-medium text-storybook-forest-base placeholder-storybook-forest-light/50"
          />
          <button
            type="submit"
            disabled={!newTaskTitle.trim()}
            className="p-2 bg-storybook-rust-base text-amber-50 rounded-lg hover:bg-storybook-rust-light disabled:opacity-50 disabled:cursor-not-allowed border-2 border-storybook-forest-dark transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </form>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {uncompletedTasks.length === 0 && completedTasks.length === 0 && (
            <p className="text-center text-sm text-storybook-teal-base py-4 font-medium">
              No tasks yet. Add one above!
            </p>
          )}

          {uncompletedTasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-3 rounded-lg border-2 transition-colors cursor-pointer group ${
                activeTaskId === task.id
                  ? 'bg-storybook-forest-light/20 border-storybook-forest-base'
                  : 'bg-white border-storybook-forest-dark/20 hover:border-storybook-forest-light/50'
              }`}
              onClick={() => setActiveTask(activeTaskId === task.id ? null : task.id)}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTask(task.id);
                  }}
                  className="text-storybook-forest-dark/40 hover:text-storybook-forest-base transition-colors shrink-0"
                >
                  <Circle className="w-5 h-5" />
                </button>
                <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-bold text-storybook-forest-dark truncate">
                    {task.title}
                    </span>
                    {task.totalFocusSeconds > 0 && (
                        <span className="text-xs font-semibold text-storybook-teal-base">
                            {Math.floor(task.totalFocusSeconds / 60)} min focused
                        </span>
                    )}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTask(task.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-storybook-rust-base hover:bg-storybook-rust-base/10 rounded transition-all shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {completedTasks.length > 0 && (
            <div className="pt-2 mt-2 border-t-2 border-storybook-forest-dark/10">
              <h4 className="text-xs font-bold text-storybook-forest-light uppercase tracking-wider mb-2">Completed</h4>
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-white/50 border border-storybook-forest-dark/10 opacity-75"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="text-storybook-forest-base shrink-0"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-medium text-storybook-forest-dark line-through truncate">
                        {task.title}
                        </span>
                        {task.totalFocusSeconds > 0 && (
                            <span className="text-xs text-storybook-teal-base">
                                {Math.floor(task.totalFocusSeconds / 60)} min focused
                            </span>
                        )}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1 text-storybook-rust-base hover:bg-storybook-rust-base/10 rounded shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
