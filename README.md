# Task Management Calendar

This project is a web application built with Next.js that provides a calendar view for managing tasks. Users can view tasks on specific dates, create new tasks, and manage their status. A sidebar provides a dashboard for viewing and filtering all tasks.

## Features

* **Calendar View:** Displays a monthly calendar with indicators for days containing tasks.
* **Task Creation:** Allows users to create new tasks by clicking on a day in the calendar.
* **Task Status:** Supports different statuses for tasks (Pending, In Progress, Completed).
* **Task Sidebar:** A responsive sidebar that lists all tasks with the ability to filter by status.
* **Task Deletion:** Users can delete tasks from the sidebar.
* **Local Storage Persistence:** Tasks are temporarily stored in the browser's local storage for offline access and faster initial load.
* **API Integration:** Interacts with a backend API (built with Next.js API routes) to fetch and persist task data.
* **Database** Postgres is used to store the data and prisma as ORM
* **Responsive Design:** The layout adapts to different screen sizes, including a hamburger menu for the task sidebar on mobile.

## UI
![image](https://github.com/user-attachments/assets/8b360843-668f-4ffb-a278-0c753ed52cb3)

## SetUp

```bash
git clone https://github.com/MohitGupta14/tasky
cd tasky
npm i
npm run dev
