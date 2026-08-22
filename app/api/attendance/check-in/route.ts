import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const now = new Date();
    // Normalize date to midnight UTC for the 'date' field
    const dateOnly = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    // Check if user already has an attendance record for today
    const existing = await prisma.attendance.findUnique({
      where: {
        userId_date: {
          userId,
          date: dateOnly,
        }
      }
    });

    if (existing) {
      return NextResponse.json({ error: 'Already checked in for today' }, { status: 400 });
    }

    // Determine status (Late logic - e.g., after 9:30 AM local time)
    // For simplicity, we just set PRESENT. Complex logic can be injected here.
    const status = 'PRESENT'; 

    const attendance = await prisma.attendance.create({
      data: {
        userId,
        date: dateOnly,
        checkInTime: now,
        status
      }
    });

    return NextResponse.json({ message: 'Check-in successful', data: attendance }, { status: 201 });
  } catch (error: any) {
    console.error('Check-in error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
