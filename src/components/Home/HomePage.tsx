import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

interface HomePageProps {
  onLogin?: (role: 'Admin' | 'Employee') => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onLogin }) => {
  const [showLogin, setShowLogin] = useState(false);
  
  // Fluid bubble tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Spring config for smooth follow
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Offset by half the bubble size to center it on cursor
      mouseX.set(e.clientX - 250);
      mouseY.set(e.clientY - 250);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="pt-8 relative">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 absolute w-full z-50">
        <a href="/" className="text-3xl font-extrabold tracking-tighter text-black flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-full grid place-items-center">
             <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
          dayflow
        </a>
        <div className="hidden md:flex items-center gap-8 font-medium">
          <button className="hover:opacity-60 transition-opacity">Solutions ˅</button>
          <button className="hover:opacity-60 transition-opacity">Work</button>
          <button className="hover:opacity-60 transition-opacity">About us</button>
          <button 
            onClick={() => setShowLogin(true)}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold shadow-lg"
          >
            Get started
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 pt-40 px-8 max-w-7xl mx-auto min-h-screen flex flex-col">
        {/* Hero Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-7xl md:text-[7rem] font-bold tracking-tighter leading-[0.9] mb-32 uppercase max-w-4xl"
          style={{ fontFamily: 'monospace' }}
        >
          There is more<br />than meets the eye
        </motion.h1>

        {/* Lower Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-auto pb-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-end max-w-md"
          >
            <p className="text-2xl font-bold mb-8 leading-snug">
              Everything on the internet revolves around intelligence, efficiency, and optimization. And aesthetics matter too.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed border-b border-black pb-1 inline-block w-fit">
              At Dayflow, we design <span className="font-bold underline">HR solutions</span> and <span className="font-bold underline">smart software</span> based on this conviction.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative h-96 w-full hidden md:block"
          >
            {/* Mocked Cards imitating the image */}
            <div className="absolute top-10 left-0 w-48 h-64 bg-green-200 rounded-xl shadow-2xl p-4 transform -rotate-6 transition-transform hover:rotate-0 hover:z-30 z-10">
              <div className="font-bold text-green-900 mb-2">Leave Tracker</div>
              <div className="text-xs text-green-800">Optimize time off dynamically.</div>
            </div>
            <div className="absolute top-0 left-40 w-56 h-80 bg-zinc-800 text-black rounded-xl shadow-2xl p-4 transition-transform hover:-translate-y-4 hover:z-30 z-20">
              <div className="font-bold mb-2">Attendance</div>
              <div className="text-xs text-zinc-400">Scan and log directly.</div>
            </div>
            <div className="absolute top-20 right-0 w-48 h-64 bg-blue-100 rounded-xl shadow-2xl p-4 transform rotate-6 transition-transform hover:rotate-0 hover:z-30 z-10">
              <div className="font-bold text-blue-900 mb-2">Payroll AI</div>
              <div className="text-xs text-blue-800">Smart salary computations.</div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Showcase Section */}
      <section className="relative z-10 py-32 bg-white">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Column 1: For Employees */}
          <div>
            <h2 className="text-4xl font-semibold mb-4 text-center">For Employees</h2>
            <p className="text-gray-600 text-center mb-12 max-w-md mx-auto">
              Empower your workforce with intuitive tools to seamlessly manage their time, attendance, and profile. No hassle, no fuss.
            </p>
            <div className="space-y-4">
              {/* Item 1 */}
              <div className="flex items-center bg-[#F4F4F4] group cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="w-16 h-16 bg-[#FCEF3B] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <div className="px-6 flex-1 text-lg text-black">Profile & Settings</div>
                <div className="px-6 text-gray-400 group-hover:text-black transition-colors">→</div>
              </div>
              {/* Item 2 */}
              <div className="flex items-center bg-[#F4F4F4] group cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="w-16 h-16 bg-[#FCEF3B] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <div className="px-6 flex-1 text-lg text-black">Time Off Requests</div>
                <div className="px-6 text-gray-400 group-hover:text-black transition-colors">→</div>
              </div>
              {/* Item 3 */}
              <div className="flex items-center bg-[#F4F4F4] group cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="w-16 h-16 bg-[#FCEF3B] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className="px-6 flex-1 text-lg text-black">Attendance Logs</div>
                <div className="px-6 text-gray-400 group-hover:text-black transition-colors">→</div>
              </div>
            </div>
          </div>

          {/* Column 2: For Admins */}
          <div>
            <h2 className="text-4xl font-semibold mb-4 text-center">For Admins & HR</h2>
            <p className="text-gray-600 text-center mb-12 max-w-md mx-auto">
              What do we strive for? Setting up smart systems that help HR teams move forward and pay for themselves immediately.
            </p>
            <div className="space-y-4">
              {/* Item 1 */}
              <div className="flex items-center bg-[#F4F4F4] group cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="w-16 h-16 bg-[#FCEF3B] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                </div>
                <div className="px-6 flex-1 text-lg text-black">Payroll Generation</div>
                <div className="px-6 text-gray-400 group-hover:text-black transition-colors">→</div>
              </div>
              {/* Item 2 */}
              <div className="flex items-center bg-[#F4F4F4] group cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="w-16 h-16 bg-[#FCEF3B] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className="px-6 flex-1 text-lg text-black">Approve Requests</div>
                <div className="px-6 text-gray-400 group-hover:text-black transition-colors">→</div>
              </div>
              {/* Item 3 */}
              <div className="flex items-center bg-[#F4F4F4] group cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="w-16 h-16 bg-[#FCEF3B] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                </div>
                <div className="px-6 flex-1 text-lg text-black">Admin Dashboards</div>
                <div className="px-6 text-gray-400 group-hover:text-black transition-colors">→</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Login Modal Overlay */}
      <AnimatePresence>
        {showLogin && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white border border-gray-200 p-8 rounded-3xl w-full max-w-md relative overflow-hidden shadow-2xl"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-300/40 blur-[40px] rounded-full" />
              
              <button 
                onClick={() => setShowLogin(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-black font-bold"
              >
                ✕
              </button>

              <h2 className="text-3xl font-black mb-2 tracking-tight">Welcome Back</h2>
              <p className="text-gray-500 mb-8 font-medium">Select your portal to continue.</p>

              <div className="space-y-4">
                <button 
                  onClick={() => onLogin?.('Employee')}
                  className="w-full p-5 rounded-xl border-2 border-gray-100 bg-gray-50 hover:bg-white hover:border-black transition-all text-left group flex justify-between items-center shadow-sm hover:shadow-md"
                >
                  <div>
                    <div className="font-bold text-lg text-black">Employee Portal</div>
                    <div className="text-sm text-gray-500 mt-1">Access leave, attendance, and profile</div>
                  </div>
                  <div className="text-black opacity-0 group-hover:opacity-100 transition-opacity font-bold">→</div>
                </button>
                
                <button 
                  onClick={() => onLogin?.('Admin')}
                  className="w-full p-5 rounded-xl border-2 border-gray-100 bg-gray-50 hover:bg-white hover:border-black transition-all text-left group flex justify-between items-center shadow-sm hover:shadow-md"
                >
                  <div>
                    <div className="font-bold text-lg text-black">Admin / HR Portal</div>
                    <div className="text-sm text-gray-500 mt-1">Manage payroll and approvals</div>
                  </div>
                  <div className="text-black opacity-0 group-hover:opacity-100 transition-opacity font-bold">→</div>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
