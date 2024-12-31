import { prisma } from '@/app/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const tasks = await prisma.task.findMany()
    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching tasks' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const task = await prisma.task.create({
      data: json,
    })
    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json({ error: 'Error creating task' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const json = await request.json()
    const task = await prisma.task.update({
      where: { id: json.id },
      data: json,
    })
    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json({ error: 'Error updating task' }, { status: 500 })
  }
} 