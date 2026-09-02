import { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';

export default function ReminderPicker({ task, onReminderRequest }) {
    const { setReminder } = useTaskContext();

    const [open, setOpen] = useState(false);

    const getInitialDate = () => {
        if (task.reminderAt) {
            return task.reminderAt.slice(0, 10);
        }

        if (task.dueDate) {
            return task.dueDate;
        }

        return new Date().toISOString().slice(0, 10);
    };

    const getInitialTime = () => {
        if (task.reminderAt) {
            return task.reminderAt.slice(11, 16);
        }

        return '09:00';
    };

    const [date, setDate] = useState(getInitialDate);
    const [time, setTime] = useState(getInitialTime);

   const handleSave = () => {
    if (!date || !time) return;

    const reminderAt = `${date}T${time}`;

    // Save button click karte hi picker hide
    setOpen(false);

    onReminderRequest(() => {
        setReminder(task.id, reminderAt);
    });
};

    const handleClear = () => {
        setReminder(task.id, null);
        setOpen(false);
    };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="rounded-md px-2 py-1 text-xs text-gray-500
                transition-colors hover:bg-gray-100 hover:text-gray-700
                focus:outline-none focus:ring-2 focus:ring-indigo-400"
                aria-expanded={open}
            >
                {task.reminderAt
                    ? `Reminder: ${task.reminderAt.replace('T', ' ')}`
                    : 'Set reminder'}
            </button>

            {open && (
                <div
                    className="absolute right-0 top-full z-30 mt-2 w-72
                    rounded-xl border border-gray-200 bg-white p-4 shadow-lg"
                >
                  <h3 className="mb-4 text-sm font-semibold text-gray-800">
                Set reminder
                </h3>

                    <div className="space-y-3">
                        <div>
                            <label
                                htmlFor={`reminder-date-${task.id}`}
                                className="mb-1 block text-xs font-medium text-gray-500"
                            >
                                Date
                            </label>

                            <input
                                id={`reminder-date-${task.id}`}
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full rounded-lg border border-gray-200
                                px-3 py-2 text-sm outline-none
                                focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor={`reminder-time-${task.id}`}
                                className="mb-1 block text-xs font-medium text-gray-500"
                            >
                                Time
                            </label>

                            <input
                                id={`reminder-time-${task.id}`}
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full rounded-lg border border-gray-200
                                px-3 py-2 text-sm outline-none
                                focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                        <button
                            type="button"
                            onClick={handleSave}
                            className="flex-1 rounded-lg bg-indigo-600 px-3 py-2
                            text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            Save reminder
                        </button>

                        {task.reminderAt && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="rounded-lg px-3 py-2 text-sm
                                text-red-500 hover:bg-red-50"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}