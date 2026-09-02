# To-Do Web App (React + Tailwind CSS)

A modern, accessible to-do web application built with React (Hooks) and Tailwind CSS, following the project's Software Requirements Document (SRD).

## Tech Stack

* **Framework:** React 18+ (functional components, Hooks)
* **Styling:** Tailwind CSS
* **Build Tool:** Vite
* **State Management:** React Context

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173` (or the port Vite prints in your terminal).

## Project Structure

```
src/
├── context/
│   └── TaskContext.jsx      # App state (tasks) via Context + useReducer
├── components/
│   ├── TaskInput.jsx        # Persistent inline task input
│   └── TaskList.jsx         # Renders the task list
├── utils/
│   └── validation.js        # Input validation helpers
├── App.jsx
└── main.jsx
```

## Requirement Status

| ID    | Requirement                            | Status      |
| ----- | -------------------------------------- | ----------- |
| FR-01 | Quick Task Creation                    | ✅ Completed |
| FR-02 | Mark Task as Complete                  | ✅ Completed |
| FR-03 | Task List View, Sorting & Filtering    | ⬜ Pending   |
| FR-04 | Due Dates & Reminders                  | ⬜ Pending   |
| FR-05 | Categories, Tags & Priority Levels     | ⬜ Pending   |
| FR-06 | Recurring Tasks                        | ⬜ Pending   |
| FR-07 | Search & Command Palette               | ⬜ Pending   |
| FR-08 | Subtasks & Task Dependencies           | ⬜ Pending   |
| FR-09 | Real-Time Collaboration & Task Sharing | ⬜ Pending   |
| FR-10 | Offline Support & Multi-Device Sync    | ⬜ Pending   |

### FR-01 — Quick Task Creation ✅

**User Story:** As a user, I want to add a new task in one step from anywhere on the page, so that I can capture ideas instantly without interrupting my workflow.

**Acceptance Criteria:**

* [x] Task can be created via a persistent input field without a page reload or modal
* [x] Task appears in the list instantly (optimistic UI update)
* [x] Task can be submitted via Enter key or button click
* [x] Empty submissions are blocked with inline, non-blocking feedback
* [x] Input field auto-refocuses after submission for rapid entry

### FR-02 — Mark Task as Complete ✅

**User Story:** As a user, I want to mark a task as done with a single click, so that I get immediate confirmation and a sense of progress.

**Acceptance Criteria:**

* [x] Clicking the checkbox toggles completion state instantly (optimistic update)
* [x] Completed tasks show strikethrough + reduced opacity + icon change (not color alone)
* [x] Completed tasks move to a Completed section or bottom of the list
* [x] An Undo toast is available for 5 seconds after completion
* [x] Action is fully operable via keyboard (Tab + Space)

**UI Components:**

* Custom checkbox (native input under the hood)
* Toast/snackbar
* Completed-section divider

## License

Proprietary — CyberFox
