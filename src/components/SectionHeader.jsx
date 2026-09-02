export default function SectionHeader({ title }) {
    return (
        <div className="mb-3 flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                {title}
            </span>

            <span className="h-px flex-1 bg-gray-200" />
        </div>
    );
}