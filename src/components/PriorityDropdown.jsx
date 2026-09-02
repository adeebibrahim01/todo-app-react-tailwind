import { useTaskContext } from '../context/TaskContext';

const priorities = [
    {
        value: null,
        label: 'No Priority',
        icon: '—',
    },
    {
        value: 'low',
        label: 'Low',
        icon: '↓',
    },
    {
        value: 'medium',
        label: 'Medium',
        icon: '→',
    },
    {
        value: 'high',
        label: 'High',
        icon: '↑',
    },
    {
        value: 'urgent',
        label: 'Urgent',
        icon: '⚡',
    },
];

export default function PriorityDropdown({ task }) {
    const { setPriority } = useTaskContext();

    const handleChange = (e) => {
        const value = e.target.value;

        setPriority(
            task.id,
            value === '' ? null : value
        );
    };

    return (
        <div className="flex items-center gap-2">
            <label
                htmlFor={`priority-${task.id}`}
                className="sr-only"
            >
                Priority
            </label>

            <span
                className="text-sm"
                aria-hidden="true"
            >
                {priorities.find(
                    (priority) => priority.value === task.priority
                )?.icon || '—'}
            </span>

            <select
                id={`priority-${task.id}`}
                value={task.priority || ''}
                onChange={handleChange}
                aria-label={`Priority for ${task.title}`}
                className="rounded-lg border border-gray-200 bg-white px-2 py-1
                text-sm text-gray-700 outline-none transition-shadow
                focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1"
            >
                {priorities.map((priority) => (
                    <option
                        key={priority.label}
                        value={priority.value || ''}
                    >
                        {priority.icon} {priority.label}
                    </option>
                ))}
            </select>
        </div>
    );
}