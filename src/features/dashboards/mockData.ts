// Central mock data store for dashboards
// Replace with real API calls when backend is ready

export const mockEmployee = {
  id: "EMP-2024-0042",
  name: "Arjun Mehta",
  role: "Senior Frontend Developer",
  department: "Engineering",
  avatar: null as null, // null = initials fallback
  initials: "AM",
  email: "arjun.mehta@dayflow.in",
  phone: "+91 98765 43210",
  joinDate: "Jan 15, 2023",
};

export const mockAttendance = {
  status: "Checked In" as "Checked In" | "Checked Out" | "Absent",
  checkIn: "09:12 AM",
  checkOut: null as string | null,
  todayHours: "5h 34m",
  targetHours: "8h 00m",
  progressPercent: 70,
  weekData: [
    { day: "Mon", hours: 8.5, status: "present" },
    { day: "Tue", hours: 7.8, status: "present" },
    { day: "Wed", hours: 8.2, status: "present" },
    { day: "Thu", hours: 5.6, status: "present" },
    { day: "Fri", hours: 0, status: "weekend" },
    { day: "Sat", hours: 0, status: "weekend" },
    { day: "Sun", hours: 0, status: "weekend" },
  ],
};

export const mockAttendanceSummary = {
  present: 18,
  absent: 2,
  onLeave: 1,
  total: 21,
};

export const mockLeaveBalance = {
  paid: { used: 6, total: 20 },
  sick: { used: 2, total: 10 },
  unpaid: { used: 0, total: 5 },
};

export const mockLeaveRequests = [
  {
    id: "LR-001",
    type: "Paid Leave",
    from: "Aug 25, 2026",
    to: "Aug 28, 2026",
    days: 4,
    reason: "Family vacation",
    status: "Pending" as const,
  },
  {
    id: "LR-002",
    type: "Sick Leave",
    from: "Jul 10, 2026",
    to: "Jul 11, 2026",
    days: 2,
    reason: "Fever",
    status: "Approved" as const,
  },
  {
    id: "LR-003",
    type: "Unpaid Leave",
    from: "Jun 5, 2026",
    to: "Jun 5, 2026",
    days: 1,
    reason: "Personal errand",
    status: "Rejected" as const,
  },
];

export const mockRecentActivity = [
  { id: 1, action: "Checked in at 09:12 AM", time: "2h ago", icon: "clock" },
  { id: 2, action: "Leave request submitted (Aug 25–28)", time: "1d ago", icon: "calendar" },
  { id: 3, action: "Profile updated successfully", time: "3d ago", icon: "user" },
  { id: 4, action: "Payslip for July downloaded", time: "1w ago", icon: "file" },
];

export const mockEmployeeNotifications = [
  { id: 1, message: "Your leave request (LR-001) is pending approval.", type: "warning", time: "1d ago" },
  { id: 2, message: "August payslip is now available.", type: "info", time: "3d ago" },
  { id: 3, message: "Team meeting scheduled for tomorrow at 10 AM.", type: "info", time: "5d ago" },
];

// ── Admin mock data ─────────────────────────────────────────────────────────

export const mockAdminStats = {
  totalEmployees: 124,
  present: 98,
  absent: 14,
  onLeave: 12,
};

export const mockEmployeeList = [
  { id: "EMP-001", name: "Priya Sharma",    department: "Engineering",  designation: "Sr. Developer",    status: "Present", avatar: "PS" },
  { id: "EMP-002", name: "Rahul Gupta",     department: "Product",      designation: "Product Manager",  status: "Present", avatar: "RG" },
  { id: "EMP-003", name: "Neha Kapoor",     department: "Design",       designation: "UI/UX Designer",   status: "Absent",  avatar: "NK" },
  { id: "EMP-004", name: "Vikram Singh",    department: "HR",           designation: "HR Specialist",    status: "On Leave", avatar: "VS" },
  { id: "EMP-005", name: "Ananya Iyer",     department: "Engineering",  designation: "Backend Dev",      status: "Present", avatar: "AI" },
  { id: "EMP-006", name: "Karan Malhotra",  department: "Sales",        designation: "Sales Executive",  status: "Present", avatar: "KM" },
  { id: "EMP-007", name: "Deepika Reddy",   department: "Finance",      designation: "Finance Analyst",  status: "Absent",  avatar: "DR" },
  { id: "EMP-008", name: "Aditya Joshi",    department: "Engineering",  designation: "DevOps Engineer",  status: "Present", avatar: "AJ" },
];

export const mockPendingLeaves = [
  { id: "LR-101", employee: "Priya Sharma", avatar: "PS", type: "Paid Leave", from: "Sep 2", to: "Sep 4", days: 3, department: "Engineering" },
  { id: "LR-102", employee: "Karan Malhotra", avatar: "KM", type: "Sick Leave", from: "Sep 1", to: "Sep 1", days: 1, department: "Sales" },
  { id: "LR-103", employee: "Ananya Iyer", avatar: "AI", type: "Unpaid Leave", from: "Sep 8", to: "Sep 10", days: 3, department: "Engineering" },
  { id: "LR-104", employee: "Aditya Joshi", avatar: "AJ", type: "Paid Leave", from: "Sep 15", to: "Sep 18", days: 4, department: "Engineering" },
];

export const mockAdminActivity = [
  { id: 1, action: "Approved leave request for Rahul Gupta (LR-098)", time: "30m ago", icon: "check" },
  { id: 2, action: "New employee Sana Khan onboarded", time: "2h ago", icon: "user" },
  { id: 3, action: "Attendance report for August exported", time: "1d ago", icon: "file" },
  { id: 4, action: "Rejected leave request for Neha Kapoor (LR-095)", time: "2d ago", icon: "x" },
  { id: 5, action: "Payroll processed for 124 employees", time: "1w ago", icon: "wallet" },
];

export const mockAdminNotifications = [
  { id: 1, message: "4 leave requests are pending your approval.", type: "warning", time: "1h ago" },
  { id: 2, message: "14 employees are absent today. 3 without notice.", type: "error", time: "2h ago" },
  { id: 3, message: "Monthly attendance report is ready to download.", type: "info", time: "1d ago" },
];
