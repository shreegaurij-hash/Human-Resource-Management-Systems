import { NextResponse } from 'next/server';
import dataset from '@/data/dataset.json';

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();
    
    // Find the user in the dataset
    const user = dataset.find((u: any) => u.Email === email && u.Password === password);
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Role-based auth restriction
    const dept = user.Department.trim();
    if (role === 'Admin' && dept !== 'Admin Offices' && dept !== 'Executive Office') {
      return NextResponse.json({ error: 'Access denied: You do not have administrative privileges.' }, { status: 403 });
    }

    return NextResponse.json({ 
      user: {
        id: user.EmpID,
        name: user.Employee_Name,
        email: user.Email,
        department: user.Department,
        position: user.Position,
        role: role // 'Employee' or 'Admin'
      } 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
