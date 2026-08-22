import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();
    
    // Authenticate against Prisma database
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (role === 'Admin') {
      // Check if user has administrative privileges (role === 'ADMIN' or specific departments)
      const isExecutive = user.department === 'Executive Office' || user.department === 'Admin Offices';
      if (user.role !== 'ADMIN' && !isExecutive) {
        return NextResponse.json({ error: 'Access denied: You do not have administrative privileges.' }, { status: 403 });
      }
      
      return NextResponse.json({ 
        user: {
          id: user.empId || user.id,
          name: user.name,
          email: user.email,
          department: user.department,
          position: user.designation,
          role: 'Admin'
        } 
      });
    } else {
      return NextResponse.json({ 
        user: {
          id: user.empId || user.id,
          name: user.name,
          email: user.email,
          department: user.department,
          position: user.designation,
          role: 'Employee'
        } 
      });
    }
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


