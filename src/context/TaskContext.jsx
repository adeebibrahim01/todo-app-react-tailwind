import { createContext, useContext, useReducer, useCallback } from 'react';

const TaskContext = createContext(null);

const initialState = {
    tasks: [],
};

function taskReducer(state, action) {
    switch (action.type) {
        case 'ADD_TASK':
            return { ...state, tasks: [action.payload, ...state.tasks] };
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
        };
        // optimistic update — task turant list mein add hota hai, koi network wait nahi
        dispatch({ type: 'ADD_TASK', payload: newTask });
    }, []);

    return (
        <TaskContext.Provider value={{ ...state, addTask }}>
            {children}
        </TaskContext.Provider>
    );
}

export function useTaskContext() {
    const ctx = useContext(TaskContext);
    if (!ctx) throw new Error('useTaskContext must be used within a TaskProvider');
    return ctx;
}