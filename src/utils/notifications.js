export function isNotificationSupported() {
    const supported = 'Notification' in window;

    return supported;
}

export async function requestNotificationPermission() {
    if (!isNotificationSupported()) {
        return 'unsupported';
    }

    if (Notification.permission === 'granted') {
        return 'granted';
    }

    if (Notification.permission === 'denied') {
        return 'denied';
    }

    const permission = await Notification.requestPermission();

    return permission;
}

export function showReminderNotification(task) {
    if (!isNotificationSupported()) {
        return false;
    }

    if (Notification.permission !== 'granted') {
        return false;
    }

    try {
        new Notification('Task Reminder', {
            body: task.title,
            tag: `task-reminder-${task.id}`,
        });

        return true;
    } catch (error) {
        console.error('Notification error:', error);

        return false;
    }
}