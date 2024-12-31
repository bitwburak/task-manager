'use client'

import { Draggable } from '@hello-pangea/dnd'
import { useState } from 'react'

interface TaskCardProps {
  task: {
    id: string
    title: string
    description?: string | null
    content?: string | null
    learnings?: string | null
    status: string
  }
  index: number
  onStatusChange: (id: string, status: string) => void
  onDelete: (id: string) => void
  onUpdateLearnings: (id: string, learnings: string) => void
}

export function TaskCard({ task, index, onStatusChange, onDelete, onUpdateLearnings }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [learnings, setLearnings] = useState(task.learnings || '')
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSaveLearnings = () => {
    onUpdateLearnings(task.id, learnings)
    setIsEditing(false)
  }

  const handleDelete = () => {
    onDelete(task.id)
    setShowDeleteConfirm(false)
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-blue-100 dark:border-blue-900 hover:shadow-xl transition-all duration-300 relative"
          style={{
            ...provided.draggableProps.style,
            zIndex: snapshot.isDragging ? 1000 : 'auto',
            transform: snapshot.isDragging ? provided.draggableProps.style?.transform : 'translate(0, 0)',
          }}
        >
          {showDeleteConfirm && (
            <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-xl p-6 flex flex-col items-center justify-center space-y-4 border border-blue-100 dark:border-blue-900 z-50">
              <p className="text-gray-700 dark:text-gray-300 text-center">
                Are you sure you want to delete this task?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          )}

          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors"
            >
              <span className="text-red-500 dark:text-red-400">✕</span>
            </button>
          </div>

          <div className="flex items-start space-x-4 mb-4">
            <div
              className={`mt-1 w-5 h-5 rounded-full border-2 cursor-pointer transition-colors duration-300 flex items-center justify-center ${
                task.status === 'COMPLETED'
                  ? 'bg-blue-500 border-blue-500'
                  : 'border-blue-300 dark:border-blue-600'
              }`}
              onClick={() =>
                onStatusChange(task.id, task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED')
              }
            >
              {task.status === 'COMPLETED' && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
              )}
            </div>
            <div className="flex-1">
              <h3
                className={`text-xl font-semibold dark:text-white mb-2 ${
                  task.status === 'COMPLETED' ? 'line-through text-gray-500 dark:text-gray-400' : ''
                }`}
              >
                {task.title}
              </h3>
              {task.description && (
                <p
                  className={`text-gray-600 dark:text-gray-300 ${
                    task.status === 'COMPLETED' ? 'line-through text-gray-400 dark:text-gray-500' : ''
                  }`}
                >
                  {task.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors flex items-center space-x-1"
            >
              <span>{isExpanded ? 'Hide Details' : 'Show Details'}</span>
              <svg
                className={`w-4 h-4 transform transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                task.status === 'COMPLETED'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {task.status.toLowerCase()}
            </span>
          </div>

          {isExpanded && (
            <div className="mt-6 space-y-4">
              {task.content && (
                <div className="p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                  <h4 className="font-semibold mb-2 dark:text-white">Content</h4>
                  <p className="text-gray-600 dark:text-gray-300">{task.content}</p>
                </div>
              )}
              
              <div className="p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold dark:text-white">Learnings & Reflections</h4>
                  {!isEditing && task.status === 'COMPLETED' && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center space-x-1"
                    >
                      <span>Edit</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                  )}
                </div>
                {isEditing ? (
                  <div className="space-y-3">
                    <textarea
                      value={learnings}
                      onChange={(e) => setLearnings(e.target.value)}
                      className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      rows={4}
                      placeholder="What did you learn from this task?"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveLearnings}
                        className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {task.status === 'COMPLETED' ? (
                      learnings ? (
                        <p className="text-gray-600 dark:text-gray-300">{learnings}</p>
                      ) : (
                        <p className="text-gray-400 dark:text-gray-500 italic">
                          Click edit to add your learnings from this task.
                        </p>
                      )
                    ) : (
                      <p className="text-gray-400 dark:text-gray-500 italic">
                        Complete this task to add your learnings and reflections.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  )
} 