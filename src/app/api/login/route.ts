import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();
    
    // Read datasets dynamically so file uploads take effect instantly without server restart
    const adminPath = path.join(process.cwd(), 'src', 'data', 'admin_logins.json');
    const datasetPath = path.join(process.cwd(), 'src', 'data', 'dataset.json');
    
    const adminLogins = JSON.parse(fs.readFileSync(adminPath, 'utf8'));
    const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

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
    console.error("LOGIN ERROR:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

