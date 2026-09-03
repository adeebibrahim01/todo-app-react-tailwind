import { useState } from 'react';

import { useTaskContext } from '../context/TaskContext';
import DatePicker from './DatePicker';
import ReminderPicker from './ReminderPicker';
import PermissionPrompt from './PermissionPrompt';
import ReminderBanner from './ReminderBanner';
import PriorityDropdown from './PriorityDropdown';
import { requestNotificationPermission } from '../utils/notifications';
function SubtaskItem({ task, level }) {
    const { tasks, toggleTask, addSubtask , setDependencies,} = useTaskContext();

    const [subtaskInput, setSubtaskInput] = useState('');
    const [showChildren, setShowChildren] = useState(true);

    const children = tasks.filter(
        (item) => item.parentId === task.id
    );
const completedChildren = children.filter(
    (child) => child.completed
).length;

console.log(
    'SUBTASK PROGRESS:',
    task.title,
    children.map((child) => ({
        title: child.title,
        completed: child.completed,
    }))
);
const childProgress =
    children.length > 0
        ? Math.round(
              (completedChildren / children.length) * 100
          )
        : 0;

    const handleAddSubtask = () => {
        const title = subtaskInput.trim();

        if (!title) return;

        addSubtask(task.id, title);
        setSubtaskInput('');
    };

    return (
        <div className="ml-4 border-l-2 border-indigo-100 pl-3">
            <div className="flex items-center gap-2 rounded-md bg-gray-50 px-3 py-2">
                {children.length > 0 && (
                    <button
                        type="button"
                        onClick={() =>
                            setShowChildren((current) => !current)
                        }
                        className="text-gray-400 hover:text-indigo-600"
                        aria-label={
                            showChildren
                                ? 'Hide nested subtasks'
                                : 'Show nested subtasks'
                        }
                    >
                        <span
                            className={`inline-block transition-transform ${
                                showChildren ? 'rotate-90' : ''
                            }`}
                        >
                            ›
                        </span>
                    </button>
                )}

                <button
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                        task.completed
                            ? 'border-indigo-600 bg-indigo-600'
                            : 'border-gray-300 bg-white'
                    }`}
                    aria-label={
                        task.completed
                            ? 'Mark subtask as incomplete'
                            : 'Mark subtask as complete'
                    }
                >
                    {task.completed && (
                        <span className="text-xs text-white">✓</span>
                    )}
                </button>

                <span
                    className={`text-xs ${
                        task.completed
                            ? 'text-gray-400 line-through'
                            : 'text-gray-700'
                    }`}
                >
                    {task.title}
                </span>
            </div>

{children.length > 0 && (
    <div className="mt-2 ml-6 w-full max-w-xs">
        <div className="mb-1 flex items-center justify-between">
            <span className="text-xs text-gray-500">
                Subtasks
            </span>

            <span className="text-xs font-medium text-gray-600">
                {childProgress}%
            </span>
        </div>

        <div
            className="h-2 w-full overflow-hidden rounded-full bg-gray-100"
            role="progressbar"
            aria-valuenow={childProgress}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label={`${childProgress}% of subtasks completed`}
        >
            <div
                className="h-full rounded-full bg-indigo-500 transition-all duration-300"
                style={{ width: `${childProgress}%` }}
            />
        </div>
    </div>
)}
            {level < 2 && (
                <div className="mt-2 flex items-center gap-2">
                    <input
                        type="text"
                        value={subtaskInput}
                        onChange={(e) =>
                            setSubtaskInput(e.target.value)
                        }
                        placeholder="Add subtask"
                        className="w-28 rounded-md border border-gray-200 px-2 py-1 text-xs outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                        aria-label={`Add subtask to ${task.title}`}
                    />

                    <button
                        type="button"
                        onClick={handleAddSubtask}
                        className="rounded-md bg-indigo-50 px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-100"
                    >
                        Add Subtask
                    </button>
                </div>
                
            )}
            {/* Dependency Picker */}
<div className="mt-2">
    <label
        htmlFor={`dependency-${task.id}`}
        className="text-xs text-gray-500"
    >
        Depends on
    </label>

 <select
    id={`dependency-${task.id}`}
    className="mt-1 rounded-md border border-gray-200 px-2 py-1 text-xs outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
    value={task.dependencies?.[0] || ''}
    onChange={(e) => {
        const dependencyId = e.target.value;

        setDependencies(
            task.id,
            dependencyId ? [dependencyId] : []
        );
    }}
>
        <option value="">Select a task</option>

        {tasks
            .filter((item) => item.id !== task.id)
            .map((item) => (
                <option key={item.id} value={item.id}>
                    {item.title}
                </option>
            ))}
    </select>
</div>

            {showChildren && children.length > 0 && (
                <div className="mt-2 space-y-2">
                    {children.map((child) => (
                        <SubtaskItem
                            key={child.id}
                            task={child}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
export default function TaskItem({ task, onComplete }) {
  const {
    tasks,
    toggleTask,
    setTags,
    addTag,
    setRecurrence,
    setEditScope,
    addSubtask,
    
} = useTaskContext();
    const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
    const [showReminderBanner, setShowReminderBanner] = useState(false);
    const [pendingReminder, setPendingReminder] = useState(null);
    const [tagInput, setTagInput] = useState('');
    const [subtaskInput, setSubtaskInput] = useState('');
    const [showSubtasks, setShowSubtasks] = useState(true);
    const [showEditScope, setShowEditScope] = useState(false);
    const [editScope, setSelectedEditScope] = useState('this');
    const handleAddTag = () => {
        const newTag = tagInput.trim().toLowerCase();

        if (!newTag) return;

        const currentTags = task.tags || [];

        if (currentTags.includes(newTag)) {
            setTagInput('');
            return;
        }

        setTags(task.id, [...currentTags, newTag]);
        addTag(newTag);
        setTagInput('');
    };

    const handleAddSubtask = () => {
    const title = subtaskInput.trim();

    if (!title) return;

    addSubtask(task.id, title);
    setSubtaskInput('');
};
    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };
    const handleToggle = () => {
        console.log('TOGGLE CLICK:', task.id);
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

const subtasks = tasks.filter(
    (subtask) => subtask.parentId === task.id
);
const getTaskLevel = (taskId) => {
    let level = 0;
    let currentTask = tasks.find((item) => item.id === taskId);

    while (currentTask?.parentId) {
        level += 1;
        currentTask = tasks.find(
            (item) => item.id === currentTask.parentId
        );

        if (level >= 3) {
            break;
        }
    }

    return level;
};

const taskLevel = getTaskLevel(task.id);
const getDescendants = (parentId) => {
    const children = tasks.filter(
        (item) => item.parentId === parentId
    );

    return children.flatMap((child) => [
        child,
        ...getDescendants(child.id),
    ]);
};

const progressTasks = getDescendants(task.id);

const completedSubtasks = progressTasks.filter(
    (subtask) => subtask.completed
).length;

const subtaskProgress =
    progressTasks.length > 0
        ? Math.round(
              (completedSubtasks / progressTasks.length) * 100
          )
        : 0;
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
                <div className="flex items-center gap-2">
                    <span
                        className={`text-sm ${task.completed
                            ? 'text-gray-400 line-through'
                            : 'text-gray-900'
                            }`}
                    >
                        {task.title}
                    </span>

  {subtasks.length > 0 && (
        <button
            type="button"
            onClick={() => setShowSubtasks((current) => !current)}
            className="inline-flex h-6 w-6 items-center justify-center rounded-md
            text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label={showSubtasks ? 'Hide subtasks' : 'Show subtasks'}
            title={showSubtasks ? 'Hide subtasks' : 'Show subtasks'}
        >
         <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={`h-4 w-4 transition-transform duration-200 ${
        showSubtasks ? 'rotate-90' : ''
    }`}
    aria-hidden="true"
>
    <path
        d="M7 5l5 5-5 5"
        strokeLinecap="round"
        strokeLinejoin="round"
    />
</svg>
        </button>
    )}
    {subtasks.length > 0 && (
    <div className="mt-2 w-full max-w-xs">
        <div className="mb-1 flex items-center justify-between">
            <span className="text-xs text-gray-500">
                Subtasks
            </span>

            <span className="text-xs font-medium text-gray-600">
                {subtaskProgress}%
            </span>
        </div>

        <div
            className="h-2 w-full overflow-hidden rounded-full bg-gray-100"
            role="progressbar"
            aria-valuenow={subtaskProgress}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label={`${subtaskProgress}% of subtasks completed`}
        >
            <div
                className="h-full rounded-full bg-indigo-500 transition-all duration-300"
                style={{ width: `${subtaskProgress}%` }}
            />
        </div>
    </div>
)}
                    {task.recurrence && (
                        <span
                            className="inline-flex items-center gap-1 rounded-full bg-indigo-50
            px-2 py-1 text-xs text-indigo-600"
                            title="Recurring task"
                        >
                            ↻
                            <span className="capitalize">
                                {task.recurrence.frequency}
                            </span>
                        </span>
                    )}
                    {task.recurrence && (
                        <button
                            type="button"
                            onClick={() => setShowEditScope(true)}
                            className="text-xs text-indigo-600 hover:text-indigo-800"
                        >
                            Edit
                        </button>
                    )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                    <DatePicker task={task} />

                    <ReminderPicker
                        task={task}
                        onReminderRequest={handleReminderRequest}
                    />

                    <PriorityDropdown task={task} />
                    <div className="flex items-center gap-2">
                        <label
                            htmlFor={`recurrence-${task.id}`}
                            className="text-xs text-gray-500"
                        >
                            Repeat
                        </label>

                        <select
                            value={task.recurrence?.frequency || 'none'}
                            onChange={(e) => {
                                const frequency = e.target.value;

                                if (frequency === 'none') {
                                    setRecurrence(task.id, null);
                                    return;
                                }

                                if (task.recurrence?.editScope === 'this') {
                                    setRecurrence(task.id, {
                                        ...task.recurrence,
                                        frequency,
                                        interval:
                                            frequency === 'custom'
                                                ? 1
                                                : undefined,
                                        editScope: 'this',
                                    });
                                    return;
                                }

                                setRecurrence(task.id, {
                                    frequency,
                                    interval: frequency === 'custom' ? 1 : undefined,
                                    ends: {
                                        type: 'never',
                                        date: null,
                                        occurrences: null,
                                    },
                                    completedOccurrences: 0,
                                    editScope: 'future',
                                });
                            }}
                            className="rounded-md border border-gray-200 px-2 py-1 text-xs
        outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                        >
                            <option value="">None</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="custom">Custom</option>
                        </select>
              {task.recurrence?.frequency === 'custom' && (
    <div className="mt-2 flex items-center gap-2">
        <label
            htmlFor={`recurrence-interval-${task.id}`}
            className="text-xs text-gray-500"
        >
            Every
        </label>

        <input
            id={`recurrence-interval-${task.id}`}
            type="number"
            min="1"
            value={task.recurrence.interval || 1}
            onChange={(e) => {
                const interval = Math.max(
                    1,
                    Number(e.target.value)
                );

                setRecurrence(task.id, {
                    ...task.recurrence,
                    interval,
                });
            }}
            className="w-16 rounded-md border border-gray-200 px-2 py-1 text-xs
            outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
        />

        <span className="text-xs text-gray-500">
            days
        </span>
    </div>
)}
                        {task.recurrence && (
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                <label
                                    htmlFor={`recurrence-end-${task.id}`}
                                    className="text-xs text-gray-500"
                                >
                                    Ends
                                </label>

                                <select
                                    id={`recurrence-end-${task.id}`}
                                    value={task.recurrence.ends?.type || 'never'}
                                    onChange={(e) => {
                                        const endType = e.target.value;

                                        setRecurrence(task.id, {
                                            ...task.recurrence,
                                            ends: {
                                                type: endType,
                                                date: null,
                                                occurrences: null,
                                            },
                                        });
                                    }}
                                    className="rounded-md border border-gray-200 px-2 py-1 text-xs
            outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                                >
                                    <option value="never">Never</option>
                                    <option value="date">On date</option>
                                    <option value="occurrences">After occurrences</option>
                                </select>

                                {task.recurrence.ends?.type === 'date' && (
                                    <input
                                        type="date"
                                        value={task.recurrence.ends.date || ''}
                                        onChange={(e) => {
                                            setRecurrence(task.id, {
                                                ...task.recurrence,
                                                ends: {
                                                    ...task.recurrence.ends,
                                                    date: e.target.value,
                                                },
                                            });
                                        }}
                                        className="rounded-md border border-gray-200 px-2 py-1 text-xs
                outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                                    />
                                )}

                                {task.recurrence.ends?.type === 'occurrences' && (
                                    <input
                                        type="number"
                                        min="1"
                                        value={task.recurrence.ends.occurrences || ''}
                                        onChange={(e) => {
                                            const occurrences = Number(e.target.value);

                                            setRecurrence(task.id, {
                                                ...task.recurrence,
                                                ends: {
                                                    ...task.recurrence.ends,
                                                    occurrences,
                                                },
                                            });
                                        }}
                                        placeholder="Number"
                                        className="w-20 rounded-md border border-gray-200 px-2 py-1 text-xs
                outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                                    />
                                )}
                            </div>
                        )}
                    </div>
                    {task.tags?.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                        >
                            #{tag}

                            <button
                                type="button"
                                onClick={() => {
                                    const updatedTags = task.tags.filter(
                                        (currentTag) => currentTag !== tag
                                    );

                                    setTags(task.id, updatedTags);
                                }}
                                className="text-gray-400 hover:text-red-500"
                                aria-label={`Remove tag ${tag}`}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                    <div className="mt-2 flex items-center gap-2">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            placeholder="Add tag"
                            className="w-24 rounded-md border border-gray-200 px-2 py-1 text-xs
        outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                            aria-label={`Add tag to ${task.title}`}
                        />

                        <button
                            type="button"
                            onClick={handleAddTag}
                            className="rounded-md bg-indigo-50 px-2 py-1 text-xs
        text-indigo-600 hover:bg-indigo-100"
                        >
                            Add
                        </button>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
    <input
        type="text"
        value={subtaskInput}
        onChange={(e) => setSubtaskInput(e.target.value)}
        placeholder="Add subtask"
        className="w-28 rounded-md border border-gray-200 px-2 py-1 text-xs
        outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
        aria-label={`Add subtask to ${task.title}`}
    />

    <button
        type="button"
        onClick={handleAddSubtask}
        className="rounded-md bg-indigo-50 px-2 py-1 text-xs
        text-indigo-600 hover:bg-indigo-100"
    >
        Add Subtask
    </button>
</div>

                </div>
{subtasks.length > 0 && showSubtasks && (
    <div className="mt-3 ml-6 space-y-2">
        {subtasks.map((subtask) => (
            <SubtaskItem
                key={subtask.id}
                task={subtask}
                level={1}
            />
        ))}
    </div>
)}

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
                {showEditScope && (
                    <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                        <p className="mb-2 text-xs font-medium text-gray-700">
                            Edit recurring task
                        </p>

                        <label className="flex items-center gap-2 text-xs text-gray-600">
                            <input
                                type="radio"
                                name={`edit-scope-${task.id}`}
                                value="this"
                                checked={editScope === 'this'}
                                onChange={(e) => setSelectedEditScope(e.target.value)}
                            />
                            This task
                        </label>

                        <label className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                            <input
                                type="radio"
                                name={`edit-scope-${task.id}`}
                                value="future"
                                checked={editScope === 'future'}
                                onChange={(e) => setSelectedEditScope(e.target.value)}
                            />
                            This and future tasks
                        </label>

                        <div className="mt-3 flex gap-2">
                            <button
                                type="button"
                                onClick={() => setShowEditScope(false)}
                                className="rounded-md border border-gray-200 px-3 py-1 text-xs
                text-gray-600 hover:bg-white"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setEditScope(task.id, editScope);
                                    setShowEditScope(false);
                                }}
                                className="rounded-md bg-indigo-600 px-3 py-1 text-xs
                text-white hover:bg-indigo-700"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )}
            </div>

        </li>
    );
}