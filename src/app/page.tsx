'use client';

import React, { useState } from 'react';
import { HomePage } from '@/components/Home/HomePage';
import { LeaveManagement } from '@/components/Leave/LeaveManagement';
import { EmployeePayrollView } from '@/components/Payroll/EmployeePayrollView';
import { AdminPortal } from '@/components/Admin/AdminPortal';

type EmployeeTab = 'Leave' | 'Payroll';

export default function Page() {
  const [userRole, setUserRole] = useState<'Guest' | 'Employee' | 'Admin'>('Guest');
  const [employeeTab, setEmployeeTab] = useState<EmployeeTab>('Leave');

  const handleLogin = (role: 'Admin' | 'Employee', initialTab?: EmployeeTab) => {
    if (role === 'Employee' && initialTab) {
      setEmployeeTab(initialTab);
    }
    setUserRole(role);
  };

  if (userRole === 'Admin') {
    return <AdminPortal onBackToHome={() => setUserRole('Guest')} />;
  }

  if (userRole === 'Employee') {
    return (
      <div className="min-h-screen bg-black text-white font-sans">
        {/* Top Header Navigation for Employee Portal */}
        <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur sticky top-0 z-40 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-emerald-400 to-teal-400">
              DAYFLOW.
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Role: Employee Portal
            </span>
          </div>

          <div className="flex bg-zinc-900 border border-zinc-800 rounded-full p-1">
            <button
              onClick={() => setEmployeeTab('Leave')}
              className={`px-5 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all ${
                employeeTab === 'Leave'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              🌴 Time Off / Leave
            </button>
            <button
              onClick={() => setEmployeeTab('Payroll')}
              className={`px-5 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all ${
                employeeTab === 'Payroll'
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              💼 My Compensation
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setUserRole('Admin')}
              className="text-xs font-bold text-yellow-400 hover:text-yellow-300 border border-yellow-500/30 bg-yellow-500/10 px-3.5 py-2 rounded-full transition-all"
            >
              ⚡ Switch to Admin Portal
            </button>
            <button
              onClick={() => setUserRole('Guest')}
              className="text-xs font-bold text-zinc-400 hover:text-white border border-zinc-800 px-3.5 py-2 rounded-full transition-all"
            >
              Sign Out
            </button>
          </div>
        </header>

        <main>
          {employeeTab === 'Leave' && <LeaveManagement />}
          {employeeTab === 'Payroll' && <EmployeePayrollView employeeId="emp-1" />}
        </main>
      </div>
    );
  }

  return (
    <HomePage
      onLogin={handleLogin}
    />
  );
}
