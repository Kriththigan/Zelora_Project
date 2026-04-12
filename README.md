# Recruitment Kanban — React UI

A recruitment pipeline management UI built with React and plain CSS (inline styles), closely matching the tiimi design mockup.

---

## Setup Instructions

### Prerequisites
- Node.js v18 or higher
- npm v9 or higher

### Install & Run

```bash
# 1. Clone or unzip the project
cd recruitment-kanban

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will open at **http://localhost:5173**

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
└── App.jsx          # All components and logic (single-file architecture)
    ├── TopBar        — Dark navigation bar with Jobs/Candidate/Career Site tabs
    ├── LeftSidebar   — Dark vertical nav icons
    ├── RightSidebar  — White utility icons panel
    ├── PageHeader    — Job title, meta info, tab navigation
    ├── Toolbar       — Search, filters, Kanban view toggle
    ├── Column        — Kanban column with drag-and-drop zone
    ├── CandidateCard — Individual candidate card with score/referred tag
    ├── Avatar        — Colored initials avatar
    ├── StarRating    — Star + score display
    ├── InfoRow       — Label/value row used in modal
    └── Modal         — Candidate detail view with stage-move buttons
```

---

## Features Implemented

| Requirement | Status |
|---|---|
| React for the UI | ✅ React 19 + Vite |
| Plain CSS (no Tailwind) | ✅ All styles are inline CSS via `style={{}}` |
| Responsive layout | ✅ Sidebars hide on mobile, board scrolls |
| Dummy data (hardcoded JSON) | ✅ 14 candidates across 4 stages |
| Modular reusable components | ✅ 9 named components |
| Kanban-style column layout | ✅ 4 stages: Applying Period, Screening, Interview, Test |
| Viewing candidate details | ✅ Click any card → modal with full details |
| Moving candidates between stages | ✅ Drag-and-drop (HTML5 native) + modal stage buttons |

---

## Design Decisions & Assumptions

- **Single-file architecture**: All components live in `App.jsx` for simplicity. In a larger codebase, each component would be split into its own file under `src/components/`.
- **Inline styles instead of CSS Modules**: Chosen to avoid needing a build-step config change. Inline styles provide full scoping with zero setup.
- **No backend**: All data is hardcoded in `INITIAL_CANDIDATES`. In production this would be fetched from an API.
- **Avatar initials instead of photos**: The design references user photos, but since no photo assets were provided, colored initials circles are used — each candidate gets a consistent color derived from their ID.
- **Drag-and-drop**: Implemented using the HTML5 native Drag and Drop API (`draggable`, `onDragStart`, `onDrop`) — no third-party library required.
- **Column counts**: The column header badge shows the current filtered count (live), not the static total shown in the original design (27, 23, etc.), which reflects real-time state.
- **No backend/frontend split**: This is a purely frontend project. There is no separate backend to run.

---

## No Backend

This project is frontend-only. There is no server, API, or database. Everything runs in the browser.

```
# Only one command needed:
npm run dev
```