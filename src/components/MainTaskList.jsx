import { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import Task from './Task';

const MainTaskList = () => {
  const { tasks, addTask, addTasks } = useTasks();
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [taskInputs, setTaskInputs] = useState(['', '', '']);
  const [bottomTaskName, setBottomTaskName] = useState('');

  const handleAddTask = () => {
    if (newTaskName.trim()) {
      addTask(newTaskName.trim());
      setNewTaskName('');
      setShowAddTask(false);
    }
  };

  const handleBottomAddTask = () => {
    if (bottomTaskName.trim()) {
      addTask(bottomTaskName.trim());
      setBottomTaskName('');
    }
  };

  const handleBulkAdd = () => {
    const taskNames = taskInputs.filter(task => task.trim());
    if (taskNames.length > 0) {
      addTasks(taskNames);
      setTaskInputs(['', '', '']);
      setShowBulkAdd(false);
    }
  };

  const handleAddTaskInput = () => {
    setTaskInputs([...taskInputs, '']);
  };

  const handleTaskInputChange = (index, value) => {
    const newInputs = [...taskInputs];
    newInputs[index] = value;
    setTaskInputs(newInputs);
  };

  const handleRemoveTaskInput = (index) => {
    if (taskInputs.length > 1) {
      setTaskInputs(taskInputs.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="glass glass-hover rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-100">
          📋 Tasks ({tasks.length})
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setShowBulkAdd(!showBulkAdd);
              setShowAddTask(false);
            }}
            className="px-4 py-2 bg-gray-800/50 hover:bg-gray-800 text-gray-300 rounded-lg text-sm transition-colors border border-gray-700"
          >
            {showBulkAdd ? 'Cancel' : '+ Bulk Add'}
          </button>
          <button
            onClick={() => {
              setShowAddTask(!showAddTask);
              setShowBulkAdd(false);
            }}
            className="px-4 py-2 bg-[#722F37] hover:bg-[#8B3E47] text-gray-100 rounded-lg text-sm transition-colors"
          >
            {showAddTask ? 'Cancel' : '+ Add Task'}
          </button>
        </div>
      </div>

      {showBulkAdd && (
        <div className="mb-4 p-4 glass-dark rounded-lg space-y-3">
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Add Multiple Tasks
          </label>
          <div className="space-y-2">
            {taskInputs.map((task, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={task}
                  onChange={(e) => handleTaskInputChange(index, e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (index === taskInputs.length - 1) {
                        handleAddTaskInput();
                      } else {
                        const nextInput = document.querySelector(`input[data-bulk-index="${index + 1}"]`);
                        if (nextInput) nextInput.focus();
                      }
                    }
                  }}
                  placeholder={`Task ${index + 1}...`}
                  className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#722F37] focus:border-[#722F37]"
                  data-bulk-index={index}
                />
                {taskInputs.length > 1 && (
                  <button
                    onClick={() => handleRemoveTaskInput(index)}
                    className="text-gray-400 hover:text-gray-200 px-2 py-1 rounded-lg hover:bg-gray-800/50 transition-colors"
                    type="button"
                  >
                    🗑️
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddTaskInput}
              type="button"
              className="text-[#6BA5A5] hover:text-[#7FC5C5] font-semibold text-sm transition-colors"
            >
              + Add another task
            </button>
            <div className="flex-1"></div>
            <button
              onClick={handleBulkAdd}
              className="px-4 py-2 bg-[#722F37] hover:bg-[#8B3E47] text-gray-100 rounded-lg text-sm transition-colors"
            >
              Add All
            </button>
          </div>
        </div>
      )}

      {showAddTask && (
        <div className="mb-4 flex gap-2 items-center">
          <input
            type="text"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            placeholder="Task name..."
            className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#722F37] focus:border-[#722F37]"
            autoFocus
          />
          <button
            onClick={handleAddTask}
            className="px-4 py-2 bg-[#722F37] hover:bg-[#8B3E47] text-gray-100 rounded-lg transition-colors"
          >
            Add
          </button>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>No tasks yet. Add some tasks to get started!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map(task => (
            <Task key={task.id} task={task} />
          ))}
        </div>
      )}

      {/* Always-visible add task input at bottom */}
      <div className="mt-4 pt-4 border-t border-gray-700/50">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={bottomTaskName}
            onChange={(e) => setBottomTaskName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleBottomAddTask()}
            placeholder="Add a new task..."
            className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#722F37] focus:border-[#722F37]"
          />
          <button
            onClick={handleBottomAddTask}
            className="px-4 py-2 bg-[#722F37] hover:bg-[#8B3E47] text-gray-100 rounded-lg transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainTaskList;
