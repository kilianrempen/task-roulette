import { useState } from 'react';
import { useTasks } from '../context/TaskContext';

const CompletedTasks = () => {
  const { completedTasks, reAddTask, deleteCompletedTask } = useTasks();
  const [isExpanded, setIsExpanded] = useState(true);

  if (completedTasks.length === 0) {
    return null;
  }

  return (
    <div className="glass glass-hover rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-gray-100">
          ✅ Completed Tasks ({completedTasks.length})
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-gray-200 transition-colors"
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-2">
          {completedTasks.map(task => (
            <div
              key={task.id}
              className="glass-dark rounded-lg p-3 flex items-center justify-between"
            >
              <div className="flex-1">
                <p className="text-gray-300 font-medium line-through">{task.name}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => reAddTask(task)}
                  className="px-3 py-1 bg-[#2D5F5F] hover:bg-[#3D7F7F] text-gray-100 rounded-lg text-sm transition-colors"
                >
                  ↻ Re-add
                </button>
                <button
                  onClick={() => deleteCompletedTask(task.id)}
                  className="px-3 py-1 bg-gray-800/50 hover:bg-gray-800 text-gray-300 rounded-lg text-sm transition-colors border border-gray-700"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompletedTasks;
