'use client';
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ProgressStatus } from '@prisma/client';
import { useSession } from 'next-auth/react';  // Importing useSession from next-auth
import '../../styles/globals.css';

interface CreateTaskModalProps {
  date: Date | null;
  onClose: () => void;
}

export default function CreateTaskModal({ date, onClose }: CreateTaskModalProps) {
  const [taskName, setTaskName] = useState('');
  const [status, setStatus] = useState<ProgressStatus>(ProgressStatus.PENDING);
  const [eventDate, setEventDate] = useState<Date | null>(null);
  
  // Getting the session data
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (date) {
      setEventDate(date); // Set the formatted date without the time
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

    console.log('Creating task:', { taskName, status, eventDate });

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: taskName,
          status,
          eventDate,
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
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-96 border-gray-600">
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
              className="w-full px-3 py-2 border rounded bg-gray-800 text-gray-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-100 mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProgressStatus)}
              className="w-full px-3 py-2 border rounded bg-gray-800 text-gray-200"
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
              className="px-4 py-2 bg-gray-600 text-gray-200 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
