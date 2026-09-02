const priorityOrder = {
    urgent: 1,
    high: 2,
    medium: 3,
    low: 4,
};

export function sortTasks(tasks, sortBy) {
    const sortedTasks = [...tasks];

    sortedTasks.sort((a, b) => {
        if (sortBy === 'title') {
            return a.title.localeCompare(b.title);
        }

        if (sortBy === 'priority') {
            const priorityA = priorityOrder[a.priority] || 999;
            const priorityB = priorityOrder[b.priority] || 999;

            return priorityA - priorityB;
        }

        if (sortBy === 'dueDate') {
            // Tasks without due date last 
            if (!a.dueDate && !b.dueDate) return 0;
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;

            return new Date(a.dueDate) - new Date(b.dueDate);
        }

        return 0;
    });

    return sortedTasks;
}