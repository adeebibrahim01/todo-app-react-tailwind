import { useTaskContext } from '../context/TaskContext';

export default function TaskItem({ task, onComplete }) {
    const { toggleTask } = useTaskContext();

    const handleToggle = () => {
        const wasCompleted = task.completed;
        toggleTask(task.id);

        // sirf complete karte waqt undo toast dikhao (uncomplete karte waqt nahi)
        if (!wasCompleted) {
            onComplete(task);
        }
    };

    const handleKeyDown = (e) => {
        // Tab se focus already native behavior hai; Space se toggle explicitly handle karo
        if (e.key === ' ') {
            e.preventDefault();
            handleToggle();
        }
    };

    return (
        <li
            className={`flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-4 py-3
        shadow-sm transition-opacity ${task.completed ? 'opacity-60' : 'opacity-100'}`}
        >
            <button
                type="button"
                role="checkbox"
                aria-checked={task.completed}
                aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
                onClick={handleToggle}
                onKeyDown={handleKeyDown}
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2
          transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1
          ${task.completed
                        ? 'border-indigo-600 bg-indigo-600'
                        : 'border-gray-300 bg-white hover:border-indigo-400'}`}
            >
                {task.completed && (
                    <svg viewBox="0 0 12 12" className="h-3 w-3 fill-white" aria-hidden="true">
                        <path d="M4.5 8.5L2 6l-.7.7L4.5 9.9l6.2-6.2L10 3l-5.5 5.5z" />
                    </svg>
                )}
            </button>

            <span
                className={`flex-1 text-sm ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'
                    }`}
            >
                {task.title}
            </span>
        </li>
    );
}