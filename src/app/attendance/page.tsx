import React from 'react';
import Link from 'next/link';
import { CheckInOutCard } from '../../components/Attendance/CheckInOutCard';
import { WeeklyHistoryView } from '../../components/Attendance/WeeklyHistoryView';

export default function AttendancePage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900 pb-20">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm mb-10">
        <Link href="/" className="text-xl font-black tracking-tighter hover:opacity-70 transition-opacity">
          blond
        </Link>
        <div className="flex items-center gap-6 text-sm font-semibold text-gray-500">
          <Link href="/attendance" className="text-gray-900 border-b-2 border-blue-600 pb-0.5">Attendance</Link>
          <Link href="/leave" className="hover:text-gray-900 transition-colors">Leave</Link>
          <Link href="/payroll" className="hover:text-gray-900 transition-colors">Salary</Link>
          <Link href="/profile" className="hover:text-gray-900 transition-colors">Profile</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
            Attendance
          </h1>
          <p className="text-gray-500 font-medium text-sm">Manage your daily logs and view your history.</p>
        </header>

        <main className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:w-1/3">
            <CheckInOutCard />
          </div>
          <div className="w-full lg:w-2/3">
            <WeeklyHistoryView />
          </div>
        </main>
      </div>
    </div>
  );
}
