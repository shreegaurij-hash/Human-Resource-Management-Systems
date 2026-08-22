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

    // Role-based auth (for now, any valid user can log into their chosen portal, but in reality we'd restrict Admins)
    // We'll let them pass through to demonstrate the UI
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
