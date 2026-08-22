import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { name: 'asc' }
    });
    
    // Map to the shape expected by AdminDashboard
    const mapped = users.map(u => ({
      id: u.empId || u.id,
      name: u.name,
      role: u.designation || 'Employee',
      department: u.department || 'General',
      status: 'Present', // Hardcoded for now unless attendance is joined
      email: u.email
    }));

    return NextResponse.json(mapped);
  } catch (error: any) {
    console.error("GET EMPLOYEES ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
