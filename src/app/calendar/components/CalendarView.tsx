'use client';
import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import CreateTaskModal from './CreateTaskModal';

export default function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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

  const calendarDays = generateCalendarDays();

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Previous
          </button>
          <button 
            onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Next
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="font-bold text-gray-600">{day}</div>
        ))}
        {calendarDays.map((day, index) => (
          <div 
            key={index} 
            onClick={() => handleDateClick(day.date)}
            className={`
              p-2 border rounded cursor-pointer 
              ${!day.isCurrentMonth ? 'bg-gray-100 text-gray-400' : 'hover:bg-blue-50'}
            `}
          >
            {format(day.date, 'd')}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <CreateTaskModal 
          date={selectedDate} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}