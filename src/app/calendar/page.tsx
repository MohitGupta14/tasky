import CalendarView from './components/CalendarView';
import TaskSidebar from './components/TaskSideBar';

export default function CalendarPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-3/4 p-6">
        <CalendarView />
      </div>
      <div className="w-1/4 bg-white shadow-lg p-4 border-l">
        <TaskSidebar />
      </div>
    </div>
  );
}