"use client";

import { Clock, Calendar, CheckCircle2, FileText } from "lucide-react";
import { QuickAccessCard } from "./QuickAccessCard";
import { motion } from "framer-motion";

export function EmployeeDashboard() {
  // Mock data to ensure we don't block on other teams
  const stats = [
    {
      title: "Weekly Hours",
      value: "32.5h",
      icon: Clock,
      trend: { value: 5, isPositive: true },
      description: "On track for 40h",
    },
    {
      title: "PTO Balance",
      value: "14 Days",
      icon: Calendar,
      description: "Available to use",
    },
    {
      title: "Next Holiday",
      value: "Sep 2",
      icon: CheckCircle2,
      description: "Labor Day",
    },
    {
      title: "Latest Payslip",
      value: "Aug 15",
      icon: FileText,
      description: "Available to view",
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
            Welcome Back
          </h1>
          <p className="text-lg font-medium text-neutral-500">
            Here's what's happening with your schedule and benefits.
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
            <QuickAccessCard 
              {...stat} 
              // Different style for Employee cards to differentiate slightly from Admin
              className="bg-neutral-900 border-neutral-800 text-white hover:bg-black"
            />
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 rounded-3xl bg-neutral-100 dark:bg-neutral-900 p-8 min-h-[400px] flex flex-col justify-center items-center">
          <h3 className="text-xl font-bold mb-4 text-black dark:text-white">Time Off & Attendance</h3>
          <p className="text-neutral-500 font-medium mb-6">Manage your leaves and view attendance records.</p>
          <a href="/leave" className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold hover:scale-105 transition-transform">
            Go to Leave Management
          </a>
        </div>
        <div className="rounded-3xl bg-neutral-100 dark:bg-neutral-900 p-8 min-h-[400px] flex flex-col justify-center items-center">
          <h3 className="text-xl font-bold mb-4 text-black dark:text-white">My Profile</h3>
          <p className="text-neutral-500 font-medium mb-6">View and edit your details.</p>
          <a href="/profile" className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold hover:scale-105 transition-transform">
            View Profile
          </a>
        </div>
      </div>
    </div>
  );
}
