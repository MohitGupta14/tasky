// app/api/tasks/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, ProgressStatus } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/app/authoptions";

const prisma = new PrismaClient();

// export async function GET(
//   req: NextRequest, 
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const taskId = parseInt(params.id);
//     const task = await prisma.task.findUnique({
//       where: { id: taskId },
//       include: { user: true }
//     });

//     if (!task) {
//       return NextResponse.json({ error: 'Task not found' }, { status: 404 });
//     }

//     return NextResponse.json(task, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to fetch task' +  error }, { status: 500 });
//   }
// }

// UPDATE task
// export async function PUT(
//   req: NextRequest, 
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const taskId = parseInt(params.id);
//     const { name, status } = await req.json();

//     const updatedTask = await prisma.task.update({
//       where: { id: taskId },
//       data: {
//         name,
//         status: status as ProgressStatus
//       }
//     });

//     return NextResponse.json(updatedTask, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to update task ' + error }, { status: 500 });
//   }
// }

// DELETE task

export async function DELETE(
  request: NextRequest, // Required parameter
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Valid Task ID is required" }, { status: 400 });
  }

  try {
    // Convert id to integer before using it in Prisma query
    await prisma.task.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
