import { useEffect } from 'react';

export default function Toast({ message, onUndo, onDismiss, duration = 5000 }) {
    useEffect(() => {
        const timer = setTimeout(onDismiss, duration);
        return () => clearTimeout(timer);
    }, [onDismiss, duration]);

    return (
        <div
            role="status"
            aria-live="polite"
            className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4
        rounded-lg bg-gray-900 px-4 py-3 text-sm text-white shadow-lg"
        >
            <span>{message}</span>
            <button
                type="button"
                onClick={onUndo}
                className="font-semibold text-indigo-300 underline-offset-2 hover:underline
          focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
            >
                Undo
            </button>
        </div>
    );
}