import CalendarView from './components/CalendarView';
import TaskSidebar from './components/TaskSideBar';
import '../styles/globals.css';

export default function CalendarPage() {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <div className="w-full md:w-3/4 px-2">
        <CalendarView />
      </div>
      <div className="w-full md:w-1/4 bg-white shadow-lg p-4 border-t md:border-l">
        <TaskSidebar />
      </div>
    </div>
  );
}
