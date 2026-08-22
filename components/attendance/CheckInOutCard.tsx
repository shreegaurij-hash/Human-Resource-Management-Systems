"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Status = 'IDLE' | 'CHECKED_IN' | 'CHECKED_OUT';

export const CheckInOutCard = () => {
  const [status, setStatus] = useState<Status>('IDLE');
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    setLoading(true);
    try {
      const endpoint = status === 'IDLE' ? '/api/attendance/check-in' : '/api/attendance/check-out';
      const res = await fetch(endpoint, { method: 'POST' });
      
      if (res.ok) {
        setStatus(status === 'IDLE' ? 'CHECKED_IN' : 'CHECKED_OUT');
      } else {
        const error = await res.json();
        alert(error.error || 'Something went wrong');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-sm w-full text-white shadow-2xl relative overflow-hidden"
    >
      {/* Decorative gradient for Wink Digital Aesthetic */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />

      <h2 className="text-3xl font-extrabold tracking-tight mb-2">Today's Shift</h2>
      <p className="text-zinc-400 mb-8 font-medium">
        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </p>

      <div className="flex justify-center mb-6">
        <AnimatePresence mode="wait">
          {status === 'IDLE' && (
            <motion.div
              key="idle"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="text-center"
            >
              <div className="w-32 h-32 rounded-full border-4 border-zinc-800 flex items-center justify-center mb-4">
                <span className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Ready</span>
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
              <div className="w-32 h-32 rounded-full border-4 border-green-500 flex items-center justify-center mb-4 relative">
                <motion.div 
                  className="absolute inset-0 border-4 border-green-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-green-500 text-sm font-bold uppercase tracking-widest">Active</span>
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
              <div className="w-32 h-32 rounded-full border-4 border-zinc-700 flex items-center justify-center mb-4 bg-zinc-800/50">
                <span className="text-zinc-400 text-sm font-bold uppercase tracking-widest">Done</span>
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
        className={`w-full py-4 rounded-xl font-bold text-lg uppercase tracking-wide transition-colors ${
          status === 'IDLE' 
            ? 'bg-white text-black hover:bg-zinc-200' 
            : status === 'CHECKED_IN'
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
        }`}
      >
        {loading ? 'Processing...' : status === 'IDLE' ? 'Check In' : status === 'CHECKED_IN' ? 'Check Out' : 'Shift Complete'}
      </motion.button>
    </motion.div>
  );
};
