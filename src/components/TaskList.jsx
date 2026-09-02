import { useState, useCallback } from 'react';
import { useTaskContext } from '../context/TaskContext';
import TaskItem from './TaskItem';
import Toast from './Toast';
import SortDropdown from './SortDropdown';
import SectionHeader from './SectionHeader';
import EmptyState from './EmptyState';
import { sortTasks } from '../utils/sortTasks';
import { groupTasks } from '../utils/groupTasks';

export default function TaskList() {
    const { tasks, toggleTask, sortBy } = useTaskContext();

    const [undoTask, setUndoTask] = useState(null);

    // Active aur completed tasks separate
    const activeTasks = tasks.filter((task) => !task.completed);
    const completedTasks = tasks.filter((task) => task.completed);

    // Pehle sort
    const sortedActiveTasks = sortTasks(activeTasks, sortBy);

    // Phir groups mein divide
    const {
        overdue,
        today,
        upcoming,
        noDueDate,
    } = groupTasks(sortedActiveTasks);

    const handleComplete = useCallback((task) => {
        setUndoTask(task);
    }, []);

    const handleUndo = () => {
        if (undoTask) {
            toggleTask(undoTask.id);
            setUndoTask(null);
        }
    };

    const handleDismiss = () => {
        setUndoTask(null);
    };

    // Bilkul koi task nahi
    if (tasks.length === 0) {
        return (
            <EmptyState
                message="No tasks yet — add a task above to get started."
            />
        );
    }

    return (
        <div className="mt-4">
            {/* Sort Dropdown */}
            <div className="mb-6 flex justify-end">
                <SortDropdown />
            </div>

            {/* Overdue */}
            {overdue.length > 0 && (
                <section className="mb-6">
                    <SectionHeader title="Overdue" />

                    <ul className="flex flex-col gap-2">
                        {overdue.map((task) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onComplete={handleComplete}
                            />
                        ))}
                    </ul>
                </section>
            )}

            {/* Today */}
            {today.length > 0 && (
                <section className="mb-6">
                    <SectionHeader title="Today" />

                    <ul className="flex flex-col gap-2">
                        {today.map((task) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onComplete={handleComplete}
                            />
                        ))}
                    </ul>
                </section>
            )}

            {/* Upcoming */}
            {upcoming.length > 0 && (
                <section className="mb-6">
                    <SectionHeader title="Upcoming" />

                    <ul className="flex flex-col gap-2">
                        {upcoming.map((task) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onComplete={handleComplete}
                            />
                        ))}
                    </ul>
                </section>
            )}

            {/* No Due Date */}
            {noDueDate.length > 0 && (
                <section className="mb-6">
                    <SectionHeader title="No Due Date" />

                    <ul className="flex flex-col gap-2">
                        {noDueDate.map((task) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onComplete={handleComplete}
                            />
                        ))}
                    </ul>
                </section>
            )}

            {/* Completed */}
            {completedTasks.length > 0 && (
                <section className="mt-6">
                    <SectionHeader title="Completed" />

                    <ul className="flex flex-col gap-2">
                        {completedTasks.map((task) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onComplete={handleComplete}
                            />
                        ))}
                    </ul>
                </section>
            )}

            {/* Undo Toast */}
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