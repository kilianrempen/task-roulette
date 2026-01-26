import React, { createContext, useContext, useState } from 'react';

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  // Global flag to show the congratulations modal
  const [showCongrats, setShowCongrats] = useState(false);
  // OpenRouter response stored for the current task session
  const [openRouterMessage, setOpenRouterMessage] = useState(null);
  const [openRouterPending, setOpenRouterPending] = useState(false);

  // Task operations
  const addTask = (taskName) => {
    const newTask = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: taskName.trim()
    };
    setTasks([...tasks, newTask]);
    return newTask.id;
  };

  const addTasks = (taskNames) => {
    const newTasks = taskNames
      .filter(taskName => taskName.trim())
      .map((taskName) => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: taskName.trim()
      }));
    setTasks([...tasks, ...newTasks]);
  };

  const updateTask = (taskId, newName) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, name: newName } : t
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  // Get all tasks
  const getAllTasks = () => {
    return tasks;
  };

  // Fetch a short congratulatory message from the OpenRouter API for a given task name.
  // Uses Vite env vars: VITE_OPENROUTER_URL and VITE_OPENROUTER_KEY. If they're not set,
  // this will set a simple fallback message synchronously.
  const fetchOpenRouterMessage = async (taskName) => {
    if (!taskName) return;
    const url = import.meta.env.VITE_OPENROUTER_URL;
    const key = import.meta.env.VITE_OPENROUTER_KEY;

    // Start pending state
    setOpenRouterPending(true);
    setOpenRouterMessage(null);

    // Fallback prompt generation
    const fallback = `Congratulations on completing "${taskName}"! Great focus — well done.`;

    if (!url || !key) {
      // If env not provided, immediately use fallback
      setOpenRouterMessage(fallback);
      setOpenRouterPending(false);
      return;
    }

    try {
      const body = JSON.stringify({
        // Many OpenRouter endpoints accept a prompt-like payload; include a concise instruction and the task name.
        input: `Compose one compelling, calming congratulatory sentence for completing the task: ${taskName}`
      });

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body
      });

      if (!res.ok) {
        // Use fallback if remote failed
        setOpenRouterMessage(fallback);
      } else {
        const data = await res.json();
        // Try common response shapes
        const candidate = data.output || data.text || data.result || data.message || (data.choices && data.choices[0] && (data.choices[0].text || data.choices[0].message?.content));
        if (typeof candidate === 'string' && candidate.trim().length > 0) {
          setOpenRouterMessage(candidate.trim());
        } else if (typeof data === 'string') {
          setOpenRouterMessage(data);
        } else {
          // Last resort: stringify a portion
          setOpenRouterMessage(fallback);
        }
      }
    } catch (err) {
      console.error('OpenRouter fetch error:', err);
      setOpenRouterMessage(fallback);
    } finally {
      setOpenRouterPending(false);
    }
  };

  // Complete task (move to completed)
  const completeTask = (task) => {
    // Remove from active tasks
    setTasks(tasks.filter(t => t.id !== task.id));

    // Add to completed tasks
    setCompletedTasks([...completedTasks, { ...task, completedAt: Date.now() }]);

    // Show the global congratulations modal
    setShowCongrats(true);
  };

  // Re-add completed task
  const reAddTask = (completedTask) => {
    const { completedAt, ...task } = completedTask;
    setTasks([...tasks, task]);

    // Remove from completed
    setCompletedTasks(completedTasks.filter(t => t.id !== completedTask.id));
  };

  // Delete completed task forever
  const deleteCompletedTask = (taskId) => {
    setCompletedTasks(completedTasks.filter(t => t.id !== taskId));
  };

  const closeCongrats = () => {
    setShowCongrats(false);
    // clear stored openrouter message when modal closes
    setOpenRouterMessage(null);
    setOpenRouterPending(false);
  };

  const value = {
    tasks,
    completedTasks,
    addTask,
    addTasks,
    updateTask,
    deleteTask,
    getAllTasks,
    completeTask,
    reAddTask,
    deleteCompletedTask,
    showCongrats,
    closeCongrats,
    openRouterMessage,
    openRouterPending,
    fetchOpenRouterMessage
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
