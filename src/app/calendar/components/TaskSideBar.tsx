// app/calendar/components/TaskSidebar.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { ProgressStatus } from '@prisma/client';

interface Task {
  id: number;
  name: string;
  status: ProgressStatus;
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

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Tasks</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Filter Tasks</label>
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value as ProgressStatus | 'ALL')}
          className="w-full px-3 py-2 border rounded"
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
              p-3 rounded shadow-sm
              ${task.status === ProgressStatus.PENDING ? 'bg-yellow-100' : 
                task.status === ProgressStatus.IN_PROGRESS ? 'bg-blue-100' : 
                task.status === ProgressStatus.COMPLETED ? 'bg-green-100' : 
                'bg-red-100'}
            `}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{task.name}</span>
              <span className="text-sm text-gray-600">{task.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}