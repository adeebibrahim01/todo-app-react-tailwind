function getTodayStart() {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return today;
}

function getDateOnly(dateValue) {
    const date = new Date(dateValue);

    date.setHours(0, 0, 0, 0);

    return date;
}

export function groupTasks(tasks) {
    const today = getTodayStart();

    const groups = {
        overdue: [],
        today: [],
        upcoming: [],
        noDueDate: [],
    };

    tasks.forEach((task) => {
        if (!task.dueDate) {
            groups.noDueDate.push(task);
            return;
        }

        const dueDate = getDateOnly(task.dueDate);

        if (dueDate < today) {
            groups.overdue.push(task);
        } else if (dueDate.getTime() === today.getTime()) {
            groups.today.push(task);
        } else {
            groups.upcoming.push(task);
        }
    });

    return groups;
}