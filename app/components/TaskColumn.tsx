'use client'

import { Droppable } from '@hello-pangea/dnd'
import { TaskCard } from './TaskCard'

interface Task {
  id: string
  title: string
  description?: string | null
  content?: string | null
  learnings?: string | null
  status: string
  type: string
}

interface TaskColumnProps {
  id: string
  title: string
  tasks: Task[]
  type: string
  onStatusChange: (id: string, status: string) => void
  onDelete: (id: string) => void
  onUpdateLearnings: (id: string, learnings: string) => void
}

export function TaskColumn({
  id,
  title,
  tasks,
  type,
  onStatusChange,
  onDelete,
  onUpdateLearnings,
}: TaskColumnProps) {
  const columnTasks = tasks.filter((task) => task.type === type)
  const completedTasks = columnTasks.filter((task) => task.status === 'COMPLETED').length
  const progress = columnTasks.length > 0 ? (completedTasks / columnTasks.length) * 100 : 0

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100/20 dark:border-blue-900/20 flex flex-col h-full transition-transform hover:scale-[1.02] duration-300">
      <div className="p-6 border-b border-blue-100 dark:border-blue-900/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            {title}
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {completedTasks}/{columnTasks.length}
            </span>
            <div className="w-20 h-2 bg-blue-100 dark:bg-blue-900/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {['TODO', 'COMPLETED'].map((status) => (
            <span
              key={status}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                status === 'COMPLETED'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {columnTasks.filter((task) => task.status === status).length} {status.toLowerCase()}
            </span>
          ))}
        </div>
      </div>
      <Droppable droppableId={id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-300px)] space-y-4 scrollbar-thin scrollbar-thumb-blue-300 dark:scrollbar-thumb-blue-700 scrollbar-track-transparent"
          >
            {columnTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-blue-500 dark:text-blue-400">
                <p className="text-sm">No tasks yet</p>
                <p className="text-xs">Drag tasks here or create a new one</p>
              </div>
            ) : (
              columnTasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  onStatusChange={onStatusChange}
                  onDelete={onDelete}
                  onUpdateLearnings={onUpdateLearnings}
                />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
} 