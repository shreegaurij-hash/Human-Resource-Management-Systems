"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Clock, Calendar, Search, Bell,
  CheckCircle2, XCircle, AlertCircle, TrendingUp,
  ChevronRight, Wallet, UserCheck, UserX, FileText,
  Check, X, Filter
} from "lucide-react";
import {
  mockAdminStats,
  mockEmployeeList,
  mockPendingLeaves,
  mockAdminActivity,
  mockAdminNotifications,
} from "../mockData";
import { OnboardingChecklist } from "./OnboardingChecklist";

// ── helpers ─────────────────────────────────────────────────────────────────
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const empStatusColor: Record<string, string> = {
  Present:  "bg-emerald-500/15 text-emerald-400",
  Absent:   "bg-rose-500/15 text-rose-400",
  "On Leave": "bg-amber-500/15 text-amber-400",
};

const notifColor: Record<string, string> = {
  warning: "border-l-amber-400",
  info:    "border-l-blue-400",
  error:   "border-l-rose-400",
};

const activityIconMap: Record<string, React.ReactElement> = {
  check:  <Check size={14} />,
  user:   <Users size={14} />,
  file:   <FileText size={14} />,
  x:      <X size={14} />,
  wallet: <Wallet size={14} />,
};

// ── sub-components ──────────────────────────────────────────────────────────

function Avatar({ initials }: { initials: string }) {
  return (
    <div className="h-9 w-9 rounded-full bg-neutral-700 flex items-center justify-center text-xs font-black text-white flex-shrink-0">
      {initials}
    </div>
  );
}

function StatCard({
  label, value, sub, icon: Icon, trend, color,
}: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; trend?: { value: number; isPositive: boolean }; color: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -3 }}
      className="rounded-2xl bg-neutral-900 border border-neutral-800 p-6 group cursor-default relative overflow-hidden"
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-bold tracking-widest text-neutral-400 uppercase">{label}</p>
        <div className={cn("p-2.5 rounded-xl transition-transform group-hover:rotate-12", color)}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <p className="text-4xl font-black text-white">{value}</p>
      {sub && <p className="text-xs text-neutral-500 font-medium mt-1">{sub}</p>}
      {trend && (
        <span className={cn(
          "mt-3 inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full",
          trend.isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
        )}>
          <TrendingUp size={11} /> {trend.isPositive ? "+" : "-"}{trend.value}%
        </span>
      )}
      <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-white opacity-[0.02] blur-2xl" />
    </motion.div>
  );
}

function SectionCard({ title, action, children, className }: {
  title: string; action?: React.ReactNode; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={cn("rounded-2xl bg-neutral-900 border border-neutral-800 p-6", className)}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-bold tracking-widest text-neutral-400 uppercase">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function QuickLink({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-neutral-800 hover:bg-neutral-700 transition-colors"
    >
      <div className="p-3 rounded-xl bg-neutral-700 text-white">{icon}</div>
      <span className="text-xs font-bold text-neutral-300 text-center">{label}</span>
    </motion.a>
  );
}

// ── main component ──────────────────────────────────────────────────────────

export function AdminDashboard() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Present" | "Absent" | "On Leave">("All");
  const [showNotifs, setShowNotifs] = useState(false);
  const [leaveActions, setLeaveActions] = useState<Record<string, "Approved" | "Rejected" | null>>(
    () => Object.fromEntries(mockPendingLeaves.map(l => [l.id, null]))
  );

  const filteredEmployees = useMemo(() => {
    return mockEmployeeList.filter(emp => {
      const matchSearch =
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.id.toLowerCase().includes(search.toLowerCase()) ||
        emp.department.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "All" || emp.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [search, filterStatus]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  const handleLeaveAction = (id: string, action: "Approved" | "Rejected") => {
    setLeaveActions(prev => ({ ...prev, [id]: action }));
  };

  const pendingCount = Object.values(leaveActions).filter(v => v === null).length;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-30 bg-black/80 backdrop-blur border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-white">Admin / HR Dashboard</h2>
          <p className="text-xs text-neutral-500 font-medium">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <button
          onClick={() => setShowNotifs(!showNotifs)}
          className="relative p-2 rounded-full bg-neutral-900 hover:bg-neutral-800 transition-colors"
        >
          <Bell size={18} />
          {mockAdminNotifications.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center font-black">
              {mockAdminNotifications.length}
            </span>
          )}
        </button>
      </header>

      {/* ── Notification Dropdown ── */}
      <AnimatePresence>
        {showNotifs && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-16 right-6 z-40 w-80 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-4 space-y-3"
          >
            <p className="text-xs font-bold tracking-widest text-neutral-400 uppercase mb-3">Notifications</p>
            {mockAdminNotifications.map(n => (
              <div key={n.id} className={cn("border-l-2 pl-3 py-1", notifColor[n.type] ?? "border-l-neutral-600")}>
                <p className="text-sm text-white font-medium">{n.message}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{n.time}</p>
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
        {/* ── Header ── */}
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter">Admin Portal</h1>
          <p className="text-neutral-500 font-medium mt-1">Overview of company operations and pending actions.</p>
        </motion.div>

        {/* ── Row 1: KPI Cards ── */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard label="Total Employees" value={mockAdminStats.totalEmployees} sub="Company headcount" icon={Users} color="bg-blue-600" trend={{ value: 4, isPositive: true }} />
          <StatCard label="Present Today"   value={mockAdminStats.present}          sub="Active right now"  icon={UserCheck} color="bg-emerald-600" trend={{ value: 2, isPositive: true }} />
          <StatCard label="Absent Today"    value={mockAdminStats.absent}           sub="Not checked in"   icon={UserX}    color="bg-rose-600" trend={{ value: 1, isPositive: false }} />
          <StatCard label="On Leave"        value={mockAdminStats.onLeave}          sub="Approved leaves"  icon={Calendar} color="bg-amber-600" />
        </motion.div>

        {/* ── Row 2: Attendance Overview visual ── */}
        <motion.div variants={itemVariants}>
          <SectionCard title="Overall Attendance Summary">
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              {/* Donut-like bar breakdown */}
              <div className="flex-1 w-full">
                <div className="flex rounded-full overflow-hidden h-5 gap-0.5">
                  <div
                    className="bg-emerald-500 transition-all"
                    style={{ width: `${(mockAdminStats.present / mockAdminStats.totalEmployees) * 100}%` }}
                    title={`Present: ${mockAdminStats.present}`}
                  />
                  <div
                    className="bg-rose-500 transition-all"
                    style={{ width: `${(mockAdminStats.absent / mockAdminStats.totalEmployees) * 100}%` }}
                    title={`Absent: ${mockAdminStats.absent}`}
                  />
                  <div
                    className="bg-amber-500 transition-all"
                    style={{ width: `${(mockAdminStats.onLeave / mockAdminStats.totalEmployees) * 100}%` }}
                    title={`On Leave: ${mockAdminStats.onLeave}`}
                  />
                </div>
                <div className="flex gap-6 mt-4 flex-wrap">
                  {[
                    { label: "Present",  count: mockAdminStats.present,  color: "bg-emerald-500" },
                    { label: "Absent",   count: mockAdminStats.absent,   color: "bg-rose-500" },
                    { label: "On Leave", count: mockAdminStats.onLeave,  color: "bg-amber-500" },
                  ].map(({ label, count, color }) => (
                    <div key={label} className="flex items-center gap-2 text-sm">
                      <span className={cn("h-2.5 w-2.5 rounded-full", color)} />
                      <span className="text-neutral-400 font-medium">{label}</span>
                      <span className="text-white font-black">{count}</span>
                      <span className="text-neutral-600">({Math.round((count / mockAdminStats.totalEmployees) * 100)}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>
        </motion.div>

        {/* ── Row 3: Employee List ── */}
        <motion.div variants={itemVariants}>
          <SectionCard
            title="Employee Directory"
            action={
              <a href="/employees" className="text-xs font-bold text-white hover:text-neutral-300 flex items-center gap-1">
                View All <ChevronRight size={12} />
              </a>
            }
          >
            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search by name, ID, department…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-white placeholder-neutral-500 outline-none focus:border-neutral-500 transition-colors"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {(["All", "Present", "Absent", "On Leave"] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={cn(
                      "px-3 py-2 rounded-xl text-xs font-bold transition-colors",
                      filterStatus === s
                        ? "bg-white text-black"
                        : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 text-left">
                    {["Employee", "ID", "Department", "Designation", "Status"].map(h => (
                      <th key={h} className="pb-3 pr-6 text-xs text-neutral-500 font-bold uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/50">
                  <AnimatePresence>
                    {filteredEmployees.map(emp => (
                      <motion.tr
                        key={emp.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-neutral-800/30 transition-colors"
                      >
                        <td className="py-3 pr-6">
                          <div className="flex items-center gap-3">
                            <Avatar initials={emp.avatar} />
                            <span className="font-bold text-white whitespace-nowrap">{emp.name}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-6 text-neutral-400 font-mono text-xs">{emp.id}</td>
                        <td className="py-3 pr-6 text-neutral-300 whitespace-nowrap">{emp.department}</td>
                        <td className="py-3 pr-6 text-neutral-400 whitespace-nowrap">{emp.designation}</td>
                        <td className="py-3">
                          <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold", empStatusColor[emp.status])}>
                            {emp.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {filteredEmployees.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-neutral-500 font-medium">No employees match your search.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </motion.div>

        {/* ── Row 4: Pending Leave Approvals ── */}
        <motion.div variants={itemVariants}>
          <SectionCard
            title={`Pending Leave Requests ${pendingCount > 0 ? `(${pendingCount})` : ""}`}
          >
            <div className="space-y-4">
              {mockPendingLeaves.map(req => {
                const action = leaveActions[req.id];
                return (
                  <div key={req.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-neutral-800/50 border border-neutral-800">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar initials={req.avatar} />
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate">{req.employee}</p>
                        <p className="text-xs text-neutral-500 font-medium">{req.department} • {req.id}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                      <div>
                        <p className="text-xs text-neutral-500 font-medium">Type</p>
                        <p className="text-white font-bold whitespace-nowrap">{req.type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 font-medium">Duration</p>
                        <p className="text-white font-bold whitespace-nowrap">{req.from} – {req.to}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 font-medium">Days</p>
                        <p className="text-white font-black">{req.days}d</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {action === null ? (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleLeaveAction(req.id, "Approved")}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-colors"
                          >
                            <CheckCircle2 size={13} /> Approve
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleLeaveAction(req.id, "Rejected")}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black transition-colors"
                          >
                            <XCircle size={13} /> Reject
                          </motion.button>
                        </>
                      ) : (
                        <span className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-bold",
                          action === "Approved"
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-rose-500/15 text-rose-400"
                        )}>
                          {action}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </motion.div>

        {/* ── Row 5: Onboarding Checklist ── */}
        <motion.div variants={itemVariants}>
          <OnboardingChecklist />
        </motion.div>

        {/* ── Row 6: Activity + Quick Access ── */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Recent HR Activity */}
          <SectionCard title="Recent HR Activity">
            <div className="space-y-4">
              {mockAdminActivity.map(act => (
                <div key={act.id} className="flex items-start gap-3">
                  <div className="mt-0.5 p-2 rounded-xl bg-neutral-800 text-neutral-400 flex-shrink-0">
                    {activityIconMap[act.icon]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{act.action}</p>
                    <p className="text-xs text-neutral-600 mt-0.5">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Quick Access */}
          <SectionCard title="Quick Access">
            <div className="grid grid-cols-2 gap-3">
              <QuickLink icon={<Users size={20} />}     label="Employees"   href="/employees" />
              <QuickLink icon={<Clock size={20} />}     label="Attendance"  href="/attendance" />
              <QuickLink icon={<Calendar size={20} />}  label="Time Off"    href="/leave" />
              <QuickLink icon={<Wallet size={20} />}    label="Payroll"     href="/payroll" />
            </div>
          </SectionCard>
        </motion.div>
      </motion.main>
    </div>
  );
}
