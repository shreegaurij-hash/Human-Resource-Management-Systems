import React from 'react';
import { CheckInOutCard } from '../../components/Attendance/CheckInOutCard';
import { WeeklyHistoryView } from '../../components/Attendance/WeeklyHistoryView';

export default function AttendancePage() {
  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-12 font-sans selection:bg-pink-500 selection:text-white">
      <header className="mb-12 max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-br from-white to-zinc-500">
            Attendance
          </h1>
          <p className="text-zinc-400 font-medium text-lg">Manage your daily logs and view your history.</p>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center font-bold">
            EMP
          </div>
        </div>
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
