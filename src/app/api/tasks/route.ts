// app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, ProgressStatus } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../authoptions';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const tasks = await prisma.task.findMany({
      include: { user: true },
      where: {
        user:{
          email: session.user?.email,
        }
      },
    });

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tasks' + error}, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, status, eventDate } = await req.json();

    if (!name ) {
      return NextResponse.json({ error: 'Name are required' }, { status: 400 });
    }

    const newTask = await prisma.task.create({
      data: {
        name,
        user: {
          connect: { email: session.user?.email },
        },
        status: status || ProgressStatus.PENDING,
        eventDate : new Date(eventDate),
      }
    });


    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create task' + error }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { taskId } = await request.json(); // Assuming taskId is sent in the request body

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    // Check if the task exists
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Optionally, check for authorization if the task belongs to the user
    const session = await getServerSession(authOptions);
    if (!session ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete the task
    await prisma.task.delete({
      where: { id: taskId },
    });

    return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(error); // For logging the error
    return NextResponse.json({ error: 'Failed to delete task: ' + error }, { status: 500 });
  }
}
