# Task Manager

A modern task management application built with Next.js that helps you organize your tasks hierarchically from monthly goals down to daily tasks.

## Features

- Hierarchical task organization (Monthly → Weekly → Daily)
- Drag and drop functionality for task reorganization
- Progress tracking with visual indicators
- Dark/Light theme support
- Task completion tracking
- Learning reflections for completed tasks
- Responsive design
- Local database storage

## Tech Stack

- Next.js 13+
- React
- TypeScript
- Tailwind CSS
- Prisma (SQLite)
- next-themes
- @hello-pangea/dnd

## Getting Started

1. Clone the repository:
```bash
git clone [your-repo-url]
cd task-manager
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

- Create tasks using the "Create New Task" button
- Drag and drop tasks between columns to change their time frame
- Click the checkbox to mark tasks as complete
- Expand tasks to add learning reflections
- Use the progress overview (top-left icon) to track completion status
- Toggle between dark and light themes using the theme toggle (top-right)
