import { TaskProvider } from './context/TaskContext';
import TaskRoulette from './components/TaskRoulette';
import MainTaskList from './components/MainTaskList';
import CompletedTasks from './components/CompletedTasks';

const AppContent = () => {
  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-100 mb-8">
          <img src="/src/img/TRLogo.svg" alt="Task Roulette Logo"/>🎰 Task Roulette
        </h1>

        <TaskRoulette />

        <MainTaskList />

        <CompletedTasks />
      </div>
    </div>
  );
};

function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
}

export default App;
