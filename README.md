# To-Do Web App (React + Tailwind CSS)

A modern, accessible to-do web application built with React (Hooks) and Tailwind CSS, following the project's Software Requirements Document (SRD).

The application supports quick task creation, task completion, sorting, task grouping, due dates, reminders, browser notifications, and persistent task storage.

## Tech Stack

- **Framework:** React 18+ (functional components, Hooks)
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **State Management:** React Context + useReducer
- **Persistence:** Browser localStorage
- **Notifications:** Browser Notification API

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

The app will be available at:

http://localhost:5173

(or the port Vite prints in your terminal).

Project Structure

src/
├── context/
│   └── TaskContext.jsx
│
├── components/
│   ├── TaskInput.jsx
│   ├── TaskItem.jsx
│   ├── TaskList.jsx
│   ├── Toast.jsx
│   ├── SortDropdown.jsx
│   ├── SectionHeader.jsx
│   ├── EmptyState.jsx
│   ├── DatePicker.jsx
│   ├── QuickDateChips.jsx
│   ├── ReminderPicker.jsx
│   ├── PermissionPrompt.jsx
│   ├── ReminderBanner.jsx
│   └── ReminderManager.jsx
│
├── utils/
│   ├── validation.jsx
│   ├── notifications.js
│   ├── sortTasks.js
│   └── groupTasks.js
│
├── App.jsx
├── App.css
├── index.css
└── main.jsx

Requirement Status
ID	Requirement	Status
FR-01	Quick Task Creation	✅ Completed
FR-02	Mark Task as Complete	✅ Completed
FR-03	Task List View, Sorting & Filtering	✅ Completed
FR-04	Due Dates & Reminders	✅ Completed
FR-05	Categories, Tags & Priority Levels	⬜ Pending
FR-06	Recurring Tasks	⬜ Pending
FR-07	Search & Command Palette	⬜ Pending
FR-08	Subtasks & Task Dependencies	⬜ Pending
FR-09	Real-Time Collaboration & Task Sharing	⬜ Pending
FR-10	Offline Support & Multi-Device Sync	⬜ Pending

FR-01 — Quick Task Creation ✅

User Story:
As a user, I want to add a new task in one step from anywhere on the page, so that I can capture ideas instantly without interrupting my workflow.

Acceptance Criteria
 Task can be created via a persistent input field without a page reload or modal
 Task appears in the list instantly
 Task can be submitted via Enter key or button click
 Empty submissions are blocked with inline, non-blocking feedback
 Input field auto-refocuses after submission

 FR-02 — Mark Task as Complete ✅

User Story:
As a user, I want to mark a task as done with a single click, so that I get immediate confirmation and a sense of progress.

Acceptance Criteria
 Clicking the checkbox toggles completion state instantly
 Completed tasks show strikethrough + reduced opacity + icon change
 Completed tasks move to the Completed section
 An Undo toast is available after completion
 Action is fully operable via keyboard (Tab + Space)

 UI Components
Custom checkbox
Toast/snackbar
Completed-section divider
FR-03 — Task List View, Sorting & Filtering ✅

User Story:
As a user, I want to view and organize my tasks efficiently, so that I can quickly understand what needs my attention.

Implemented Features
 Tasks displayed in a structured list
 Active and completed tasks separated
 Tasks grouped by due date
 Overdue section
 Today section
 Upcoming section
 No Due Date section
 Completed section
 Sort by Due Date
 Sort by Priority
 Sort alphabetically
 Sort preference persisted in localStorage
 Empty state when no tasks exist
 Responsive layout
 Existing completion and undo functionality preserved
Sorting Options

The task list supports:

Due Date
Priority
Alphabetical

FR-04 — Due Dates & Reminders ✅

User Story:
As a user, I want to set a due date and reminder on a task, so that I don't forget important deadlines.

Acceptance Criteria
 User can assign a due date
 User can edit an existing due date
 User can clear a due date
 Due date is selected through a calendar popover
 Calendar supports previous and next month navigation
 Current day is visually indicated
 Selected due date is visually indicated
 Quick-select chip for Today
 Quick-select chip for Tomorrow
 Quick-select chip for Next Week
 User can set a reminder date
 User can set a reminder time
 User can edit an existing reminder
 User can clear a reminder
 Browser Notification API is used for reminders
 Notification permission is requested contextually
  Notification permission is not requested on page load
 In-app fallback banner is shown when notifications are denied
 Duplicate reminder notifications are prevented
 Reminder is checked every 15 seconds
 Notification fires within 60 seconds of the scheduled reminder time while the application is running
 Tasks and reminder data are persisted in localStorage
UI Components
Custom date picker popover
Calendar grid
Quick date chips
Reminder picker
Notification permission prompt
Reminder fallback banner
Reminder manager
Notification Flow

User sets reminder
        ↓
Check Notification permission
        ↓
Permission granted?
     /        \
   Yes         No
    ↓           ↓
Save reminder  Show permission prompt
    ↓           ↓
ReminderManager checks every 15 sec
        ↓
Scheduled time reached
        ↓
Browser Notification

Browser Notification Limitation

The current implementation uses the browser Notification API and a React-based reminder manager.

Notifications are guaranteed only while the application is running and the browser allows notifications. If the application/browser is completely closed, a persistent background notification would require a service worker, push notifications, and/or a backend scheduling service.
Data Persistence

Task data is persisted using browser localStorage.

The following task information is stored:
id
title
createdAt
completed
dueDate
reminderAt
priority

This allows tasks and their due dates/reminders to remain available after refreshing the page.

Accessibility

The application includes accessibility-focused interactions such as:

Keyboard-accessible task completion
Tab navigation
Space key interaction for completion
ARIA checkbox state
Accessible button labels
Focus rings
Semantic list and section structure
Visual state changes that are not dependent on color alone

Current Development Status
Completed
FR-01 — Quick Task Creation
FR-02 — Mark Task as Complete
FR-03 — Task List View, Sorting & Filtering
FR-04 — Due Dates & Reminders
Upcoming
FR-05 — Categories, Tags & Priority Levels
FR-06 — Recurring Tasks
FR-07 — Search & Command Palette
FR-08 — Subtasks & Task Dependencies
FR-09 — Real-Time Collaboration & Task Sharing
FR-10 — Offline Support & Multi-Device Sync

License

Proprietary — CyberFox