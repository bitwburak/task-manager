'use client'

import { useState } from 'react'

interface Task {
  id: string
  title: string
  description?: string | null
  content?: string | null
  learnings?: string | null
  status: string
  type: string
}

export function ProgressOverview({ tasks }: { tasks: Task[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === 'COMPLETED').length
  const overallProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const typeProgress = {
    MONTHLY: {
      total: tasks.filter((t) => t.type === 'MONTHLY').length,
      completed: tasks.filter((t) => t.type === 'MONTHLY' && t.status === 'COMPLETED').length,
    },
    WEEKLY: {
      total: tasks.filter((t) => t.type === 'WEEKLY').length,
      completed: tasks.filter((t) => t.type === 'WEEKLY' && t.status === 'COMPLETED').length,
    },
    DAILY: {
      total: tasks.filter((t) => t.type === 'DAILY').length,
      completed: tasks.filter((t) => t.type === 'DAILY' && t.status === 'COMPLETED').length,
    },
  }

  return (
    <div className="fixed top-4 left-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          onMouseLeave={() => setIsOpen(false)}
          className="absolute top-14 left-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-blue-100/20 dark:border-blue-900/20 w-80 transform origin-top-left transition-all duration-300"
        >
          <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4">Progress Overview</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Overall Progress</span>
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  {completedTasks}/{totalTasks} ({Math.round(overallProgress)}%)
                </span>
              </div>
              <div className="h-2 bg-blue-100 dark:bg-blue-900/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>

            {Object.entries(typeProgress).map(([type, { total, completed }]) => {
              const progress = total > 0 ? (completed / total) * 100 : 0
              return (
                <div key={type}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </span>
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      {completed}/{total} ({Math.round(progress)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-blue-100 dark:bg-blue-900/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
} 