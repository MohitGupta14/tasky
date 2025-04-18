'use client';
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ProgressStatus } from '@prisma/client';
import { useSession } from 'next-auth/react';
import '../../styles/globals.css';
import axios from 'axios';

interface Task {
  id: string;
  name: string;
  status: ProgressStatus;
  eventDate: Date | null;
  userId: string;
}

interface CreateTaskModalProps {
  date: Date | null;
  onClose: () => void;
  onTaskCreated?: (newTask: Task) => void;
}

export default function CreateTaskModal({ date, onClose, onTaskCreated }: CreateTaskModalProps) {
  const [taskName, setTaskName] = useState('');
  const [status, setStatus] = useState<ProgressStatus>(ProgressStatus.PENDING);
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Getting the session data
  const { data: session } = useSession();

  useEffect(() => {
    if (date) {
      setEventDate(date);
    }

  }, [date]);

  // Handle task creation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure session data is available
    if (!session || !session.user?.id) {
      console.error('User is not authenticated');
      return;
    }
  
    setIsLoading(true);
  
    try {
      // Make the API call to create the task
      const response = await axios.post('/api/tasks', {
        name: taskName,
        status,
        eventDate,
      });
  
      console.log('Response:', response);
  
      // Assuming the API responds with the created task
      const newTask: Task = {
        id: response.data.id, // The API should return the new task's ID
        name: taskName,
        status,
        eventDate,
        userId: session.user.id, // Add user ID from the session
      };
  
      // Store in localStorage
      const existingTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      localStorage.setItem('tasks', JSON.stringify([...existingTasks, newTask]));
  
      // Check if the response is successful (201 for creation)
      if (response.status === 201) {
        // If onTaskCreated callback is passed, call it with the new task
        if (onTaskCreated) {
          onTaskCreated(newTask);
        }
  
        // Close the modal or reset any form fields
        onClose();
  
        // Optionally refresh the page (uncomment if needed)
        // window.location.reload();
        console.log(localStorage.getItem('tasks'));
      } else {
        console.error('Failed to create task', response.status, response.data);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsLoading(false);
      window.location.reload();
    }
  };
  

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-96 border border-gray-600">
        <h2 className="text-xl text-gray-100 font-bold mb-4">
          Create Task for {date ? format(date, 'PP') : 'Selected Date'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-100 mb-2">Task Name</label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full px-3 py-2 border rounded bg-gray-800 text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-100 mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProgressStatus)}
              className="w-full px-3 py-2 border rounded bg-gray-800 text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              {Object.values(ProgressStatus).map(progressStatus => (
                <option key={progressStatus} value={progressStatus}>
                  {progressStatus}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-gray-200 rounded hover:bg-gray-500 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center min-w-24 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating...</span>
                </div>
              ) : (
                'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}