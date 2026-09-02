export default function PermissionPrompt({
    onEnable,
    onNotNow,
}) {
    return (
        <div className="mb-3 rounded-lg border border-indigo-100 bg-indigo-50 p-3">
            <p className="text-sm font-medium text-indigo-900">
                Enable notifications?
            </p>

            <p className="mt-1 text-xs text-indigo-700">
                Allow notifications so you can receive task reminders.
            </p>

            <div className="mt-3 flex gap-2">
                <button
                    type="button"
                    onClick={onEnable}
                    className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs
                    font-medium text-white hover:bg-indigo-700"
                >
                    Enable notifications
                </button>

                <button
                    type="button"
                    onClick={onNotNow}
                    className="rounded-md px-3 py-1.5 text-xs
                    text-gray-600 hover:bg-gray-100"
                >
                    Not now
                </button>
            </div>
        </div>
    );
}