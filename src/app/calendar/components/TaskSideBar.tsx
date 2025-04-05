'use client';
import React, { useState, useEffect } from 'react';
import { ProgressStatus } from '@prisma/client';

interface Task {
  id: number;
  name: string;
  status: ProgressStatus;
  eventDate: string; // Add eventDate to the interface
}

export default function TaskSidebar() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<ProgressStatus | 'ALL'>('ALL');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks');
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        }
      } catch (error) {
        console.error('Failed to fetch tasks', error);
      }
    };

    fetchTasks();
  }, []);

  const filteredTasks = filter === 'ALL' 
    ? tasks 
    : tasks.filter(task => task.status === filter);
    
  // Helper function to format dates nicely
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  // Delete task function
  const handleDeleteTask = async (taskId: number) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the deleted task from the local state
        setTasks(tasks.filter(task => task.id !== taskId));
      } else {
        console.error('Failed to delete task');
      }
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  return (
    <div>
      <h2 className="text-xl text-gray-500 font-bold mb-4">Tasks</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Filter Tasks</label>
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value as ProgressStatus | 'ALL')}
          className="w-full px-3 py-2 border rounded text-blue-400"
        >
          <option value="ALL">All Tasks</option>
          {Object.values(ProgressStatus).map(status => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        {filteredTasks.map(task => (
          <div 
            key={task.id} 
            className={`
              relative p-3 rounded shadow-sm
              ${task.status === ProgressStatus.PENDING ? 'bg-yellow-100' : 
                task.status === ProgressStatus.IN_PROGRESS ? 'bg-blue-100' : 
                task.status === ProgressStatus.COMPLETED ? 'bg-green-100' : 
                'bg-red-100'}
            `}
          >
            {/* Delete Button */}
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="absolute bottom-2 right-2 text-gray-500 hover:text-red-500"
              aria-label={`Delete task ${task.name}`}
            >
              🗑️
            </button>

            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-gray-600">{task.name}</span>
              <span className="text-sm text-gray-600">{task.status}</span>
            </div>
            <div className="text-xs text-gray-500">
              Due: {task.eventDate ? formatDate(task.eventDate) : 'No date set'}
            </div>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No tasks found
          </div>
        )}
      </div>
    </div>
  );
}
