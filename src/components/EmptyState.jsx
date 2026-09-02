export default function EmptyState({ message = 'No tasks found.' }) {
    return (
        <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 px-6 py-10 text-center">
            <div
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100"
                aria-hidden="true"
            >
                <svg
                    viewBox="0 0 24 24"
                    className="h-8 w-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5h6m-7 4h8m-8 4h5m-8 7h14a2 2 0 002-2V6a2 2 0 00-2-2h-1.5A2.5 2.5 0 0015 2h-6a2.5 2.5 0 00-2.5 2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
            </div>

            <h2 className="text-sm font-medium text-gray-700">
                No tasks found
            </h2>

            <p className="mt-1 max-w-sm text-sm text-gray-400">
                {message}
            </p>
        </div>
    );
}