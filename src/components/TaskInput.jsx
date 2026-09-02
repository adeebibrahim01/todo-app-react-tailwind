import { useState, useRef } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { validateTaskTitle } from '../utils/validation';

export default function TaskInput() {
    const { addTask } = useTaskContext();
    const [value, setValue] = useState('');
    const [error, setError] = useState('');
    const inputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        const { valid, message } = validateTaskTitle(value);
        if (!valid) {
            setError(message);
            return; // empty submission blocked, inline feedback shown
        }

        setError('');
        addTask(value.trim());
        setValue('');
        inputRef.current?.focus(); // auto-refocus after submission
    };

    const handleChange = (e) => {
        setValue(e.target.value);
        if (error) setError('');
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="flex items-center gap-2">
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={handleChange}
                    placeholder="Add a task and press Enter..."
                    aria-label="New task"
                    aria-invalid={!!error}
                    aria-describedby={error ? 'task-input-error' : undefined}
                    autoFocus
                    className={`flex-1 rounded-lg border px-4 py-2.5 text-sm text-gray-900
            placeholder:text-gray-400 outline-none transition-shadow
            focus:ring-2 focus:ring-offset-1
            ${error ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-indigo-400'}`}
                />
                <button
                    type="submit"
                    className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium
            text-white transition-colors hover:bg-indigo-700
            focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1"
                >
                    Add
                </button>
            </div>

            {error && (
                <p id="task-input-error" role="alert" className="mt-1.5 text-xs text-red-500">
                    {error}
                </p>
            )}
        </form>
    );
}