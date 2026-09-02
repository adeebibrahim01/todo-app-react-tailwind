import { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import DatePicker from './DatePicker';
import ReminderPicker from './ReminderPicker';
import PermissionPrompt from './PermissionPrompt';
import ReminderBanner from './ReminderBanner';
import PriorityDropdown from './PriorityDropdown';
import { requestNotificationPermission } from '../utils/notifications';

export default function TaskItem({ task, onComplete }) {
    const { toggleTask } = useTaskContext();
    const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
    const [showReminderBanner, setShowReminderBanner] = useState(false);
    const [pendingReminder, setPendingReminder] = useState(null);
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
    const handleReminderRequest = (saveReminder) => {
    if (!('Notification' in window)) {
        saveReminder();
        setShowReminderBanner(true);
        return;
    }

    if (Notification.permission === 'granted') {
        saveReminder();
        return;
    }

    if (Notification.permission === 'denied') {
        saveReminder();
        setShowReminderBanner(true);
        return;
    }

    setPendingReminder(() => saveReminder);
    setShowPermissionPrompt(true);
};

const handleEnableNotifications = async () => {
    const permission = await requestNotificationPermission();

    setShowPermissionPrompt(false);

    if (permission === 'granted') {
        if (pendingReminder) {
            pendingReminder();
        }
    } else {
        if (pendingReminder) {
            pendingReminder();
        }

        setShowReminderBanner(true);
    }

    setPendingReminder(null);
};
const handleNotNow = () => {
    setShowPermissionPrompt(false);

    if (pendingReminder) {
        pendingReminder();
    }

    setPendingReminder(null);
    setShowReminderBanner(true);
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

       <div className="flex flex-1 flex-col">
    <span
        className={`text-sm ${
            task.completed
                ? 'text-gray-400 line-through'
                : 'text-gray-900'
        }`}
    >
        {task.title}
    </span>

    <div className="mt-1 flex flex-wrap items-center gap-2">
        <DatePicker task={task} />

    <ReminderPicker
        task={task}
        onReminderRequest={handleReminderRequest}
    />
     <PriorityDropdown task={task} />
    </div>

    {showPermissionPrompt && (
        <PermissionPrompt
            onEnable={handleEnableNotifications}
            onNotNow={handleNotNow}
        />
    )}

    {showReminderBanner && (
        <ReminderBanner
            onDismiss={() => setShowReminderBanner(false)}
        />
    )}
</div>

        </li>
    );
}