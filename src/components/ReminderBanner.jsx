export default function ReminderBanner({ onDismiss }) {
    return (
        <div
            className="mb-3 flex items-start justify-between gap-3 rounded-lg
            border border-amber-200 bg-amber-50 p-3"
        >
            <div>
                <p className="text-sm font-medium text-amber-900">
                    Notifications are disabled
                </p>

                <p className="mt-1 text-xs text-amber-700">
                    Your reminder is saved, but browser notifications are
                    blocked. You can enable notifications from your browser
                    settings.
                </p>
            </div>

            <button
                type="button"
                onClick={onDismiss}
                aria-label="Dismiss notification warning"
                className="shrink-0 text-sm text-amber-700 hover:text-amber-900"
            >
                ×
            </button>
        </div>
    );
}