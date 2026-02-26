import { useState } from 'react';
import { useTasks } from '../context/TaskContext';

const Task = ({ task }) => {
  const { updateTask, deleteTask } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [taskName, setTaskName] = useState(task.name);

  const handleSave = () => {
    if (taskName.trim()) {
      updateTask(task.id, taskName.trim());
      setIsEditing(false);
    }
  };

  const handleStart = () => {
    // Dispatch a global event that TaskRoulette listens for to start the timer for this task
    try {
      const event = new CustomEvent('start-task', { detail: { task } });
      window.dispatchEvent(event);
    } catch (e) {
      // fallback for older browsers
      const ev = document.createEvent('CustomEvent');
      ev.initCustomEvent('start-task', true, true, { task });
      window.dispatchEvent(ev);
    }
  };

  return (
    <div className="flex items-center gap-2 glass-dark rounded-lg p-2 glass-hover">
      {isEditing ? (
        <>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            onBlur={handleSave}
            onKeyPress={(e) => e.key === 'Enter' && handleSave()}
            className="flex-1 px-2 py-1 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#722F37] focus:border-[#722F37]"
            autoFocus
          />
        </>
      ) : (
        <>
          <span className="flex-1 text-gray-200 cursor-pointer hover:text-gray-100" onClick={() => setIsEditing(true)}>
            ⚫ {task.name}
          </span>

          <button
              onClick={handleStart}
              className="text-[#6BA5A5] hover:text-[#7FC5C5] px-2 py-1 rounded-lg hover:bg-gray-800/50 text-sm transition-colors"
              aria-label={`Start timer for ${task.name}`}
              title={`Start timer for ${task.name}`}
          >
            ▶️
          </button>

          <button
            onClick={() => deleteTask(task.id)}
            className="text-gray-400 hover:text-gray-200 px-2 py-1 rounded-lg hover:bg-gray-800/50 text-sm transition-colors"
          >
            🗑️
          </button>
        </>
      )}
    </div>
  );
};

export default Task;
