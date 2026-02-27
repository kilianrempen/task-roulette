import React, { createContext, useContext, useState, useEffect } from 'react';

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  // localStorage keys (versioned so we can migrate later if needed)
  const TASKS_KEY = 'task-roulette:tasks:v1';
  const COMPLETED_KEY = 'task-roulette:completed:v1';

  // Safe helper to parse JSON from localStorage
  const safeParse = (value, fallback) => {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch (e) {
      return fallback;
    }
  };

  // Initialize from localStorage when available (use lazy initializer)
  const [tasks, setTasks] = useState(() => {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const raw = window.localStorage.getItem(TASKS_KEY);
    return raw ? safeParse(raw, []) : [];
  });

  const [completedTasks, setCompletedTasks] = useState(() => {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const raw = window.localStorage.getItem(COMPLETED_KEY);
    return raw ? safeParse(raw, []) : [];
  });

  // Global flag to show the congratulations modal (do not persist UI flags)
  const [showCongrats, setShowCongrats] = useState(false);

  // Persist tasks -> localStorage when they change
  useEffect(() => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      window.localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch (e) {
      // ignore write errors (storage full / disabled)
      // Could surface a warning here later
    }
  }, [tasks]);

  // Persist completed tasks
  useEffect(() => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      window.localStorage.setItem(COMPLETED_KEY, JSON.stringify(completedTasks));
    } catch (e) {
      // ignore
    }
  }, [completedTasks]);

  // Task operations
  const addTask = (taskName) => {
    const newTask = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: taskName.trim()
    };
    setTasks(prev => [...prev, newTask]);
    return newTask.id;
  };

  const addTasks = (taskNames) => {
    const newTasks = taskNames
      .filter(taskName => taskName.trim())
      .map((taskName) => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: taskName.trim()
      }));
    setTasks(prev => [...prev, ...newTasks]);
  };

  const updateTask = (taskId, newName) => {
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, name: newName } : t
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Get all tasks
  const getAllTasks = () => {
    return tasks;
  };

  // Complete task (move to completed)
  const completeTask = (task) => {
    // Remove from active tasks
    setTasks(prev => prev.filter(t => t.id !== task.id));

    // Add to completed tasks
    setCompletedTasks(prev => [...prev, { ...task, completedAt: Date.now() }]);

    // Show the global congratulations modal
    setShowCongrats(true);
  };

  // Re-add completed task
  const reAddTask = (completedTask) => {
    const { completedAt, ...task } = completedTask;
    setTasks(prev => [...prev, task]);

    // Remove from completed
    setCompletedTasks(prev => prev.filter(t => t.id !== completedTask.id));
  };

  // Delete completed task forever
  const deleteCompletedTask = (taskId) => {
    setCompletedTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Clear all tasks and completed tasks (reset)
  const clearAllTasks = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(TASKS_KEY);
        window.localStorage.removeItem(COMPLETED_KEY);
      }
    } catch (e) {
      // ignore storage errors
    }

    setTasks([]);
    setCompletedTasks([]);
    setShowCongrats(false);
  };

  const closeCongrats = () => setShowCongrats(false);

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
    clearAllTasks,
    showCongrats,
    closeCongrats
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
