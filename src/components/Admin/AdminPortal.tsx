import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AdminPayrollManagement } from '../Payroll/AdminPayrollManagement';
import { LeaveApproval } from './LeaveApproval';

interface AdminPortalProps {
  onBackToHome?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToHome }) => {
  const [activeTab, setActiveTab] = useState<'LeaveApprovals' | 'PayrollControl'>('LeaveApprovals');

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Top Header Navigation */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-40 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-amber-500 to-yellow-500">
            DAYFLOW ADMIN.
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
            Role: HR / Admin
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-full p-1">
          <button
            onClick={() => setActiveTab('LeaveApprovals')}
            className={`px-5 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all ${
              activeTab === 'LeaveApprovals'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            📋 Leave Approvals
          </button>
          <button
            onClick={() => setActiveTab('PayrollControl')}
            className={`px-5 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all ${
              activeTab === 'PayrollControl'
                ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            💰 Payroll Management
          </button>
        </div>

        {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="text-xs font-bold text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 px-4 py-2 rounded-full transition-all"
          >
            ← Exit Admin Hub
          </button>
        )}
      </header>

      {/* Main Tab Content */}
      <main>
        {activeTab === 'LeaveApprovals' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <LeaveApproval />
          </motion.div>
        )}

        {activeTab === 'PayrollControl' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AdminPayrollManagement />
          </motion.div>
        )}
      </main>
    </div>
  );
};
