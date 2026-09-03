import {
    createContext,
    useContext,
    useReducer,
    useCallback,
    useEffect,
    useState,
} from 'react';
import { fuzzyMatch } from '../utils/fuzzySearch';

const TaskContext = createContext(null);

const initialState = {
tasks: JSON.parse(localStorage.getItem('tasks') || '[]').map((task) => ({
        ...task,
        parentId: task.parentId ?? null,
        dependencies: task.dependencies ?? [],
    })),
    // FR-05
    tags: JSON.parse(localStorage.getItem('taskTags') || '[]'),

    sortBy: localStorage.getItem('taskSortBy') || 'dueDate',
};

function taskReducer(state, action) {
    switch (action.type) {
        case 'ADD_TASK':
            return {
                ...state,
                tasks: [action.payload, ...state.tasks],
            };

        case 'TOGGLE_TASK': {
            const task = state.tasks.find((t) => t.id === action.payload);

            if (!task) {
                return state;
            }

            const willComplete = !task.completed;


            // FR-08: Dependency validation
if (willComplete && task.dependencies?.length > 0) {
    const hasIncompleteDependency = task.dependencies.some(
        (dependencyId) => {
            const dependency = state.tasks.find(
                (t) => t.id === dependencyId
            );

            return dependency && !dependency.completed;
        }
    );

    if (hasIncompleteDependency) {
        return state;
    }
}

            // Normal task ya completed task ko uncomplete karna
            if (!willComplete || !task.recurrence) {
                return {
                    ...state,
                    tasks: state.tasks.map((t) =>
                        t.id === action.payload
                            ? { ...t, completed: willComplete }
                            : t
                    ),
                };
            }

            const recurrence = task.recurrence;

            // Daily, Weekly, Monthly aur Custom
            if (
                !['daily', 'weekly', 'monthly', 'custom'].includes(
                    recurrence.frequency
                )
            ) {
                return {
                    ...state,
                    tasks: state.tasks.map((t) =>
                        t.id === action.payload
                            ? { ...t, completed: true }
                            : t
                    ),
                };
            }

            const currentDate = task.dueDate
                ? new Date(`${task.dueDate}T00:00:00`)
                : new Date();

            const nextDate = new Date(currentDate);


            if (recurrence.frequency === 'daily') {
                nextDate.setDate(nextDate.getDate() + 1);
            }

            if (recurrence.frequency === 'weekly') {
                nextDate.setDate(nextDate.getDate() + 7);
            }

            if (recurrence.frequency === 'monthly') {
                const originalDay = currentDate.getDate();

                nextDate.setDate(1);
                nextDate.setMonth(nextDate.getMonth() + 1);

                const lastDayOfNextMonth = new Date(
                    nextDate.getFullYear(),
                    nextDate.getMonth() + 1,
                    0
                ).getDate();

                nextDate.setDate(
                    Math.min(originalDay, lastDayOfNextMonth)
                );
            }

            if (recurrence.frequency === 'custom') {
                const interval = Math.max(
                    1,
                    Number(recurrence.interval) || 1
                );

                console.log('CUSTOM INTERVAL:', recurrence.interval);

                nextDate.setDate(nextDate.getDate() + interval);

                console.log('CURRENT DATE:', currentDate);
                console.log('NEXT DATE:', nextDate);
            }

            const nextDueDate =
                `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(nextDate.getDate()).padStart(2, '0')}`;


            console.log('GENERATED DUE DATE:', nextDueDate);
            // Recurrence occurrences limit
            // Recurrence occurrences limit
            if (
                recurrence.ends?.type === 'occurrences' &&
                recurrence.ends.occurrences
            ) {
                const completedOccurrences =
                    task.recurrence.completedOccurrences || 0;

                const nextCompletedOccurrences =
                    completedOccurrences + 1;

                if (
                    nextCompletedOccurrences >=
                    recurrence.ends.occurrences
                ) {
                    return {
                        ...state,
                        tasks: state.tasks.map((t) =>
                            t.id === action.payload
                                ? {
                                    ...t,
                                    completed: true,
                                    recurrence: {
                                        ...t.recurrence,
                                        completedOccurrences:
                                            nextCompletedOccurrences,
                                    },
                                }
                                : t
                        ),
                    };
                }
            }
            // Recurrence end date check
            if (
                recurrence.ends?.type === 'date' &&
                recurrence.ends.date &&
                nextDueDate > recurrence.ends.date
            ) {
                return {
                    ...state,
                    tasks: state.tasks.map((t) =>
                        t.id === action.payload
                            ? { ...t, completed: true }
                            : t
                    ),
                };
            }
            const nextTask = {
                ...task,
                id: crypto.randomUUID(),
                completed: false,
                createdAt: new Date().toISOString(),
                dueDate: nextDueDate,
                recurrence: {
                    ...task.recurrence,
                    completedOccurrences:
                        (task.recurrence.completedOccurrences || 0) + 1,
                    editScope: 'future',
                },
            };

            return {
                ...state,
                tasks: [
                    nextTask,
                    ...state.tasks.map((t) =>
                        t.id === action.payload
                            ? { ...t, completed: true }
                            : t
                    ),
                ],
            };
        }

        case 'SET_SORT_BY':
            return {
                ...state,
                sortBy: action.payload,
            };

        // Due date set / edit / clear
        case 'SET_DUE_DATE':
            return {
                ...state,
                tasks: state.tasks.map((t) =>
                    t.id === action.payload.id
                        ? {
                            ...t,
                            dueDate: action.payload.dueDate,
                        }
                        : t
                ),
            };

        // Reminder set / edit / clear
        case 'SET_REMINDER':
            return {
                ...state,
                tasks: state.tasks.map((t) =>
                    t.id === action.payload.id
                        ? {
                            ...t,
                            reminderAt: action.payload.reminderAt,
                        }
                        : t
                ),
            };
        case 'SET_PRIORITY':
            return {
                ...state,
                tasks: state.tasks.map((t) =>
                    t.id === action.payload.id
                        ? {
                            ...t,
                            priority: action.payload.priority,
                        }
                        : t
                ),
            };
        case 'SET_TAGS':
            return {
                ...state,
                tasks: state.tasks.map((t) =>
                    t.id === action.payload.id
                        ? {
                            ...t,
                            tags: action.payload.tags,
                        }
                        : t
                ),
            };
        case 'SET_RECURRENCE':
            return {
                ...state,
                tasks: state.tasks.map((t) =>
                    t.id === action.payload.id
                        ? {
                            ...t,
                            recurrence: action.payload.recurrence,
                        }
                        : t
                ),
            };

            case 'SET_DEPENDENCIES':
    return {
        ...state,
        tasks: state.tasks.map((task) =>
            task.id === action.payload.taskId
                ? {
                      ...task,
                      dependencies: action.payload.dependencies,
                  }
                : task
        ),
    };

        case 'SET_EDIT_SCOPE':
            return {
                ...state,
                tasks: state.tasks.map((t) =>
                    t.id === action.payload.id
                        ? {
                            ...t,
                            recurrence: {
                                ...t.recurrence,
                                editScope: action.payload.scope,
                            },
                        }
                        : t
                ),
            };

        case 'ADD_TAG':
            return {
                ...state,
                tags: state.tags.includes(action.payload)
                    ? state.tags
                    : [...state.tags, action.payload],
            };
        default:
            return state;
    }
}

export function TaskProvider({ children }) {
    const [state, dispatch] = useReducer(taskReducer, initialState);
const [searchQuery, setSearchQuery] = useState('');
const [includeCompleted, setIncludeCompleted] = useState(false);
const [includeArchived, setIncludeArchived] = useState(false);
const addTask = useCallback((title) => {
    const newTask = {
        id: crypto.randomUUID(),
        title,
        createdAt: new Date().toISOString(),
        completed: false,
        archived: false,
        parentId: null,
        dependencies: [],

        // FR-04
        dueDate: null,
        reminderAt: null,

        // FR-05
        priority: null,
        tags: [],

        // FR-06
        recurrence: null,
    };

    dispatch({
        type: 'ADD_TASK',
        payload: newTask,
    });
}, []);
 const addSubtask = useCallback((parentId, title) => {
    const newSubtask = {
        id: crypto.randomUUID(),
        title,
        createdAt: new Date().toISOString(),
        completed: false,
        archived: false,
        parentId,
        dependencies: [],

        // FR-04
        dueDate: null,
        reminderAt: null,

        // FR-05
        priority: null,
        tags: [],

        // FR-06
        recurrence: null,
    };

    dispatch({
        type: 'ADD_TASK',
        payload: newSubtask,
    });
}, []);

    const toggleTask = useCallback((id) => {
        dispatch({
            type: 'TOGGLE_TASK',
            payload: id,
        });
    }, []);

    const setSortBy = useCallback((sortBy) => {
        dispatch({
            type: 'SET_SORT_BY',
            payload: sortBy,
        });
    }, []);

    const setDueDate = useCallback((id, dueDate) => {
        dispatch({
            type: 'SET_DUE_DATE',
            payload: {
                id,
                dueDate,
            },
        });
    }, []);

    const setReminder = useCallback((id, reminderAt) => {
        dispatch({
            type: 'SET_REMINDER',
            payload: {
                id,
                reminderAt,
            },
        });
    }, []);
    const setPriority = useCallback((id, priority) => {
        dispatch({
            type: 'SET_PRIORITY',
            payload: {
                id,
                priority,
            },
        });
    }, []);
    const setTags = useCallback((id, tags) => {
        dispatch({
            type: 'SET_TAGS',
            payload: {
                id,
                tags,
            },
        });
    }, []);
    const setRecurrence = useCallback((id, recurrence) => {
        dispatch({
            type: 'SET_RECURRENCE',
            payload: {
                id,
                recurrence,
            },
        });
    }, []);
    const setDependencies = useCallback((taskId, dependencies) => {
    dispatch({
        type: 'SET_DEPENDENCIES',
        payload: {
            taskId,
            dependencies,
        },
    });
}, []);
    const setEditScope = useCallback((id, scope) => {
        dispatch({
            type: 'SET_EDIT_SCOPE',
            payload: {
                id,
                scope,
            },
        });
    }, []);
    const searchTasks = useCallback(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
        return state.tasks;
    }
return state.tasks.filter((task) => {
    if (!includeCompleted && task.completed) {
        return false;
    }
if (!includeArchived && task.archived) {
    return false;
}

    return fuzzyMatch(task.title, query);
});

}, [searchQuery, state.tasks, includeCompleted, includeArchived]);


    const addTag = useCallback((tag) => {
        dispatch({
            type: 'ADD_TAG',
            payload: tag,
        });
    }, []);
    // Sort preference ko browser mein save karega
    useEffect(() => {
        localStorage.setItem('taskSortBy', state.sortBy);
    }, [state.sortBy]);
    // Tasks ko browser mein save karega
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
    }, [state.tasks]);

    useEffect(() => {
        localStorage.setItem('taskTags', JSON.stringify(state.tags));
    }, [state.tags]);

    return (
        <TaskContext.Provider
            value={{
                ...state,
                addTask,
                toggleTask,
                addSubtask,
                setSortBy,
                setDueDate,
                setReminder,
                setPriority,
                setTags,
                addTag,
                setRecurrence,
                setEditScope,
                searchQuery,
                setSearchQuery,
                searchTasks,
                includeCompleted,
                setIncludeCompleted,
                includeArchived,
                setIncludeArchived,
                setDependencies,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
}

export function useTaskContext() {
    const ctx = useContext(TaskContext);

    if (!ctx) {
        throw new Error(
            'useTaskContext must be used within a TaskProvider'
        );
    }

    return ctx;
}