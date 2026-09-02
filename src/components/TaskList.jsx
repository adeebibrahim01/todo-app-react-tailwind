import { useTaskContext } from '../context/TaskContext';

export default function TaskList() {
    const { tasks } = useTaskContext();

    if (tasks.length === 0) {
        return (
            <p className="mt-8 text-center text-sm text-gray-400">
                No tasks yet — add one above to get started.
            </p>
        );
    }

    return (
        <ul className="mt-4 flex flex-col gap-2">
            {tasks.map((task) => (
                <li
                    key={task.id}
                    className="rounded-lg border border-gray-100 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm"
                >
                    {task.title}
                </li>
            ))}
        </ul>
    );
}