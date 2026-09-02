import { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import QuickDateChips from './QuickDateChips';

export default function DatePicker({ task }) {
    const { setDueDate } = useTaskContext();

    const [open, setOpen] = useState(false);

    // Current month ko track karega
    const [currentMonth, setCurrentMonth] = useState(() => {
        if (task.dueDate) {
            const [year, month] = task.dueDate.split('-').map(Number);

            return new Date(year, month - 1, 1);
        }

        const today = new Date();

        return new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );
    });

    // Date ko YYYY-MM-DD mein convert karega
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    // Due date select
    const handleDateSelect = (date) => {
        setDueDate(task.id, formatDate(date));
        setOpen(false);
    };

    // Quick date select
    const handleQuickDate = (date) => {
        setDueDate(task.id, formatDate(date));
        setOpen(false);
    };

    // Due date clear
    const handleClear = () => {
        setDueDate(task.id, null);
        setOpen(false);
    };

    // Previous month
    const handlePreviousMonth = () => {
        setCurrentMonth((current) => {
            return new Date(
                current.getFullYear(),
                current.getMonth() - 1,
                1
            );
        });
    };

    // Next month
    const handleNextMonth = () => {
        setCurrentMonth((current) => {
            return new Date(
                current.getFullYear(),
                current.getMonth() + 1,
                1
            );
        });
    };

    // Calendar ke saare days generate karega
    const getCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const startDay = firstDay.getDay();
        const totalDays = lastDay.getDate();

        const days = [];

        // Previous month's empty days
        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }

        // Current month's days
        for (let day = 1; day <= totalDays; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    const calendarDays = getCalendarDays();

    const today = formatDate(new Date());

    const monthName = currentMonth.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    });

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
                {task.dueDate
                    ? `Due: ${task.dueDate}`
                    : 'Set due date'}
            </button>

            {open && (
                <div
                    className="absolute left-0 top-full z-20 mt-2 w-72
                    rounded-xl border border-gray-200 bg-white p-4 shadow-lg"
                >
                    <p className="mb-3 text-sm font-medium text-gray-700">
                      Due date  
                        </p>

                    {/* Quick Date Chips */}
                    <QuickDateChips onSelect={handleQuickDate} />

                    {/* Calendar Header */}
                    <div className="mt-4 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={handlePreviousMonth}
                            aria-label="Previous month"
                            className="flex h-8 w-8 items-center justify-center
                            rounded-lg text-gray-500 hover:bg-gray-100"
                        >
                            ←
                        </button>

                        <span className="text-sm font-semibold text-gray-700">
                            {monthName}
                        </span>

                        <button
                            type="button"
                            onClick={handleNextMonth}
                            aria-label="Next month"
                            className="flex h-8 w-8 items-center justify-center
                            rounded-lg text-gray-500 hover:bg-gray-100"
                        >
                            →
                        </button>
                    </div>

                    {/* Week Days */}
                    <div className="mt-4 grid grid-cols-7 gap-1 text-center">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                            (day) => (
                                <span
                                    key={day}
                                    className="py-1 text-[10px] font-medium
                                    text-gray-400"
                                >
                                    {day}
                                </span>
                            )
                        )}
                    </div>

                    {/* Calendar Days */}
                    <div className="mt-1 grid grid-cols-7 gap-1">
                        {calendarDays.map((date, index) => {
                            if (!date) {
                                return (
                                    <span
                                        key={`empty-${index}`}
                                        className="h-8"
                                    />
                                );
                            }

                            const dateValue = formatDate(date);
                            const isSelected =
                                task.dueDate === dateValue;

                            const isToday =
                                today === dateValue;

                            return (
                                <button
                                    key={dateValue}
                                    type="button"
                                    onClick={() =>
                                        handleDateSelect(date)
                                    }
                                    className={`flex h-8 items-center
                                    justify-center rounded-lg text-xs
                                    transition-colors
                                    ${
                                        isSelected
                                            ? 'bg-indigo-600 font-semibold text-white'
                                            : isToday
                                            ? 'border border-indigo-400 text-indigo-600'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                    aria-label={`Select ${dateValue}`}
                                >
                                    {date.getDate()}
                                </button>
                            );
                        })}
                    </div>

                    {/* Clear */}
                    {task.dueDate && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="mt-4 w-full rounded-lg px-3 py-2
                            text-sm text-red-500 hover:bg-red-50"
                        >
                            Clear due date
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}