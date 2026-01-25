import { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import Roulette from '../assets/roulette.svg';

const TaskRoulette = () => {
  const { getAllTasks, completeTask } = useTasks();
  const [selectedTask, setSelectedTask] = useState(null);
  const [timerDuration, setTimerDuration] = useState(15);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const durations = [5, 10, 15, 30, 60];

  useEffect(() => {
    let interval = null;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            setIsActive(false);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (!isActive && timeRemaining !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  useEffect(() => {
    if (timeRemaining === 0 && !isActive && selectedTask) {
      completeTask(selectedTask);
      setSelectedTask(null);
    }
  }, [timeRemaining, isActive, selectedTask, completeTask]);

  const spinRoulette = () => {
    const allTasks = getAllTasks();
    if (allTasks.length === 0) {
      alert('No tasks available! Please add some tasks first.');
      return;
    }

    setIsSpinning(true);
    
    // Simulate spinning animation with multiple random selections
    let iterations = 0;
    const maxIterations = 10;
    const interval = setInterval(() => {
      iterations++;
      if (iterations >= maxIterations) {
        clearInterval(interval);
        const randomIndex = Math.floor(Math.random() * allTasks.length);
        const task = allTasks[randomIndex];
        setSelectedTask(task);
        setTimeRemaining(timerDuration * 60); // Convert minutes to seconds
        setIsActive(true);
        setIsSpinning(false);
      }
    }, 100);
  };

  const handleMarkDone = () => {
    if (selectedTask) {
      completeTask(selectedTask);
      setSelectedTask(null);
      setIsActive(false);
      setTimeRemaining(0);
    }
  };

  const handleStop = () => {
    setIsActive(false);
    setTimeRemaining(0);
    setSelectedTask(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass glass-hover text-gray-100 p-6 rounded-xl mb-6">
      {/* Single SVG that we rotate in-place. Use fast spin while selecting, slow continuous spin while timer is active. */}
      <div className="relative mb-4 mx-auto h-40 w-40">
        <div className={`wheel-wrap ${isSpinning ? 'scale-up' : ''} absolute inset-0 m-auto h-full w-full flex items-center justify-center`}>
          <img
            src={Roulette}
            alt="Task Roulette Logo"
            className={`h-full w-full object-contain transform-gpu ${isSpinning ? 'spin-fast' : isActive ? 'spin-slow' : ''}`}
          />
        </div>
      </div>
      <h2 className="flex items-center justify-center gap-3 text-2xl font-bold mb-4 text-center">
        Add tasks to the list and decide how long you'll work.</h2>
      <h3 className="text-center text-gray-400 mb-4 text-lg ">Spin the wheel to let fate decide what you'll do!</h3>
      
      {!selectedTask && !isActive && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {durations.map(duration => (
              <button
                key={duration}
                onClick={() => setTimerDuration(duration)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  timerDuration === duration
                    ? 'bg-[#722F37] text-gray-100 scale-110 border border-[#8B3E47]'
                    : 'glass hover:bg-gray-800/50'
                }`}
              >
                {duration}m
              </button>
            ))}
          </div>
          <button
            onClick={spinRoulette}
            disabled={isSpinning}
            className="w-full bg-[#722F37] hover:bg-[#8B3E47] text-gray-100 py-3 rounded-lg font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {isSpinning ? '🎲 Spinning...' : '🎲 Spin the Roulette!'}
          </button>
        </div>
      )}

      {selectedTask && (
        <div className="space-y-4 animate-fade-in">
          <div className="glass-dark rounded-lg p-4">
            <h3 className="text-xl font-bold text-gray-100">{selectedTask.name}</h3>
          </div>

          {isActive && (
            <div className="text-center">
              <div className="text-4xl font-mono font-bold mb-2 animate-pulse text-gray-100">
                {formatTime(timeRemaining)}
              </div>
              <p className="text-sm text-gray-400">Time remaining</p>
            </div>
          )}

          <div className="flex gap-2">
            {isActive && (
              <>
                <button
                  onClick={handleMarkDone}
                  className="flex-1 bg-[#2D5F5F] hover:bg-[#3D7F7F] text-gray-100 py-2 rounded-lg font-semibold transition-all transform hover:scale-105"
                >
                  ✓ Mark Done
                </button>
                <button
                  onClick={handleStop}
                  className="flex-1 bg-gray-800/50 hover:bg-gray-800 text-gray-300 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 border border-gray-700"
                >
                  Stop Timer
                </button>
              </>
            )}
            {!isActive && timeRemaining === 0 && (
              <button
                onClick={() => setSelectedTask(null)}
                className="w-full glass hover:bg-gray-800/50 py-2 rounded-lg font-semibold transition-all"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskRoulette;
