import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HomePageProps {
  onLogin: (role: 'Admin' | 'Employee') => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onLogin }) => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-8 absolute w-full z-10">
        <div className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">
          DAYFLOW.
        </div>
        <button 
          onClick={() => setShowLogin(true)}
          className="px-6 py-2 rounded-full border border-zinc-700 hover:border-pink-500 transition-colors font-semibold"
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center min-h-screen text-center px-4 relative z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-pink-600/20 to-yellow-600/20 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-7xl md:text-9xl font-black tracking-tighter mb-6 leading-none"
        >
          WORK,<br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">SIMPLIFIED.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-xl md:text-2xl text-zinc-400 max-w-2xl mb-12 font-medium"
        >
          The all-in-one Human Resource Management System. From attendance tracking to automated payroll and seamless leave management.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex gap-4"
        >
          <button 
            onClick={() => setShowLogin(true)}
            className="px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-transform"
          >
            Get Started
          </button>
          <button className="px-8 py-4 rounded-full bg-zinc-900 border border-zinc-800 text-white font-bold text-lg hover:bg-zinc-800 transition-colors">
            Book Demo
          </button>
        </motion.div>
      </main>

      {/* Login Modal Overlay */}
      <AnimatePresence>
        {showLogin && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl w-full max-w-md relative overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-pink-500/20 blur-[50px] rounded-full" />
              
              <button 
                onClick={() => setShowLogin(false)}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white"
              >
                ✕
              </button>

              <h2 className="text-3xl font-black mb-2">Welcome Back</h2>
              <p className="text-zinc-400 mb-8 font-medium">Select your portal to continue.</p>

              <div className="space-y-4">
                <button 
                  onClick={() => onLogin('Employee')}
                  className="w-full p-4 rounded-xl border border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 hover:border-pink-500 transition-all text-left group flex justify-between items-center"
                >
                  <div>
                    <div className="font-bold text-lg text-white group-hover:text-pink-500 transition-colors">Employee Portal</div>
                    <div className="text-sm text-zinc-500">Access leave, attendance, and profile</div>
                  </div>
                  <div className="text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity">→</div>
                </button>
                
                <button 
                  onClick={() => onLogin('Admin')}
                  className="w-full p-4 rounded-xl border border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 hover:yellow-500 transition-all text-left group flex justify-between items-center hover:border-yellow-500"
                >
                  <div>
                    <div className="font-bold text-lg text-white group-hover:text-yellow-500 transition-colors">Admin / HR Portal</div>
                    <div className="text-sm text-zinc-500">Manage payroll and approvals</div>
                  </div>
                  <div className="text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity">→</div>
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
