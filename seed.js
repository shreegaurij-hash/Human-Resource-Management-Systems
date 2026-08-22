const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function seed() {
  const employees = JSON.parse(fs.readFileSync('./src/data/dataset.json', 'utf8'));
  const admins = JSON.parse(fs.readFileSync('./src/data/admin_logins.json', 'utf8'));

  const usersToInsert = [];

  for (const e of employees) {
    if (e.Email) {
      usersToInsert.push({
        empId: e.EmpID ? String(e.EmpID) : `EMP-${Math.floor(Math.random()*10000)}`,
        name: e.Employee_Name,
        email: e.Email,
        password: e.Password || "Dayflow@123!",
        role: "EMPLOYEE",
        department: e.Department || "General",
        designation: e.Position || "Staff",
      });
    }
  }

  for (const a of admins) {
    if (a.Email) {
      usersToInsert.push({
        empId: `ADMIN-${Math.floor(Math.random()*10000)}`,
        name: a.Admin_Name,
        email: a.Email,
        password: a.Password,
        role: "ADMIN",
        department: "Executive Office",
        designation: a.Role || "HR Admin",
      });
    }
  }

  for (const user of usersToInsert) {
    try {
      await prisma.user.create({ data: user });
    } catch(e) {}
  }
  console.log("Database seeded!");
}
seed().catch(console.error).finally(() => prisma.$disconnect());
