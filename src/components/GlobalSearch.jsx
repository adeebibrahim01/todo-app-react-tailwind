import { useEffect, useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
function highlightMatch(text, query) {
    if (!query.trim()) {
        return text;
    }

    const characters = query.toLowerCase().split('');
    const result = [];
    let queryIndex = 0;

    for (let i = 0; i < text.length; i++) {
        if (
            queryIndex < characters.length &&
            text[i].toLowerCase() === characters[queryIndex]
        ) {
            result.push(
                <span
                    key={i}
                    className="font-semibold text-indigo-600"
                >
                    {text[i]}
                </span>
            );
            queryIndex++;
        } else {
            result.push(text[i]);
        }
    }

    return result;
}
export default function GlobalSearch() {
const {
    searchQuery,
    setSearchQuery,
    searchTasks,
    includeCompleted,
    setIncludeCompleted,
    includeArchived,
    setIncludeArchived,
} = useTaskContext();

    const [isOpen, setIsOpen] = useState(false);
const [selectedIndex, setSelectedIndex] = useState(0);
    useEffect(() => {
    const handleShortcut = (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
            event.preventDefault();
            setIsOpen(true);
        }

        if (event.key === 'Escape') {
            setIsOpen(false);
        }
    };

    window.addEventListener('keydown', handleShortcut);

    return () => {
        window.removeEventListener('keydown', handleShortcut);
    };
}, []);
    const results = searchTasks();
useEffect(() => {
    const handleNavigation = (event) => {
        if (!isOpen || results.length === 0) {
            return;
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setSelectedIndex((current) =>
                Math.min(current + 1, results.length - 1)
            );
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();
            setSelectedIndex((current) =>
                Math.max(current - 1, 0)
            );
        }
        if (event.key === 'Enter') {
    event.preventDefault();

    const selectedTask = results[selectedIndex];

    if (selectedTask) {
        setIsOpen(false);
    }
}
    };

    window.addEventListener('keydown', handleNavigation);

    return () => {
        window.removeEventListener('keydown', handleNavigation);
    };
}, [isOpen, results.length]);
    if (!isOpen) {
    return (
        <button
            type="button"
            onClick={() => setIsOpen(true)}
    className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
        >
            Search
        </button>
    );
}
    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 px-4 pt-24">
            <div className="w-full max-w-xl rounded-xl bg-white shadow-xl">
                <div className="flex justify-end border-b border-gray-200 px-4 pt-3">
    <button
        type="button"
        onClick={() => setIsOpen(false)}
        className="text-sm text-gray-500 hover:text-gray-700"
    >
        Esc
    </button>
</div>
                {/* Search Input */}
                <div className="border-b border-gray-200 p-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search tasks..."
                        autoFocus
                        className="w-full text-sm outline-none"
                    />
                </div>
<div className="flex items-center gap-2 px-4 py-2 text-xs text-gray-600">
    <input
        type="checkbox"
        checked={includeCompleted}
        onChange={(e) => setIncludeCompleted(e.target.checked)}
    />
    <label>Include completed tasks</label>
    <div className="flex items-center gap-2 px-4 py-2 text-xs text-gray-600">
    <input
        type="checkbox"
        checked={includeArchived}
        onChange={(e) => setIncludeArchived(e.target.checked)}
    />
    <label>Include archived tasks</label>
</div>
</div>
                {/* Results */}
                <div className="max-h-80 overflow-y-auto p-2">
                    {searchQuery.trim() ? (
                        results.length > 0 ? (
                       
                                results.map((task, index) => (
                                <div
                                    key={task.id}
                                    className={`rounded-lg px-3 py-2 text-sm ${
    index === selectedIndex
        ? 'bg-indigo-50 text-indigo-700'
        : 'hover:bg-gray-100'
}`}
                                >
                                    {highlightMatch(task.title, searchQuery)}
                                </div>
                            ))
                        ) : (
                            <p className="px-3 py-4 text-center text-sm text-gray-500">
                                No tasks found.
                            </p>
                        )
                    ) : (
                        <p className="px-3 py-4 text-center text-sm text-gray-500">
                            Start typing to search...
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}