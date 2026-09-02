import { useState, useCallback } from 'react';
import { useTaskContext } from '../context/TaskContext';
import TaskItem from './TaskItem';
import Toast from './Toast';

export default function TaskList() {
    const { tasks, toggleTask } = useTaskContext();
    const [undoTask, setUndoTask] = useState(null);

    const activeTasks = tasks.filter((t) => !t.completed);
    const completedTasks = tasks.filter((t) => t.completed);

    const handleComplete = useCallback((task) => {
        setUndoTask(task);
    }, []);

    const handleUndo = () => {
        if (undoTask) {
            toggleTask(undoTask.id); // wapas incomplete state mein le jao
            setUndoTask(null);
        }
    };

    const handleDismiss = () => setUndoTask(null);

    if (tasks.length === 0) {
        return (
            <p className="mt-8 text-center text-sm text-gray-400">
                No tasks yet — add one above to get started.
            </p>
        );
    }

    return (
        <div className="mt-4">
            {activeTasks.length > 0 && (
                <ul className="flex flex-col gap-2">
                    {activeTasks.map((task) => (
                        <TaskItem key={task.id} task={task} onComplete={handleComplete} />
                    ))}
                </ul>
            )}

            {completedTasks.length > 0 && (
                <div className="mt-6">
                    <div className="mb-2 flex items-center gap-2">
                        <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Completed
                        </span>
                        <span className="h-px flex-1 bg-gray-200" />
                    </div>
                    <ul className="flex flex-col gap-2">
                        {completedTasks.map((task) => (
                            <TaskItem key={task.id} task={task} onComplete={handleComplete} />
                        ))}
                    </ul>
                </div>
            )}

            {undoTask && (
                <Toast
                    message={`"${undoTask.title}" marked as complete`}
                    onUndo={handleUndo}
                    onDismiss={handleDismiss}
                />
            )}
        </div>
    );
}