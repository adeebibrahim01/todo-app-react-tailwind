import {
    createContext,
    useContext,
    useReducer,
    useCallback,
    useEffect,
} from 'react';

const TaskContext = createContext(null);

const initialState = {
    tasks: JSON.parse(localStorage.getItem('tasks') || '[]'),

    // FR-05
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

        case 'TOGGLE_TASK':
            return {
                ...state,
                tasks: state.tasks.map((t) =>
                    t.id === action.payload
                        ? { ...t, completed: !t.completed }
                        : t
                ),
            };

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
        default:
            return state;
    }
}

export function TaskProvider({ children }) {
    const [state, dispatch] = useReducer(taskReducer, initialState);

    const addTask = useCallback((title) => {
     const newTask = {
    id: crypto.randomUUID(),
    title,
    createdAt: new Date().toISOString(),
    completed: false,

    // FR-04
    dueDate: null,
    reminderAt: null,

    // FR-05
    priority: null,
    tags: [],
};

        dispatch({
            type: 'ADD_TASK',
            payload: newTask,
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
    setSortBy,
    setDueDate,
    setReminder,
    setPriority,
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