import { useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { showReminderNotification } from '../utils/notifications';

export default function ReminderManager() {
    const { tasks } = useTaskContext();

    useEffect(() => {
        const checkReminders = () => {
            const now = Date.now();

            tasks.forEach((task) => {
                // Reminder nahi hai
                if (!task.reminderAt) {
                    return;
                }

                // Completed task ko reminder nahi dena
                if (task.completed) {
                    return;
                }

                const reminderTime = new Date(task.reminderAt).getTime();

                // Reminder time se kitna difference hai
                const difference = now - reminderTime;

                // Sirf scheduled time se 0-60 seconds ke andar
                if (difference >= 0 && difference <= 60000) {
                    const reminderKey =
                        `reminder-fired-${task.id}-${task.reminderAt}`;

                    // Duplicate notification prevent karo
                    if (sessionStorage.getItem(reminderKey)) {
                        return;
                    }

                    const shown = showReminderNotification(task);

                    if (shown) {
                        sessionStorage.setItem(reminderKey, 'true');
                    }
                }
            });
        };

        // Immediately check
        checkReminders();

        // Har 15 seconds baad check
        const intervalId = setInterval(checkReminders, 15000);

        return () => {
            clearInterval(intervalId);
        };
    }, [tasks]);

    return null;
}