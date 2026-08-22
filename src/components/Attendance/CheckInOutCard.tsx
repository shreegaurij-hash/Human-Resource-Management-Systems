"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { attendanceService } from '../../services/attendanceService';
import { useCurrentUser } from '../../hooks/useCurrentUser';

type Status = 'IDLE' | 'CHECKED_IN' | 'CHECKED_OUT';

export const CheckInOutCard = () => {
  const { user } = useCurrentUser();
  const employeeId = user?.id || 'emp-1';
  
  const [status, setStatus] = useState<Status>('IDLE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const today = attendanceService.getTodayRecord(employeeId);
    if (today) {
      if (today.checkOutTime) {
        setStatus('CHECKED_OUT');
      } else {
        setStatus('CHECKED_IN');
      }
    }
  }, [employeeId]);

  const handleAction = () => {
    setLoading(true);
    setError('');
    try {
      if (status === 'IDLE') {
        attendanceService.checkIn(employeeId);
        setStatus('CHECKED_IN');
      } else if (status === 'CHECKED_IN') {
        attendanceService.checkOut(employeeId);
        setStatus('CHECKED_OUT');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-2xl p-8 w-full shadow-sm relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500" />

      <h2 className="text-xl font-bold tracking-tight mb-1 text-gray-900">Today's Shift</h2>
      <p className="text-gray-500 mb-8 font-medium text-sm">
        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </p>

      {error && <div className="bg-rose-50 text-rose-700 p-3 rounded-lg mb-4 text-xs font-semibold">{error}</div>}

      <div className="flex justify-center mb-8">
        <AnimatePresence mode="wait">
          {status === 'IDLE' && (
            <motion.div
              key="idle"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="text-center"
            >
              <div className="w-28 h-28 rounded-full border-4 border-gray-100 flex items-center justify-center mb-4 bg-gray-50">
                <span className="text-gray-600 text-[10px] font-bold uppercase tracking-wider">Ready</span>
              </div>
            </motion.div>
          )}
          {status === 'CHECKED_IN' && (
            <motion.div
              key="checked_in"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="text-center"
            >
              <div className="w-28 h-28 rounded-full border-4 border-emerald-400 flex items-center justify-center mb-4 relative bg-emerald-50">
                <motion.div 
                  className="absolute inset-0 border-2 border-emerald-300 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-emerald-700 text-[10px] font-bold uppercase tracking-wider">Active</span>
              </div>
            </motion.div>
          )}
          {status === 'CHECKED_OUT' && (
            <motion.div
              key="checked_out"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="text-center"
            >
              <div className="w-28 h-28 rounded-full border-4 border-gray-100 flex items-center justify-center mb-4 bg-gray-50">
                <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Done</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        whileHover={{ scale: status !== 'CHECKED_OUT' ? 1.02 : 1 }}
        whileTap={{ scale: status !== 'CHECKED_OUT' ? 0.98 : 1 }}
        disabled={loading || status === 'CHECKED_OUT'}
        onClick={handleAction}
        className={`w-full py-3.5 rounded-lg font-semibold text-sm transition-shadow shadow-sm ${
          status === 'IDLE' 
            ? 'bg-blue-600 text-white hover:bg-blue-700' 
            : status === 'CHECKED_IN'
              ? 'bg-white border border-gray-200 text-gray-900 hover:bg-gray-50'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
        }`}
      >
        {loading ? 'Processing...' : status === 'IDLE' ? 'Check In' : status === 'CHECKED_IN' ? 'Check Out' : 'Shift Complete'}
      </motion.button>
    </motion.div>
  );
};
