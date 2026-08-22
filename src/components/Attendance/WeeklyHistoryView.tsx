"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { attendanceService } from '../../services/attendanceService';
import { AttendanceRecord } from '../../types/attendance';

export const WeeklyHistoryView = () => {
  const employeeId = 'emp-1';
  const [history, setHistory] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    // Poll the service every 2 seconds to simulate reactivity if the CheckInOutCard updates it
    const interval = setInterval(() => {
      setHistory(attendanceService.getHistory(employeeId));
    }, 2000);
    
    setHistory(attendanceService.getHistory(employeeId));
    
    return () => clearInterval(interval);
  }, []);

  const formatTime = (isoString: string | null) => {
    if (!isoString) return '--:--';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PRESENT': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'LATE': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'ABSENT': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'HALF_DAY': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      default: return 'text-zinc-400 bg-zinc-800 border-zinc-700';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-4xl w-full text-white shadow-2xl"
    >
      <h3 className="text-2xl font-bold mb-6 tracking-tight">Recent Activity</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-wider text-xs">
              <th className="pb-4 font-semibold">Date</th>
              <th className="pb-4 font-semibold">Check In</th>
              <th className="pb-4 font-semibold">Check Out</th>
              <th className="pb-4 font-semibold">Status</th>
              <th className="pb-4 font-semibold text-right">Hours</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-zinc-500">No recent records found.</td>
              </tr>
            ) : (
              history.map((record, i) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={record.id} 
                  className="border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="py-4 font-medium">
                    {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="py-4 text-zinc-400">{formatTime(record.checkInTime)}</td>
                  <td className="py-4 text-zinc-400">{formatTime(record.checkOutTime)}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="py-4 text-right font-mono text-zinc-300">
                    {record.workHours ? `${record.workHours}h` : '-'}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
