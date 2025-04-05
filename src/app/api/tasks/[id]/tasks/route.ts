// app/api/users/[id]/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, ProgressStatus } from '@prisma/client';
import { getServerSession } from 'next-auth';
import {authOptions}  from "@/app/authoptions";

const prisma = new PrismaClient();

// GET tasks for a specific user
export async function GET(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);
    const tasks = await prisma.task.findMany({
      where: { userId }
    });

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user tasks' + error }, { status: 500 });
  }
}

// CREATE task for a specific user
export async function POST(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(params.id);
    const { name, status } = await req.json();

    const newTask = await prisma.task.create({
      data: {
        name,
        userId,
        status: status || ProgressStatus.PENDING
      }
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create task' + error }, { status: 500 });
  }
}