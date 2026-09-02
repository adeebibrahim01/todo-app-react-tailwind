export default function QuickDateChips({ onSelect }) {
    const getDate = (daysFromToday) => {
        const date = new Date();

        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + daysFromToday);

        return date;
    };

    const nextWeek = () => {
        const date = new Date();

        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + 7);

        return date;
    };

    return (
        <div className="flex flex-wrap gap-2">
            <button
                type="button"
                onClick={() => onSelect(getDate(0))}
                className="rounded-full border border-gray-200 px-3 py-1.5
                text-xs text-gray-600 hover:bg-gray-100"
            >
                Today
            </button>

            <button
                type="button"
                onClick={() => onSelect(getDate(1))}
                className="rounded-full border border-gray-200 px-3 py-1.5
                text-xs text-gray-600 hover:bg-gray-100"
            >
                Tomorrow
            </button>

            <button
                type="button"
                onClick={() => onSelect(nextWeek())}
                className="rounded-full border border-gray-200 px-3 py-1.5
                text-xs text-gray-600 hover:bg-gray-100"
            >
                Next Week
            </button>
        </div>
    );
}