import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { leaveService } from '../../services/leaveService';
import { LeaveBalance, LeaveRequest, LeaveType } from '../../types/leave';

export const LeaveManagement: React.FC = () => {
  const employeeId = 'emp-1'; // Mock logged-in user
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
  }, []);

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
    <div className="min-h-screen bg-[#F8F9FA] text-black font-sans p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-5xl font-black mb-2 text-pink-500 uppercase tracking-widest">Time Off</h1>
        <p className="text-gray-400">Manage your leaves and absences.</p>
      </motion.div>

      {balance && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <BalanceCard title="Paid Leaves" value={balance.paidLeave} color="bg-blue-600" />
          <BalanceCard title="Sick Leaves" value={balance.sickLeave} color="bg-red-500" />
          <BalanceCard title="Unpaid Leaves" value={balance.unpaidLeave} color="bg-gray-700" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white shadow-xl p-8 rounded-2xl border border-gray-200 shadow-2xl"
        >
          <h2 className="text-2xl font-bold mb-6 text-black border-b border-gray-200 pb-4">Request Leave</h2>
          {error && <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-4">{error}</div>}
          {success && <div className="bg-green-500/10 text-green-500 p-4 rounded-lg mb-4">{success}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="leaveType" className="block text-sm font-semibold text-gray-400 mb-2">Leave Type</label>
              <select
                id="leaveType"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                className="w-full bg-gray-100 text-black rounded-lg p-3 outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="Paid">Paid Leave</option>
                <option value="Sick">Sick Leave</option>
                <option value="Unpaid">Unpaid Leave</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-semibold text-gray-400 mb-2">Start Date</label>
                <input
                  id="startDate"
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-gray-100 text-black rounded-lg p-3 outline-none focus:ring-2 focus:ring-pink-500 [color-scheme:dark]"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-semibold text-gray-400 mb-2">End Date</label>
                <input
                  id="endDate"
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-gray-100 text-black rounded-lg p-3 outline-none focus:ring-2 focus:ring-pink-500 [color-scheme:dark]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-semibold text-gray-400 mb-2">Reason</label>
              <textarea
                id="reason"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full bg-gray-100 text-black rounded-lg p-3 outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Why do you need this leave?"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-black font-bold text-lg py-3 rounded-lg hover:scale-[1.02] transition-transform"
            >
              Submit Request
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-black border-b border-gray-200 pb-4">Recent Requests</h2>
          <div className="space-y-4">
            {requests.length === 0 ? (
              <p className="text-gray-500 italic">No leave requests found.</p>
            ) : (
              requests.map((req) => (
                <div key={req.id} className="bg-white shadow-xl p-5 rounded-xl border border-gray-200 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-lg">{req.leaveType}</div>
                    <div className="text-sm text-gray-400">{req.startDate} to {req.endDate}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                    ${req.status === 'Approved' ? 'bg-green-500/20 text-green-500' : 
                      req.status === 'Rejected' ? 'bg-red-500/20 text-red-500' : 
                      'bg-yellow-500/20 text-yellow-500'}`}
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
  );
};

const BalanceCard = ({ title, value, color }: { title: string, value: number, color: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`${color} rounded-2xl p-6 relative overflow-hidden shadow-xl`}
  >
    <div className="relative z-10">
      <div className="text-black/80 font-semibold mb-2 uppercase tracking-wide text-sm">{title}</div>
      <div className="text-5xl font-black text-black">{value}</div>
    </div>
    <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl" />
  </motion.div>
);
