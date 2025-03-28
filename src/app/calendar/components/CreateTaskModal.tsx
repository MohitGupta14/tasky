// app/calendar/components/CreateTaskModal.tsx
'use client';
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ProgressStatus } from '@prisma/client';

interface CreateTaskModalProps {
  date: Date | null;
  onClose: () => void;
}

export default function CreateTaskModal({ date, onClose }: CreateTaskModalProps) {
  const [taskName, setTaskName] = useState('');
  const [status, setStatus] = useState<ProgressStatus>(ProgressStatus.PENDING);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: taskName,
          userId: 1, // Replace with actual user ID from session
          status,
        }),
      });

      if (response.ok) {
        onClose();
      } else {
        // Handle error
        console.error('Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-xl font-bold mb-4">
          Create Task for {date ? format(date, 'PP') : 'Selected Date'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Task Name</label>
            <input 
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Status</label>
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value as ProgressStatus)}
              className="w-full px-3 py-2 border rounded"
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
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
