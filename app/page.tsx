'use client'

import { DragDropContext } from '@hello-pangea/dnd'
import { useEffect, useState } from 'react'
import { TaskColumn } from './components/TaskColumn'
import { ThemeToggle } from './components/ThemeToggle'
import { ProgressOverview } from './components/ProgressOverview'

interface Task {
  id: string
  title: string
  description?: string | null
  content?: string | null
  learnings?: string | null
  status: string
  type: string
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    type: 'MONTHLY',
  })
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    const response = await fetch('/api/tasks')
    const data = await response.json()
    setTasks(data)
  }

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result
    
    // If dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return
    }

    const updatedTasks = Array.from(tasks)
    const taskIndex = updatedTasks.findIndex((t) => t.id === draggableId)
    const task = updatedTasks[taskIndex]

    if (task) {
      // Remove the task from its position
      updatedTasks.splice(taskIndex, 1)
      
      // Find the index where to insert based on destination
      const destinationTasks = updatedTasks.filter(t => t.type === destination.droppableId)
      const insertIndex = updatedTasks.findIndex(t => t.type === destination.droppableId) + destination.index
      
      const updatedTask = { ...task, type: destination.droppableId }
      updatedTasks.splice(insertIndex, 0, updatedTask)

      setTasks(updatedTasks)

      await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      })
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, status } : task
    )
    setTasks(updatedTasks)

    const task = tasks.find((t) => t.id === id)
    if (task) {
      await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, status }),
      })
    }
  }

  const handleDelete = async (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id)
    setTasks(updatedTasks)

    await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
    })
  }

  const handleUpdateLearnings = async (id: string, learnings: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, learnings } : task
    )
    setTasks(updatedTasks)

    const task = tasks.find((t) => t.id === id)
    if (task) {
      await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, learnings }),
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newTask, status: 'TODO' }),
    })
    const task = await response.json()
    setTasks([...tasks, task])
    setNewTask({ title: '', description: '', type: 'MONTHLY' })
    setIsFormOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-[#001a33] dark:to-gray-900 p-8">
      <ThemeToggle />
      <ProgressOverview tasks={tasks} />
      
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#1e70bf] to-[#3498db] bg-clip-text text-transparent mb-4">
            Task Manager
          </h1>
          <p className="text-[#2980b9] dark:text-[#5dade2] mb-8 text-center max-w-2xl">
            Organize your tasks efficiently. Start with monthly goals, break them down into weekly objectives, and track your daily progress.
          </p>
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="px-6 py-3 bg-gradient-to-r from-[#2980b9] to-[#3498db] text-white rounded-full hover:from-[#2471a3] hover:to-[#2980b9] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2 transform hover:scale-105"
          >
            <span>{isFormOpen ? '✕ Close Form' : '+ Create New Task'}</span>
          </button>
        </div>

        {isFormOpen && (
          <div className="mb-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl max-w-xl mx-auto border border-[#3498db]/20 dark:border-[#3498db]/20">
            <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-[#1e70bf] to-[#3498db] bg-clip-text text-transparent">Create New Task</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Enter task title"
                  className="w-full p-2.5 border rounded-lg dark:bg-gray-700/50 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Describe your task in detail"
                  className="w-full p-2.5 border rounded-lg dark:bg-gray-700/50 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Time Frame
                </label>
                <select
                  value={newTask.type}
                  onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
                  className="w-full p-2.5 border rounded-lg dark:bg-gray-700/50 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                >
                  <option value="MONTHLY">Monthly Goal</option>
                  <option value="WEEKLY">Weekly Objective</option>
                  <option value="DAILY">Daily Task</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#2980b9] to-[#3498db] text-white rounded-lg hover:from-[#2471a3] hover:to-[#2980b9] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 text-sm"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        )}

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TaskColumn
              id="MONTHLY"
              title="Monthly Goals"
              tasks={tasks}
              type="MONTHLY"
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              onUpdateLearnings={handleUpdateLearnings}
            />
            <TaskColumn
              id="WEEKLY"
              title="Weekly Objectives"
              tasks={tasks}
              type="WEEKLY"
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              onUpdateLearnings={handleUpdateLearnings}
            />
            <TaskColumn
              id="DAILY"
              title="Daily Tasks"
              tasks={tasks}
              type="DAILY"
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              onUpdateLearnings={handleUpdateLearnings}
            />
          </div>
        </DragDropContext>
      </div>
    </div>
  )
}
