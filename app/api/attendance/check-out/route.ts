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
    const dateOnly = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    const existing = await prisma.attendance.findUnique({
      where: {
        userId_date: {
          userId,
          date: dateOnly,
        }
      }
    });

    if (!existing) {
      return NextResponse.json({ error: 'No check-in record found for today' }, { status: 400 });
    }

    if (existing.checkOutTime) {
      return NextResponse.json({ error: 'Already checked out for today' }, { status: 400 });
    }

    // Calculate work hours
    const diffMs = now.getTime() - new Date(existing.checkInTime).getTime();
    const workHours = diffMs / (1000 * 60 * 60);

    const attendance = await prisma.attendance.update({
      where: { id: existing.id },
      data: {
        checkOutTime: now,
        workHours: parseFloat(workHours.toFixed(2))
      }
    });

    return NextResponse.json({ message: 'Check-out successful', data: attendance }, { status: 200 });
  } catch (error: any) {
    console.error('Check-out error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
