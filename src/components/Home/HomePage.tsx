import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { DatasetUploader } from './DatasetUploader';
import { AboutUsSection } from './AboutUsSection';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface HomePageProps {
  onLogin?: (role: 'Admin' | 'Employee') => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onLogin }) => {
  const [showLogin, setShowLogin] = useState(false);
  
  // Real Auth States
  const [loginRole, setLoginRole] = useState<'Admin' | 'Employee'>('Employee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: loginRole })
      });
      
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || 'Login failed');
      } else {
        // Save user context for the dashboards to read
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        
        // For now, call the parent router hook.
        if (onLogin && loginRole) {
          onLogin(loginRole);
        }
      }
    } catch (err) {
      setLoginError('Network error. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };
  
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
          blond
        </a>
        <div className="hidden md:flex items-center gap-8 font-medium">
          <a href="#solutions" className="hover:opacity-60 transition-opacity cursor-pointer">Solutions ˅</a>
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
          className="text-7xl md:text-[7rem] font-bold tracking-tighter leading-none mb-24 max-w-5xl uppercase flex flex-col"
          style={{ fontFamily: 'monospace' }}
        >
          <div className="pb-2">Connecting</div>
          <div className="font-serif italic font-medium lowercase text-zinc-800 tracking-normal pb-6" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>people.</div>
          <div className="pb-2">Streamlining</div>
          <div className="font-serif italic font-medium lowercase text-zinc-800 tracking-normal" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>work.</div>
        </motion.h1>

        {/* Lower Section */}
        <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-8 mt-auto pb-20 w-full items-end">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-end"
          >
            <p className="text-xl lg:text-2xl font-bold mb-8 leading-snug">
              Everything on the internet revolves around intelligence, efficiency, and optimization. And aesthetics matter too.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed border-b border-black pb-1 inline-block w-fit">
              At Blond, we design <span className="font-bold underline">HR solutions</span> and <span className="font-bold underline">smart software</span> based on this conviction.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative h-96 w-full hidden md:block"
          >
            {/* Mocked Cards imitating the image */}
            <div className="absolute top-10 left-0 w-48 h-64 rounded-xl shadow-2xl p-4 transform -rotate-6 transition-transform hover:rotate-0 hover:z-30 z-10 flex flex-col justify-between" style={{ backgroundImage: 'url(/leave_tracker.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div>
                <div className="font-bold text-black bg-white/70 backdrop-blur-md px-2 py-1 rounded-md inline-block mb-1 shadow-sm">Leave Tracker</div>
                <div className="text-xs text-black font-medium bg-white/70 backdrop-blur-md px-2 py-1 rounded-md inline-block shadow-sm">Optimize time off.</div>
              </div>
            </div>
            
            <div className="absolute top-0 left-40 w-56 h-80 rounded-xl shadow-2xl p-4 transition-transform hover:-translate-y-4 hover:z-30 z-20 flex flex-col justify-between border-2 border-zinc-700" style={{ backgroundImage: 'url(/attendance.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div>
                <div className="font-bold text-white bg-black/60 backdrop-blur-md px-2 py-1 rounded-md inline-block mb-1 shadow-sm border border-zinc-700">Attendance</div>
                <div className="text-xs text-white font-medium bg-black/60 backdrop-blur-md px-2 py-1 rounded-md inline-block shadow-sm border border-zinc-700">Log in efficiently.</div>
              </div>
            </div>
            
            <div className="absolute top-20 right-0 w-48 h-64 rounded-xl shadow-2xl p-4 transform rotate-6 transition-transform hover:rotate-0 hover:z-30 z-10 flex flex-col justify-between" style={{ backgroundImage: 'url(/payroll.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div>
                <div className="font-bold text-black bg-white/70 backdrop-blur-md px-2 py-1 rounded-md inline-block mb-1 shadow-sm">Payroll Management</div>
                <div className="text-xs text-black font-medium bg-white/70 backdrop-blur-md px-2 py-1 rounded-md inline-block shadow-sm">Smart salary computes.</div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Showcase Section */}
      <section id="solutions" className="relative z-10 py-32 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Column 1: For Employees */}
          <div>
            <h2 className="text-4xl font-semibold mb-4 text-center">For Employees</h2>
            <p className="text-gray-600 text-center mb-12 max-w-md mx-auto">
              Empower your workforce with intuitive tools to seamlessly manage their time, attendance, and profile. No hassle, no fuss.
            </p>
            <div className="space-y-4">
              {/* Item 1 */}
              <Link href="/profile" className="flex items-center bg-[#F4F4F4] group cursor-pointer hover:bg-gray-100 transition-colors block">
                <div className="w-16 h-16 bg-[#FCEF3B] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <div className="px-6 flex-1 text-lg text-black">Profile & Settings</div>
                <div className="px-6 text-gray-400 group-hover:text-black transition-colors">→</div>
              </Link>
              {/* Item 2 */}
              <Link href="/profile" className="flex items-center bg-[#F4F4F4] group cursor-pointer hover:bg-gray-100 transition-colors block">
                <div className="w-16 h-16 bg-[#FCEF3B] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <div className="px-6 flex-1 text-lg text-black">Time Off Requests</div>
                <div className="px-6 text-gray-400 group-hover:text-black transition-colors">→</div>
              </Link>
              {/* Item 3 */}
              <Link href="/profile" className="flex items-center bg-[#F4F4F4] group cursor-pointer hover:bg-gray-100 transition-colors block">
                <div className="w-16 h-16 bg-[#FCEF3B] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className="px-6 flex-1 text-lg text-black">Attendance Logs</div>
                <div className="px-6 text-gray-400 group-hover:text-black transition-colors">→</div>
              </Link>
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
              <Link href="/admin" className="flex items-center bg-[#F4F4F4] group cursor-pointer hover:bg-gray-100 transition-colors block">
                <div className="w-16 h-16 bg-[#FCEF3B] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                </div>
                <div className="px-6 flex-1 text-lg text-black">Payroll Generation</div>
                <div className="px-6 text-gray-400 group-hover:text-black transition-colors">→</div>
              </Link>
              {/* Item 2 */}
              <Link href="/admin" className="flex items-center bg-[#F4F4F4] group cursor-pointer hover:bg-gray-100 transition-colors block">
                <div className="w-16 h-16 bg-[#FCEF3B] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className="px-6 flex-1 text-lg text-black">Approve Requests</div>
                <div className="px-6 text-gray-400 group-hover:text-black transition-colors">→</div>
              </Link>
              {/* Item 3 */}
              <Link href="/admin" className="flex items-center bg-[#F4F4F4] group cursor-pointer hover:bg-gray-100 transition-colors block">
                <div className="w-16 h-16 bg-[#FCEF3B] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                </div>
                <div className="px-6 flex-1 text-lg text-black">Admin Dashboards</div>
                <div className="px-6 text-gray-400 group-hover:text-black transition-colors">→</div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dataset Uploader Section */}
      <DatasetUploader onLoginRequest={() => setShowLogin(true)} />

      {/* About Us Section */}
      <AboutUsSection />

      {/* Footer Section */}
      <footer className="bg-black text-white py-16 px-8 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 border-t border-zinc-800 pt-8">
          <div className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded-full grid place-items-center">
               <div className="w-3 h-3 bg-black rounded-full"></div>
            </div>
            blond
          </div>
          
          <div className="text-zinc-400 text-sm flex flex-col gap-2 font-medium font-mono">
            <p>Rishik M - <a href="mailto:r1sh1k@icloud.com" className="text-white hover:underline">r1sh1k@icloud.com</a></p>
            <p>Shreegouri J Jahagirdar - <a href="mailto:shreegaurij@gmail.com" className="text-white hover:underline">shreegaurij@gmail.com</a></p>
            <p>Ninaad P - <a href="mailto:ninaadkashyap2006@gmail.com" className="text-white hover:underline">ninaadkashyap2006@gmail.com</a></p>
            <p>Karan urs k - <a href="mailto:karanurs30@gmail.com" className="text-white hover:underline">karanurs30@gmail.com</a></p>
          </div>
        </div>
      </footer>

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
              className="bg-white border-2 border-gray-100 p-8 rounded-3xl w-full max-w-md relative shadow-2xl"
            >
              <button 
                onClick={() => {
                  setShowLogin(false);
                  setLoginRole('Employee');
                  setLoginError('');
                }}
                className="absolute top-6 right-6 text-gray-400 hover:text-black font-bold z-10 transition-colors"
              >
                ✕
              </button>

              <div className="mb-8">
                <h2 className="text-4xl font-black mb-1 tracking-tight text-black">Sign In</h2>
                <p className="text-gray-500 font-medium">Enter your credentials to continue</p>
              </div>

              {/* Tabs */}
              <div className="flex gap-8 border-b-2 border-gray-100 mb-8">
                <button
                  onClick={() => { 
                    setLoginRole('Employee'); 
                    setLoginError(''); 
                    setEmail('');
                    setPassword('');
                  }}
                  type="button"
                  className={`pb-3 text-sm font-bold tracking-wider transition-colors ${
                    loginRole === 'Employee' 
                      ? 'text-black border-b-4 border-yellow-400 -mb-[2px]' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  EMPLOYEE
                </button>
                <button
                  onClick={() => { 
                    setLoginRole('Admin'); 
                    setLoginError(''); 
                    setEmail('hr.admin01@dayflow.com');
                    setPassword('Dayflow@Admin01!');
                  }}
                  type="button"
                  className={`pb-3 text-sm font-bold tracking-wider transition-colors ${
                    loginRole === 'Admin' 
                      ? 'text-black border-b-4 border-yellow-400 -mb-[2px]' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  ADMIN / HR
                </button>
              </div>

              <form onSubmit={handleLoginSubmit}>
                {loginError && (
                  <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-bold">
                    {loginError}
                  </div>
                )}

                <div className="space-y-5 mb-8">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input 
                        type="email" 
                        required
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black focus:bg-white transition-all text-black font-medium"
                        placeholder="you@blond.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input 
                        type="password" 
                        required
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black focus:bg-white transition-all text-black font-medium"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-bold shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isLoggingIn ? 'Authenticating...' : 'Login'}
                  {!isLoggingIn && <ArrowRight size={20} />}
                </button>
              </form>

              <div className="mt-8 text-center text-sm font-medium text-gray-500">
                Don't have an account? <a href="#" className="text-black font-bold hover:underline">Sign up</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
