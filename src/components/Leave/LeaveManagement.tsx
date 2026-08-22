"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { leaveService } from '../../services/leaveService';
import { LeaveBalance, LeaveRequest, LeaveType } from '../../types/leave';
import { useCurrentUser } from '../../hooks/useCurrentUser';

export const LeaveManagement: React.FC = () => {
  const { user } = useCurrentUser();
  const employeeId = user?.id || 'emp-1';
  
  const [balance, setBalance] = useState<LeaveBalance | null>(null);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  
  // Form State
  const [leaveType, setLeaveType] = useState<LeaveType>('Paid');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setBalance(leaveService.getLeaveBalance(employeeId));
    setRequests(leaveService.getLeaveRequests(employeeId));
  }, [employeeId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      leaveService.applyForLeave(employeeId, leaveType, startDate, endDate, reason);
      setRequests(leaveService.getLeaveRequests(employeeId));
      setSuccess('Leave request submitted successfully.');
      setStartDate('');
      setEndDate('');
      setReason('');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900 pb-20">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm mb-10">
        <Link href="/" className="text-xl font-black tracking-tighter hover:opacity-70 transition-opacity">
          blond
        </Link>
        <div className="flex items-center gap-6 text-sm font-semibold text-gray-500">
          <Link href="/attendance" className="hover:text-gray-900 transition-colors">Attendance</Link>
          <Link href="/leave" className="text-gray-900 border-b-2 border-blue-600 pb-0.5">Leave</Link>
          <Link href="/payroll" className="hover:text-gray-900 transition-colors">Salary</Link>
          <Link href="/profile" className="hover:text-gray-900 transition-colors">Profile</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Time Off</h1>
          <p className="text-gray-500 text-sm">Manage your leaves and absences.</p>
        </motion.div>

        {balance && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <BalanceCard title="Paid Leaves" value={balance.paidLeave} color="bg-white border-gray-200" text="text-blue-600" />
            <BalanceCard title="Sick Leaves" value={balance.sickLeave} color="bg-white border-gray-200" text="text-amber-500" />
            <BalanceCard title="Unpaid Leaves" value={balance.unpaidLeave} color="bg-white border-gray-200" text="text-gray-500" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-6 text-gray-900 border-b border-gray-100 pb-4">Request Leave</h2>
            {error && <div className="bg-rose-50 text-rose-700 p-4 rounded-lg mb-4 text-sm font-medium">{error}</div>}
            {success && <div className="bg-emerald-50 text-emerald-700 p-4 rounded-lg mb-4 text-sm font-medium">{success}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="leaveType" className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Leave Type</label>
                <select
                  id="leaveType"
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-sm"
                >
                  <option value="Paid">Paid Leave</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Unpaid">Unpaid Leave</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Start Date</label>
                  <input
                    id="startDate"
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">End Date</label>
                  <input
                    id="endDate"
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reason" className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Reason</label>
                <textarea
                  id="reason"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-sm resize-none"
                  placeholder="Why do you need this leave?"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gray-900 text-white font-semibold text-sm py-3.5 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
              >
                Submit Request
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-xl font-semibold mb-6 text-gray-900 border-b border-gray-100 pb-4">Recent Requests</h2>
            <div className="space-y-4">
              {requests.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No leave requests found.</p>
              ) : (
                requests.map((req) => (
                  <div key={req.id} className="bg-white p-5 rounded-xl border border-gray-200 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{req.leaveType}</div>
                      <div className="text-xs text-gray-500 mt-1">{req.startDate} to {req.endDate}</div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider
                      ${req.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 
                        req.status === 'Rejected' ? 'bg-rose-50 text-rose-700' : 
                        'bg-amber-50 text-amber-700'}`}
                    >
                      {req.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const BalanceCard = ({ title, value, color, text }: { title: string, value: number, color: string, text: string }) => (
  <motion.div 
    whileHover={{ y: -2 }}
    className={`${color} border rounded-2xl p-6 relative overflow-hidden shadow-sm transition-transform`}
  >
    <div className="relative z-10">
      <div className="text-gray-500 font-semibold mb-2 uppercase tracking-wider text-[10px]">{title}</div>
      <div className={`text-4xl font-bold tracking-tight ${text}`}>{value}</div>
    </div>
  </motion.div>
);
