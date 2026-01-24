# Task Roulette 🎰

A beautiful and interactive to-do list application with a unique Task Roulette feature that randomly selects tasks and helps you focus with a timer.

## Features

### Core Features
- **Task Lists**: Create multiple lists to organize your tasks
- **Tasks**: Add, edit, and delete tasks within lists
- **Simple Structure**: Clean list → task organization (similar to MS To Do or Wunderlist)

### Task Roulette Feature 🎲
- Randomly selects a task from all your tasks
- Timer options: 5, 10, 15, 30, or 60 minutes
- Countdown timer with visual feedback
- Mark task as done early or let timer complete
- Automatically moves completed tasks to the Completed Tasks section

### Completed Tasks
- View all completed tasks
- Re-add tasks back to their original location
- Delete tasks permanently

## Tech Stack

- **React 18** with functional components and hooks
- **TailwindCSS** for styling
- **Vite** for fast development and building
- **Context API** for state management

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Create Lists**: Click "Add List" to create a new task list
2. **Add Tasks**: Within each list, click "Add Task" to add individual tasks
4. **Use Task Roulette**: 
   - Select a timer duration (5, 10, 15, 30, or 60 minutes)
   - Click "Spin the Roulette!" to randomly select a task
   - Work on the task while the timer counts down
   - Mark it done early or wait for the timer to complete
5. **Manage Completed Tasks**: View, re-add, or permanently delete completed tasks

## Project Structure

```
src/
  ├── components/
  │   ├── TaskRoulette.jsx    # Roulette banner with timer
  │   ├── TaskList.jsx        # Task list component
  │   ├── Task.jsx            # Individual task component
  │   └── CompletedTasks.jsx  # Completed tasks section
  ├── context/
  │   └── TaskContext.jsx     # State management
  ├── App.jsx                 # Main app component
  ├── main.jsx               # Entry point
  └── index.css              # Global styles
```

## License

See LICENSE file for details.
