import { TaskProvider } from './context/TaskContext';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import ReminderManager from './components/ReminderManager';
export default function App() {
    return (
        <TaskProvider>
                      <ReminderManager />

            <main className="min-h-screen px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-10">
                <div className="mx-auto w-full max-w-3xl">
                    <h1 className="mb-4 text-xl font-semibold text-gray-900 sm:text-2xl">
    My Tasks
</h1>

                    <TaskInput />
                    <TaskList />
                </div>
            </main>
        </TaskProvider>
    );
}