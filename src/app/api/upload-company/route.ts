import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import * as xlsx from 'xlsx';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let parsedData: any[] = [];

    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
      const workbook = xlsx.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      parsedData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    } else if (file.name.endsWith('.json')) {
      parsedData = JSON.parse(buffer.toString('utf-8'));
    } else {
      return NextResponse.json({ error: 'Unsupported file type. Please upload .xlsx, .csv, or .json' }, { status: 400 });
    }

    // Write to dataset.json as a backup
    const datasetPath = path.join(process.cwd(), 'src', 'data', 'dataset.json');
    fs.writeFileSync(datasetPath, JSON.stringify(parsedData, null, 2), 'utf-8');

    // Insert into Prisma Database
    try {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      
      // Delete existing employees (except admins perhaps? Actually, just wipe users to re-onboard)
      await prisma.user.deleteMany({});
      
      const usersToInsert = parsedData.map(d => ({
        empId: d.EmpID || `EMP-${Math.floor(Math.random()*10000)}`,
        name: d.Employee_Name || d.Admin_Name || "Unknown",
        email: d.Email,
        password: d.Password || "Dayflow@123!",
        role: d.Role && d.Role.includes("Admin") ? "ADMIN" : "EMPLOYEE",
        department: d.Department || "General",
        designation: d.Position || d.Role || "Staff",
      })).filter(u => u.email); // Only insert rows with emails

      // Insert all
      for (const user of usersToInsert) {
        try {
          await prisma.user.create({ data: user });
        } catch(e) {}
      }
      await prisma.$disconnect();
    } catch (dbError) {
      console.error("Prisma insertion failed:", dbError);
    }

    // Get API key for AI analysis
    const apiKey = process.env.GROQ_API_KEY;
    let aiAnalysis = "Dataset uploaded successfully, but AI analysis was skipped due to missing API key.";

    if (apiKey) {
      // Create a small summary for the AI
      const departments = [...new Set(parsedData.map(d => d.Department || d.department).filter(Boolean))];
      const positions = [...new Set(parsedData.map(d => d.Position || d.position).filter(Boolean))];
      
      const prompt = `
A new company has just onboarded their workforce dataset into the Dayflow HRMS.
Here is the data summary:
- Total Employees: ${parsedData.length}
- Departments: ${departments.join(', ')}
- Example Roles: ${positions.slice(0, 5).join(', ')}

Provide a very enthusiastic, professional 3-sentence summary analyzing this company's workforce and welcoming them to Dayflow.
`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b',
          messages: [
            { role: "system", content: "You are Dayflow AI, the smart HR assistant." },
            { role: 'user', content: prompt }
          ],
          temperature: 0.5
        })
      });

      const data = await response.json();
      if (response.ok && data.choices && data.choices.length > 0) {
        aiAnalysis = data.choices[0].message.content;
      }
    }

    return NextResponse.json({ success: true, count: parsedData.length, analysis: aiAnalysis });

  } catch (error: any) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
