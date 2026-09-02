import { useTaskContext } from '../context/TaskContext';

export default function SortDropdown() {
    const { sortBy, setSortBy } = useTaskContext();

    const handleChange = (e) => {
        setSortBy(e.target.value);
    };

    return (
        <div className="flex items-center gap-2">
         <label className="text-sm font-medium text-gray-600">
         Sort by
        </label>

            <select
                id="task-sort"
                value={sortBy}
                onChange={handleChange}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm
                text-gray-700 outline-none transition-shadow
                focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1"
            >
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="title">Alphabetical</option>
            </select>
        </div>
    );
}