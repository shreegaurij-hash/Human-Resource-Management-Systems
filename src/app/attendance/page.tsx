import React from 'react';
import Link from 'next/link';
import { CheckInOutCard } from '../../components/Attendance/CheckInOutCard';
import { WeeklyHistoryView } from '../../components/Attendance/WeeklyHistoryView';

export default function AttendancePage() {
  return (
    <div className="min-h-screen bg-black text-black p-8 md:p-12 font-sans selection:bg-pink-500 selection:text-black">
      {/* Top Navigation */}
      <nav className="max-w-7xl mx-auto flex items-center justify-between mb-12">
        <Link href="/" className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">
          DAYFLOW.
        </Link>
        <div className="flex items-center gap-6 text-sm font-semibold text-zinc-400">
          <Link href="/attendance" className="text-black border-b border-pink-500 pb-0.5">Attendance</Link>
          <Link href="/leave" className="hover:text-black transition-colors">Leave</Link>
        </div>
      </nav>

      <header className="mb-12 max-w-7xl mx-auto">
        <h1 className="text-5xl font-black tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-br from-white to-zinc-500">
          Attendance
        </h1>
        <p className="text-zinc-400 font-medium text-lg">Manage your daily logs and view your history.</p>
      </header>

      <main className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-start">
        <div className="w-full lg:w-1/3">
          <CheckInOutCard />
        </div>
        <div className="w-full lg:w-2/3">
          <WeeklyHistoryView />
        </div>
      </main>
    </div>
  );
}
