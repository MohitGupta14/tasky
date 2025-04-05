'use client';
import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameDay } from 'date-fns';
import CreateTaskModal from './CreateTaskModal';
import { ProgressStatus } from '@prisma/client';
import '../../styles/globals.css';

interface Task {
  id: number;
  name: string;
  status: ProgressStatus;
  eventDate: string;
}

export default function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch tasks from localStorage first
    const loadTasksFromLocalStorage = () => {
      const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      if (storedTasks.length > 0) {
        setTasks(storedTasks);
        setIsLoading(false);
      } else {
        // If no tasks in localStorage, fetch from the server
        fetchTasks();
      }
    };

    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/tasks');
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
          // Store the fetched tasks in localStorage for future use
          localStorage.setItem('tasks', JSON.stringify(data));
        }
      } catch (error) {
        console.error('Failed to fetch tasks', error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };

    loadTasksFromLocalStorage(); // Try loading tasks from localStorage
  }, [currentMonth]); // Refetch tasks when month changes

  const generateCalendarDays = () => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));

    return eachDayOfInterval({ start, end }).map(date => ({
      date,
      isCurrentMonth: date.getMonth() === currentMonth.getMonth()
    }));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.eventDate);
      return isSameDay(taskDate, date);
    });
  };

  const getStatusColor = (status: ProgressStatus) => {
    switch (status) {
      case ProgressStatus.PENDING:
        return 'bg-yellow-500';
      case ProgressStatus.IN_PROGRESS:
        return 'bg-blue-500';
      case ProgressStatus.COMPLETED:
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 border border-gray-200 h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
            className="px-6 py-3 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 transition-all duration-200 shadow-md font-bold"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
            className="px-6 py-3 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 transition-all duration-200 shadow-md font-bold"
          >
            Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center flex-grow">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="font-bold text-gray-900 mb-2 text-lg">{day}</div>
        ))}
        {isLoading ? (
          <div className="col-span-7 flex flex-col justify-center items-center h-64">
            <div className="loader">
              <div className="relative w-24 h-24">
                {/* Outer circle */}
                <div className="absolute inset-0 rounded-full border-4 border-blue-200 opacity-25"></div>
                {/* Spinning circle */}
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
                {/* Calendar icon in center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <p className="mt-4 text-blue-600 font-medium">Tasky...</p>
            </div>
          </div>
        ) : (
          calendarDays.map((day, index) => {
            const tasksOnDay = getTasksForDate(day.date);
            
            return (
              <div
                key={index}
                onClick={() => handleDateClick(day.date)}
                className={`
                  p-4 border rounded-md cursor-pointer transition-all duration-200 shadow-sm flex flex-col
                  ${!day.isCurrentMonth ? 'bg-gray-100 text-gray-600' : 'bg-white text-gray-900'}
                  ${day.date.toDateString() === new Date().toDateString() ? 'bg-blue-100 ring-2 ring-blue-500' : ''}
                  ${tasksOnDay.length > 0 ? 'hover:bg-gray-50' : 'hover:bg-gray-100'}
                `}
              >
                <div className="flex justify-center mb-1">
                  <span className={`
                    font-bold text-xl
                    ${!day.isCurrentMonth ? 'text-gray-600' : 'text-gray-900'}
                    ${day.date.toDateString() === new Date().toDateString() ? 'text-blue-800 font-extrabold' : ''}
                  `}>
                    {format(day.date, 'd')}
                  </span>
                </div>
                
                {/* Tasks for this day */}
                <div className="mt-1 space-y-1 overflow-y-auto max-h-16">
                  {tasksOnDay.length > 0 ? (
                    tasksOnDay.map(task => (
                      <div 
                        key={task.id}
                        className="flex items-center truncate text-xs"
                        title={task.name}
                      >
                        <span className={`w-2 h-2 mr-1 rounded-full ${getStatusColor(task.status)}`}></span>
                        <span className="truncate">{task.name}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-400 text-center"></div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {isModalOpen && (
        <CreateTaskModal 
          date={selectedDate} 
          onClose={() => {
            setIsModalOpen(false);
            // Refetch tasks after modal closes to get any newly created tasks
            const fetchTasks = async () => {
              try {
                const response = await fetch('/api/tasks');
                if (response.ok) {
                  const data = await response.json();
                  setTasks(data);
                  // Store the fetched tasks in localStorage for future use
                  localStorage.setItem('tasks', JSON.stringify(data));
                }
              } catch (error) {
                console.error('Failed to fetch tasks', error);
              }
            };
            fetchTasks();
          }} 
        />
      )}
    </div>
  );
}
