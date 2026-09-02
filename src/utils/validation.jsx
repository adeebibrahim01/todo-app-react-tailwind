export function validateTaskTitle(title) {
    const trimmed = title.trim();
    if (trimmed.length === 0) {
        return { valid: false, message: 'Task cannot be empty' };
    }
    return { valid: true, message: '' };
}