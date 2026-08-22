"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, Calendar, User, FileText, Bell, CheckCircle2,
  XCircle, AlertCircle, LogIn, LogOut, TrendingUp,
  ChevronRight, Wallet
} from "lucide-react";
import {
  mockEmployee,
  mockAttendance,
  mockAttendanceSummary,
  mockLeaveBalance,
  mockLeaveRequests,
  mockRecentActivity,
  mockEmployeeNotifications,
} from "../mockData";

// ── helpers ─────────────────────────────────────────────────────────────────
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const statusColor: Record<string, string> = {
  Pending:  "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  Approved: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  Rejected: "bg-rose-500/15 text-rose-400 border border-rose-500/20",
};

const notifColor: Record<string, string> = {
  warning: "border-l-amber-400",
  info:    "border-l-blue-400",
  error:   "border-l-rose-400",
};

const activityIcon: Record<string, React.ReactElement> = {
  clock:    <Clock size={14} />,
  calendar: <Calendar size={14} />,
  user:     <User size={14} />,
  file:     <FileText size={14} />,
};

// ── sub-components ──────────────────────────────────────────────────────────

function Avatar({ initials, size = "lg" }: { initials: string; size?: "sm" | "md" | "lg" }) {
  const sz = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-16 w-16 text-xl" }[size];
  return (
    <div className={cn("rounded-full bg-gray-100 flex items-center justify-center font-black text-black", sz)}>
      {initials}
    </div>
  );
}

function SectionCard({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl bg-white shadow-sm border border-gray-200 p-6", className)}>
      <h3 className="text-sm font-bold tracking-widest text-gray-600 uppercase mb-5">{title}</h3>
      {children}
    </div>
  );
}

function StatPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={cn("flex flex-col gap-1 rounded-xl px-4 py-3 text-black", color)}>
      <span className="text-2xl font-black">{value}</span>
      <span className="text-xs font-bold uppercase tracking-wider opacity-80">{label}</span>
    </div>
  );
}

function QuickLink({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
    >
      <div className="p-3 rounded-xl bg-gray-200 text-black">{icon}</div>
      <span className="text-xs font-bold text-gray-700 text-center">{label}</span>
    </motion.a>
  );
}

// ── main component ──────────────────────────────────────────────────────────

export function EmployeeDashboard() {
  const [checkedIn, setCheckedIn] = useState(mockAttendance.status === "Checked In");
  const [checkInTime, setCheckInTime] = useState(mockAttendance.checkIn);
  const [showNotifs, setShowNotifs] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  const handleCheckInOut = () => {
    setCheckedIn(!checkedIn);
    if (!checkedIn) {
      const now = new Date();
      setCheckInTime(now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-black">
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-30 bg-[#F8F9FA]/80 backdrop-blur border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar initials={mockEmployee.initials} size="sm" />
          <div>
            <p className="text-sm font-black text-black">{mockEmployee.name}</p>
            <p className="text-xs text-gray-500 font-medium">{mockEmployee.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className={cn(
            "text-xs font-bold px-3 py-1 rounded-full",
            checkedIn ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"
          )}>
            {checkedIn ? "● Checked In" : "● Checked Out"}
          </span>
          <button onClick={() => setShowNotifs(!showNotifs)} className="relative p-2 rounded-full bg-white shadow-sm hover:bg-gray-100 transition-colors">
            <Bell size={18} />
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-rose-500 text-black text-[9px] flex items-center justify-center font-black">
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
            className="absolute top-16 right-6 z-40 w-80 bg-white shadow-sm border border-gray-200 rounded-2xl shadow-2xl p-4 space-y-3"
          >
            <p className="text-xs font-bold tracking-widest text-gray-600 uppercase mb-3">Notifications</p>
            {mockEmployeeNotifications.map(n => (
              <div key={n.id} className={cn("border-l-2 pl-3 py-1", notifColor[n.type] ?? "border-l-neutral-600")}>
                <p className="text-sm text-black font-medium">{n.message}</p>
                <p className="text-xs text-gray-500 mt-0.5">{n.time}</p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6"
      >
        {/* ── Header Row ── */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tighter">
              Good Morning, {mockEmployee.name.split(" ")[0]} 👋
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleCheckInOut}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-full font-black text-sm transition-all shadow-lg",
              checkedIn
                ? "bg-rose-500 hover:bg-rose-600 text-black"
                : "bg-emerald-500 hover:bg-emerald-600 text-black"
            )}
          >
            {checkedIn ? <><LogOut size={16} /> Check Out</> : <><LogIn size={16} /> Check In</>}
          </motion.button>
        </motion.div>

        {/* ── Row 1: Profile + Attendance Status + Today's Hours ── */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* Profile card */}
          <div className="rounded-2xl bg-white shadow-sm border border-gray-200 p-6 flex items-center gap-5">
            <Avatar initials={mockEmployee.initials} size="lg" />
            <div className="min-w-0">
              <p className="text-lg font-black text-black truncate">{mockEmployee.name}</p>
              <p className="text-sm text-gray-600 font-medium truncate">{mockEmployee.role}</p>
              <p className="text-xs text-neutral-600 mt-1">{mockEmployee.department}</p>
              <p className="text-xs text-neutral-600">{mockEmployee.id}</p>
              <a href="/profile" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-black hover:text-gray-700 transition-colors">
                View Profile <ChevronRight size={12} />
              </a>
            </div>
          </div>

          {/* Attendance card */}
          <div className="rounded-2xl bg-white shadow-sm border border-gray-200 p-6 space-y-4">
            <h3 className="text-xs font-bold tracking-widest text-gray-600 uppercase">Today's Attendance</h3>
            <div className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold",
              checkedIn ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"
            )}>
              {checkedIn ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
              {checkedIn ? "Present" : "Absent"}
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500 font-medium">Check In</p>
                <p className="text-black font-black">{checkedIn ? checkInTime : "--:--"}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Check Out</p>
                <p className="text-black font-black">{!checkedIn && checkInTime !== mockAttendance.checkIn ? new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "--:--"}</p>
              </div>
            </div>
          </div>

          {/* Today's hours */}
          <div className="rounded-2xl bg-white shadow-sm border border-gray-200 p-6 space-y-4">
            <h3 className="text-xs font-bold tracking-widest text-gray-600 uppercase">Today's Working Hours</h3>
            <p className="text-4xl font-black">{mockAttendance.todayHours}</p>
            <div>
              <div className="flex justify-between text-xs text-gray-500 font-medium mb-2">
                <span>Progress</span>
                <span>{mockAttendance.progressPercent}% of {mockAttendance.targetHours}</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${mockAttendance.progressPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full bg-emerald-500"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Row 2: Attendance Summary + Leave Balance ── */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Attendance Summary */}
          <SectionCard title="Attendance Summary (This Month)">
            <div className="grid grid-cols-3 gap-3 mb-5">
              <StatPill label="Present" value={mockAttendanceSummary.present} color="bg-emerald-600" />
              <StatPill label="Absent"  value={mockAttendanceSummary.absent}  color="bg-rose-600" />
              <StatPill label="On Leave" value={mockAttendanceSummary.onLeave} color="bg-amber-600" />
            </div>
            <div className="space-y-1">
              {mockAttendance.weekData.filter(d => d.status !== "weekend").map((d, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs w-8 text-gray-500 font-bold">{d.day}</span>
                  <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${(d.hours / 9) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 w-10 text-right font-medium">{d.hours}h</span>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Leave Balance */}
          <SectionCard title="Leave Balance">
            <div className="space-y-5">
              {[
                { label: "Paid Leave",   data: mockLeaveBalance.paid,   color: "bg-blue-500" },
                { label: "Sick Leave",   data: mockLeaveBalance.sick,   color: "bg-rose-500" },
                { label: "Unpaid Leave", data: mockLeaveBalance.unpaid, color: "bg-neutral-600" },
              ].map(({ label, data, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-gray-700">{label}</span>
                    <span className="text-black font-black">
                      {data.used} <span className="text-gray-500 font-medium">/ {data.total} used</span>
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(data.used / data.total) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={cn("h-full rounded-full", color)}
                    />
                  </div>
                  <p className="text-xs text-neutral-600 mt-1">{data.total - data.used} days remaining</p>
                </div>
              ))}
              <a href="/leave" className="mt-2 inline-flex items-center gap-1.5 text-sm font-black text-black hover:text-gray-700 transition-colors">
                Apply for Leave <ChevronRight size={14} />
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
                  <tr className="text-left border-b border-gray-200">
                    {["ID", "Type", "Duration", "Days", "Reason", "Status"].map(h => (
                      <th key={h} className="pb-3 pr-6 text-xs text-gray-500 font-bold uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/50">
                  {mockLeaveRequests.map(req => (
                    <tr key={req.id} className="hover:bg-gray-100/30 transition-colors">
                      <td className="py-4 pr-6 text-gray-600 font-mono text-xs">{req.id}</td>
                      <td className="py-4 pr-6 font-bold text-black whitespace-nowrap">{req.type}</td>
                      <td className="py-4 pr-6 text-gray-600 whitespace-nowrap">{req.from} – {req.to}</td>
                      <td className="py-4 pr-6 text-black font-black">{req.days}d</td>
                      <td className="py-4 pr-6 text-gray-600 max-w-xs truncate">{req.reason}</td>
                      <td className="py-4">
                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider", statusColor[req.status])}>
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
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Recent Activity */}
          <SectionCard title="Recent Activity">
            <div className="space-y-4">
              {mockRecentActivity.map(act => (
                <div key={act.id} className="flex items-start gap-3">
                  <div className="mt-0.5 p-2 rounded-xl bg-gray-100 text-gray-600">
                    {activityIcon[act.icon]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-black font-medium truncate">{act.action}</p>
                    <p className="text-xs text-neutral-600 mt-0.5">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Quick Access */}
          <SectionCard title="Quick Access">
            <div className="grid grid-cols-2 gap-3">
              <QuickLink icon={<User size={20} />}       label="My Profile"   href="/profile" />
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
