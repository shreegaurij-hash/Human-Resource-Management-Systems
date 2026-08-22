"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, Calendar, Wallet, User, FileText, ChevronRight, LogIn, LogOut, Bell
} from "lucide-react";
import { useCurrentUser } from "../../../hooks/useCurrentUser";

// ── helpers ─────────────────────────────────────────────────────────────────
function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

// --- MOCK DATA ---
const mockAttendance = {
  status: "Checked In",
  checkIn: "09:12 AM",
  todayHours: "5h 34m",
  targetHours: "8h 00m",
  progressPercent: 70,
  weekData: [
    { day: "Mon", hours: 8.5, status: "present" },
    { day: "Tue", hours: 7.6, status: "present" },
    { day: "Wed", hours: 8.2, status: "present" },
    { day: "Thu", hours: 5.6, status: "present" },
    { day: "Fri", hours: 0, status: "upcoming" },
  ]
};

const mockAttendanceSummary = { present: 18, absent: 2, onLeave: 1 };

const mockLeaveBalance = {
  paid: { total: 20, used: 6 },
  sick: { total: 10, used: 2 },
  unpaid: { total: 5, used: 0 }
};

const mockLeaveRequests = [
  { id: "LR-001", type: "Paid Leave", from: "Aug 25, 2026", to: "Aug 28, 2026", days: 4, reason: "Family vacation", status: "Pending" },
  { id: "LR-002", type: "Sick Leave", from: "Jul 10, 2026", to: "Jul 11, 2026", days: 2, reason: "Fever", status: "Approved" }
];

const mockRecentActivity = [
  { id: 1, action: "Payslip for July generated", time: "2 days ago", icon: "payslip" },
  { id: 2, action: "Leave request approved by manager", time: "1 week ago", icon: "leave" },
  { id: 3, action: "Profile details updated", time: "2 weeks ago", icon: "profile" }
];

const mockEmployeeNotifications = [
  { id: 1, message: "Your leave request LR-001 is pending manager approval.", time: "2 hours ago", type: "warning" },
  { id: 2, message: "July 2026 payslip is now available.", time: "1 day ago", type: "info" }
];

const activityIcon: Record<string, React.ReactNode> = {
  payslip: <FileText size={16} />,
  leave: <Calendar size={16} />,
  profile: <User size={16} />
};

const notifColor: Record<string, string> = {
  warning: "border-l-amber-500",
  info: "border-l-blue-500"
};

// Reusable Card Component
const SectionCard = ({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) => (
  <div className={cn("bg-white border border-gray-200 rounded-2xl p-6 shadow-sm", className)}>
    <h3 className="text-sm font-semibold tracking-wide text-gray-800 uppercase mb-5">{title}</h3>
    {children}
  </div>
);

// Stat Pill
const StatPill = ({ label, value, colorClass }: { label: string, value: string | number, colorClass: string }) => (
  <div className={cn("p-4 rounded-xl border border-gray-100 flex flex-col justify-between h-24", colorClass)}>
    <span className="text-3xl font-bold text-gray-900">{value}</span>
    <span className="text-xs font-medium uppercase tracking-wider text-gray-600">{label}</span>
  </div>
);

// Quick Access Link
const QuickLink = ({ icon, label, href }: { icon: React.ReactNode, label: string, href: string }) => (
  <a href={href} className="group flex flex-col items-center justify-center gap-3 p-5 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-300 hover:bg-white transition-all shadow-sm hover:shadow-md">
    <div className="text-gray-500 group-hover:text-black transition-colors">
      {icon}
    </div>
    <span className="text-xs font-semibold text-gray-700 group-hover:text-black uppercase tracking-wider transition-colors">{label}</span>
  </a>
);

export function EmployeeDashboard() {
  const { user, isLoaded } = useCurrentUser();
  const [checkedIn, setCheckedIn] = useState(mockAttendance.status === "Checked In");
  const [checkInTime, setCheckInTime] = useState(mockAttendance.checkIn);
  const [showNotifs, setShowNotifs] = useState(false);

  if (!isLoaded) return null;

  const mockEmployee = user ? {
    id: user.id || "EMP-000",
    name: user.name || "Unknown User",
    role: user.position || "Employee",
    department: user.department || "General",
    initials: user.name ? user.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2) : "UU",
    email: user.email || "",
  } : {
    id: "EMP-2024-0042",
    name: "Arjun Mehta",
    role: "Senior Frontend Developer",
    department: "Engineering",
    initials: "AM",
    email: "arjun.mehta@dayflow.in",
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.4 } }
  };

  const handleCheckInOut = () => {
    if (!checkedIn) {
      setCheckInTime(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
    }
    setCheckedIn(!checkedIn);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm">
            {mockEmployee.initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{mockEmployee.name}</p>
            <p className="text-xs text-gray-500 font-medium">{mockEmployee.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className={cn(
            "text-[10px] font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider",
            checkedIn ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"
          )}>
            {checkedIn ? "● Checked In" : "● Checked Out"}
          </span>
          <button onClick={() => setShowNotifs(!showNotifs)} className="relative p-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm">
            <Bell size={18} className="text-gray-600" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center font-bold">
              {mockEmployeeNotifications.length}
            </span>
          </button>
        </div>
      </header>

      {/* ── Notification Dropdown ── */}
      <AnimatePresence>
        {showNotifs && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-20 right-6 z-40 w-80 bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-lg"
          >
            <p className="text-xs font-semibold tracking-wider text-gray-800 uppercase border-b border-gray-100 pb-2">Notifications</p>
            {mockEmployeeNotifications.map(n => (
              <div key={n.id} className={cn("border-l-2 pl-3 py-1", notifColor[n.type] ?? "border-l-gray-300")}>
                <p className="text-sm text-gray-800 font-medium leading-snug">{n.message}</p>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-1">{n.time}</p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Content Grid ── */}
      <motion.main 
        variants={containerVariants} 
        initial="hidden" 
        animate="show" 
        className="max-w-6xl mx-auto px-6 py-10 space-y-8"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-1">
              Good morning, {mockEmployee.name.split(" ")[0]} <span className="inline-block origin-bottom-right animate-wave">👋</span>
            </h1>
            <p className="text-gray-500 font-medium text-sm">
              {new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckInOut}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all shadow-sm",
                checkedIn ? "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50" : "bg-gray-900 text-white hover:bg-gray-800"
              )}
            >
              {checkedIn ? <LogOut size={16} /> : <LogIn size={16} />}
              {checkedIn ? "Check Out" : "Check In"}
            </motion.button>
          </div>
        </div>

        {/* ── Row 1: Profile + Today's Attendance + Hours ── */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center gap-5 shadow-sm">
            <div className="h-14 w-14 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-lg font-bold">
              {mockEmployee.initials}
            </div>
            <div>
              <h2 className="font-semibold text-base text-gray-900">{mockEmployee.name}</h2>
              <p className="text-xs text-gray-500 font-medium">{mockEmployee.role}</p>
              <p className="text-[10px] text-gray-400 font-mono mt-0.5">{mockEmployee.id}</p>
              <a href="/profile" className="text-[10px] font-semibold text-blue-600 mt-2 inline-flex items-center hover:underline uppercase tracking-wider">
                View Profile <ChevronRight size={12} className="ml-0.5" />
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
            <h3 className="text-xs font-semibold tracking-wide text-gray-600 uppercase mb-4">Today's Attendance</h3>
            <div className={cn("self-start px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider", checkedIn ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600")}>
              {checkedIn ? "Present" : "Absent"}
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm mt-4">
              <div>
                <p className="text-gray-400 font-medium uppercase tracking-wider text-[10px]">Check In</p>
                <p className="text-gray-900 font-semibold text-base">{checkedIn ? checkInTime : "--:--"}</p>
              </div>
              <div>
                <p className="text-gray-400 font-medium uppercase tracking-wider text-[10px]">Check Out</p>
                <p className="text-gray-900 font-semibold text-base">{!checkedIn && checkInTime !== mockAttendance.checkIn ? new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "--:--"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
            <h3 className="text-xs font-semibold tracking-wide text-gray-600 uppercase">Working Hours</h3>
            <p className="text-4xl font-bold text-gray-900 tracking-tight">{mockAttendance.todayHours}</p>
            <div className="mt-4">
              <div className="flex justify-between text-[10px] text-gray-500 font-medium uppercase tracking-wider mb-2">
                <span>Progress</span>
                <span>{mockAttendance.progressPercent}% of {mockAttendance.targetHours}</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${mockAttendance.progressPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-blue-500 rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Row 2: Attendance Summary + Leave Balance ── */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <SectionCard title="Attendance (This Month)">
            <div className="grid grid-cols-3 gap-3 mb-6">
              <StatPill label="Present" value={mockAttendanceSummary.present} colorClass="bg-blue-50/50 border-blue-100" />
              <StatPill label="Absent"  value={mockAttendanceSummary.absent}  colorClass="bg-rose-50/50 border-rose-100" />
              <StatPill label="On Leave" value={mockAttendanceSummary.onLeave} colorClass="bg-gray-50 border-gray-100" />
            </div>
            <div className="space-y-3">
              {mockAttendance.weekData.filter(d => d.status !== "weekend").map((d, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-[10px] w-6 text-gray-500 font-semibold uppercase">{d.day}</span>
                  <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full bg-gray-800 rounded-full"
                      style={{ width: `${(d.hours / 9) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Leave Balance */}
          <SectionCard title="Leave Balance">
            <div className="space-y-5">
              {[
                { label: "Paid Leave",   data: mockLeaveBalance.paid,   color: "bg-blue-500" },
                { label: "Sick Leave",   data: mockLeaveBalance.sick,   color: "bg-amber-500" },
                { label: "Unpaid Leave", data: mockLeaveBalance.unpaid, color: "bg-gray-400" },
              ].map(({ label, data, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-gray-700">{label}</span>
                    <span className="text-gray-900">
                      {data.used} <span className="text-gray-400 font-normal">/ {data.total} used</span>
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(data.used / data.total) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={cn("h-full rounded-full", color)}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium mt-1.5">{data.total - data.used} days remaining</p>
                </div>
              ))}
              <a href="/leave" className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-blue-600 hover:text-blue-700 transition-colors">
                Apply for Leave <ChevronRight size={12} />
              </a>
            </div>
          </SectionCard>
        </motion.div>

        {/* ── Row 3: Recent Leave Requests ── */}
        <motion.div variants={itemVariants}>
          <SectionCard title="Recent Leave Requests">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-gray-100">
                    {["ID", "Type", "Duration", "Days", "Reason", "Status"].map(h => (
                      <th key={h} className="pb-3 pr-4 text-[10px] text-gray-500 font-semibold uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {mockLeaveRequests.map(req => (
                    <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 pr-4 text-gray-500 font-mono text-xs">{req.id}</td>
                      <td className="py-3 pr-4 font-medium text-gray-800 whitespace-nowrap text-xs">{req.type}</td>
                      <td className="py-3 pr-4 text-gray-600 whitespace-nowrap text-xs">{req.from} – {req.to}</td>
                      <td className="py-3 pr-4 text-gray-800 font-medium text-xs">{req.days}d</td>
                      <td className="py-3 pr-4 text-gray-500 text-xs max-w-xs truncate">{req.reason}</td>
                      <td className="py-3">
                        <span className={cn("px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider", 
                          req.status === 'Approved' ? "bg-emerald-50 text-emerald-700" :
                          req.status === 'Pending' ? "bg-amber-50 text-amber-700" :
                          "bg-rose-50 text-rose-700"
                        )}>
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </motion.div>

        {/* ── Row 4: Activity + Quick Access ── */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent Activity */}
          <SectionCard title="Recent Activity">
            <div className="space-y-4">
              {mockRecentActivity.map(act => (
                <div key={act.id} className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100 text-gray-500">
                    {activityIcon[act.icon]}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-sm text-gray-800 font-medium truncate">{act.action}</p>
                    <p className="text-[10px] text-gray-400 font-medium mt-1">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Quick Access */}
          <SectionCard title="Quick Access">
            <div className="grid grid-cols-2 gap-3">
              <QuickLink icon={<User size={20} />}       label="Profile" href="/profile" />
              <QuickLink icon={<Clock size={20} />}      label="Attendance"   href="/attendance" />
              <QuickLink icon={<Calendar size={20} />}   label="Time Off"     href="/leave" />
              <QuickLink icon={<Wallet size={20} />}     label="Salary"       href="/payroll" />
            </div>
          </SectionCard>
        </motion.div>
      </motion.main>
    </div>
  );
}
