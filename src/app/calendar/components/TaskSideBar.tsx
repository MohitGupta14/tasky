'use client';
import React, { useState, useEffect } from 'react';
import { ProgressStatus } from '@prisma/client';

interface Task {
  id: number;
  name: string;
  status: ProgressStatus;
  eventDate: string;
}

export default function TaskSidebar() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<ProgressStatus | 'ALL'>('ALL');
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);

  // Fetch tasks from localStorage or API if localStorage is empty
  useEffect(() => {
    const localTasks = JSON.parse(localStorage.getItem('tasks') || '[]');

    if (localTasks.length > 0) {
      setTasks(localTasks);  // If tasks exist in localStorage, use them
    } else {
      // If localStorage is empty, call the API to fetch tasks
      const fetchTasks = async () => {
        try {
          const response = await fetch('/api/tasks'); // Replace with your API endpoint
          if (response.ok) {
            const fetchedTasks = await response.json();
            setTasks(fetchedTasks);
            localStorage.setItem('tasks', JSON.stringify(fetchedTasks)); // Store tasks in localStorage
          } else {
            console.error('Failed to fetch tasks from API');
          }
        } catch (error) {
          console.error('Failed to fetch tasks', error);
        }
      };
      fetchTasks();
    }
  }, []);

  const filteredTasks = filter === 'ALL' 
    ? tasks 
    : tasks.filter(task => task.status === filter);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  const handleDeleteTask = async (taskId: number) => {
    setDeletingTaskId(taskId);
  
    try {
      // Remove from localStorage first
      const localTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const updatedLocalTasks = localTasks.filter((task: Task) => task.id !== taskId);
      localStorage.setItem('tasks', JSON.stringify(updatedLocalTasks));
      
      // Update the state immediately
      setTasks(updatedLocalTasks);
      console.log('Task deleted from localStorage:', taskId);
      // Send a DELETE request to the server
      const response = await fetch('/api/tasks', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId }), // Send taskId as JSON body
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to delete task from server:', errorData.error);
        // If the server fails, restore tasks from localStorage
        setTasks(localTasks);
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
      // Restore tasks from localStorage if there's an error
      const localTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      setTasks(localTasks);
    } finally {
      setDeletingTaskId(null);
      window.location.reload(); // Reload the page to reflect changes
    }
  };
  

  const getStatusColor = (status: ProgressStatus) => {
    switch(status) {
      case ProgressStatus.PENDING:
        return 'bg-yellow-100 border-yellow-300';
      case ProgressStatus.IN_PROGRESS:
        return 'bg-blue-100 border-blue-300';
      case ProgressStatus.COMPLETED:
        return 'bg-green-100 border-green-300';
      default:
        return 'bg-red-100 border-red-300';
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
      <h2 className="text-xl text-gray-700 font-bold mb-4">Tasks</h2>
      
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Filter Tasks</label>
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value as ProgressStatus | 'ALL')}
          className="w-full px-3 py-2 border rounded text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <option value="ALL">All Tasks</option>
          {Object.values(ProgressStatus).map(status => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Task list with scrollbar */}
      <div className="space-y-3 overflow-y-auto max-h-96"> {/* Scrollable task container */}
        {filteredTasks.map(task => (
          <div 
            key={task.id} 
            className={`
              relative p-4 rounded-md shadow-sm border 
              ${getStatusColor(task.status)}
              transition-all duration-200
            `}
          >
            <button
              onClick={() => handleDeleteTask(task.id)}
              disabled={deletingTaskId === task.id}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
              aria-label={`Delete task ${task.name}`}
            >
              {deletingTaskId === task.id ? (
                <svg className="animate-spin h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              )}
            </button>

            <div className="flex flex-col pr-6">
              <span className="font-medium text-gray-800 mb-1">{task.name}</span>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {task.eventDate ? formatDate(task.eventDate) : 'No date set'}
                </span>
                <span className={`
                  text-xs px-2 py-1 rounded-full font-medium
                  ${task.status === ProgressStatus.PENDING ? 'bg-yellow-200 text-yellow-800' : 
                    task.status === ProgressStatus.IN_PROGRESS ? 'bg-blue-200 text-blue-800' : 
                    task.status === ProgressStatus.COMPLETED ? 'bg-green-200 text-green-800' : 
                    'bg-red-200 text-red-800'}
                `}>
                  {task.status}
                </span>
              </div>
            </div>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="text-center text-gray-500 py-8 bg-gray-100 rounded-md border border-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p>No tasks found</p>
          </div>
        )}
      </div>
    </div>
  );
}
