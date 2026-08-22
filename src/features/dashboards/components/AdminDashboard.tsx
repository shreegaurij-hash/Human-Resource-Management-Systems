"use client";

import { Users, Clock, CalendarDays, Wallet } from "lucide-react";
import { QuickAccessCard } from "./QuickAccessCard";
import { motion } from "framer-motion";

export function AdminDashboard() {
  // Mock data to ensure we don't block on other teams (Karan, Rishik, Ninaad)
  const stats = [
    {
      title: "Total Headcount",
      value: "2,451",
      icon: Users,
      trend: { value: 12, isPositive: true },
      description: "vs last month",
    },
    {
      title: "Today's Attendance",
      value: "92%",
      icon: Clock,
      trend: { value: 2.1, isPositive: true },
      description: "vs average",
      // Karan's domain
    },
    {
      title: "Pending Leaves",
      value: "43",
      icon: CalendarDays,
      // Rishik's / Ninaad's domain
      description: "Requires approval",
    },
    {
      title: "Payroll Cycle",
      value: "4 Days",
      icon: Wallet,
      // Ninaad's domain
      description: "Until next payout",
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col gap-8 p-8 w-full max-w-7xl mx-auto">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-black dark:text-white mb-2">
            Admin Portal
          </h1>
          <p className="text-lg font-medium text-neutral-500">
            Overview of company operations and pending actions.
          </p>
        </div>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, i) => (
          <motion.div key={i} variants={item}>
            <QuickAccessCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      {/* Placeholder for complex tables that integrate with other teams */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-3xl bg-neutral-100 dark:bg-neutral-900 p-8 min-h-[400px]">
          <h3 className="text-xl font-bold mb-4 text-black dark:text-white">Recent Leave Requests</h3>
          <p className="text-neutral-500 font-medium">Integration pending (Rishik & Ninaad)</p>
        </div>
        <div className="rounded-3xl bg-neutral-100 dark:bg-neutral-900 p-8 min-h-[400px]">
          <h3 className="text-xl font-bold mb-4 text-black dark:text-white">Attendance Alerts</h3>
          <p className="text-neutral-500 font-medium">Integration pending (Karan)</p>
        </div>
      </div>
    </div>
  );
}
