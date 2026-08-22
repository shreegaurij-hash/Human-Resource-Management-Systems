"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { attendanceService } from '../../services/attendanceService';
import { AttendanceRecord } from '../../types/attendance';
import { useCurrentUser } from '../../hooks/useCurrentUser';

export const WeeklyHistoryView = () => {
  const { user } = useCurrentUser();
  const employeeId = user?.id || 'emp-1';
  
  const [history, setHistory] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    // Poll the service every 2 seconds to simulate reactivity if the CheckInOutCard updates it
    const interval = setInterval(() => {
      setHistory(attendanceService.getHistory(employeeId));
    }, 2000);
    
    setHistory(attendanceService.getHistory(employeeId));
    
    return () => clearInterval(interval);
  }, [employeeId]);

  const formatTime = (isoString: string | null) => {
    if (!isoString) return '--:--';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PRESENT': return 'text-emerald-700 bg-emerald-50 border-emerald-100';
      case 'LATE': return 'text-amber-700 bg-amber-50 border-amber-100';
      case 'ABSENT': return 'text-rose-700 bg-rose-50 border-rose-100';
      case 'HALF_DAY': return 'text-orange-700 bg-orange-50 border-orange-100';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white border border-gray-200 rounded-2xl p-8 max-w-4xl w-full shadow-sm"
    >
      <h3 className="text-xl font-semibold mb-6 tracking-tight text-gray-900 border-b border-gray-100 pb-4">Recent Activity</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[10px]">
              <th className="pb-3 font-semibold">Date</th>
              <th className="pb-3 font-semibold">Check In</th>
              <th className="pb-3 font-semibold">Check Out</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold text-right">Hours</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500 text-sm">No recent records found.</td>
              </tr>
            ) : (
              history.map((record, i) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={record.id} 
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-4 font-medium text-gray-900 text-sm">
                    {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="py-4 text-gray-500 text-sm">{formatTime(record.checkInTime)}</td>
                  <td className="py-4 text-gray-500 text-sm">{formatTime(record.checkOutTime)}</td>
                  <td className="py-4">
                    <span className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md border ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="py-4 text-right font-mono text-gray-400 text-sm">
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
