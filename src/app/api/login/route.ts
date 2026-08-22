import { NextResponse } from 'next/server';
import dataset from '@/data/dataset.json';
import adminLogins from '@/data/admin_logins.json';

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();
    
    if (role === 'Admin') {
      // Authenticate against Admin Logins sheet
      const admin = adminLogins.find((a: any) => a.Email === email && a.Password === password);
      
      if (!admin) {
        return NextResponse.json({ error: 'Invalid admin email or password' }, { status: 401 });
      }
      
      return NextResponse.json({ 
        user: {
          id: admin.Admin_Name.replace(/\s+/g, '-').toLowerCase(),
          name: admin.Admin_Name,
          email: admin.Email,
          department: 'Executive Office',
          position: admin.Role,
          role: 'Admin'
        } 
      });
    } else {
      // Authenticate against Employee dataset
      const user = dataset.find((u: any) => u.Email === email && u.Password === password);
      
      if (!user) {
        return NextResponse.json({ error: 'Invalid employee email or password' }, { status: 401 });
      }

      return NextResponse.json({ 
        user: {
          id: user.EmpID,
          name: user.Employee_Name,
          email: user.Email,
          department: user.Department,
          position: user.Position,
          role: 'Employee'
        } 
      });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
