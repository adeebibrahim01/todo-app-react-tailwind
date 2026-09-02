import { TaskProvider } from './context/TaskContext';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';

export default function App() {
  return (
    <TaskProvider>
      <div className="mx-auto max-w-lg px-4 py-8">
        <h1 className="mb-4 text-xl font-semibold text-gray-900">My Tasks</h1>
        <TaskInput />
        <TaskList />
      </div>
    </TaskProvider>
  );
}