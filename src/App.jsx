import { TaskProvider } from './context/TaskContext';
import TaskRoulette from './components/TaskRoulette';
import MainTaskList from './components/MainTaskList';
import CompletedTasks from './components/CompletedTasks';
import TRLogo from './assets/TRLogo.svg'
import CongratsModal from './components/CongratsModal';

const AppContent = () => {
  return (
    <div className="min-h-screen bg-gray-900 py-6 px-4">
      <div className="max-w-4xl mx-auto">
      <h1 className="flex items-center justify-center text-4xl font-bold text-gray-100 mb-4 gap-3">
  <img 
    src={TRLogo} 
    alt="Task Roulette Logo" 
    className="h-48 w-auto"
  />Task Roulette
</h1>

        <TaskRoulette />

        <MainTaskList />

        <CompletedTasks />
      </div>
     <CongratsModal />
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
