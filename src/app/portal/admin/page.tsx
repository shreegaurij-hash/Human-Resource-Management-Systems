import { AdminDashboard } from "@/features/dashboards";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function AdminPortalPage() {
  const dbUsers = await prisma.user.findMany({
    where: { 
      role: { not: 'ADMIN' }
    },
    orderBy: {
      name: 'asc'
    }
  });

  const employees = dbUsers.map(user => {
    const nameParts = user.name.split(' ');
    const initials = nameParts.length > 1 
      ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]) 
      : nameParts[0][0];

    // For the UI, we randomly distribute statuses just to show the filters working 
    // since we haven't wired up live attendance check-ins yet.
    const statuses = ["Present", "Present", "Present", "Present", "Absent", "On Leave"];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      id: user.empId || user.id,
      name: user.name,
      initials: initials.toUpperCase(),
      role: user.designation || 'Employee',
      department: user.department || 'General',
      status, 
    };
  });

  const dbLeaves = await prisma.leaveRequest.findMany({
    where: { status: 'PENDING' },
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  });

  const pendingLeaves = dbLeaves.map(leave => {
    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
    
    // Format "Sep 1"
    const formatDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return {
      id: leave.id,
      employeeName: leave.user.name,
      employeeRole: `${leave.user.department || 'General'} • ${leave.user.empId || 'EMP'}`,
      type: leave.type === 'PAID' ? 'Paid Leave' : leave.type === 'SICK' ? 'Sick Leave' : 'Unpaid Leave',
      duration: `${formatDate(start)} – ${formatDate(end)}`,
      days: `${diffDays}d`,
      initials: leave.user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    };
  });

  return <AdminDashboard employees={employees} pendingLeaves={pendingLeaves} />;
}
