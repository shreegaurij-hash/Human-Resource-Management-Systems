import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, FileText } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white font-sans p-8">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h1 className="text-6xl font-extrabold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
          DAYFLOW.
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl">
          Empowering your workday with seamless Human Resource Management. Focus on what matters, we handle the rest.
        </p>
      </motion.header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Leave & Time-off', icon: <Calendar size={32} />, color: 'bg-pink-600', link: '/leave' },
          { title: 'Attendance Tracking', icon: <Clock size={32} />, color: 'bg-blue-600', link: '/attendance' },
          { title: 'Payroll Dashboard', icon: <FileText size={32} />, color: 'bg-green-600', link: '/payroll' },
        ].map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className={`p-6 rounded-2xl ${item.color} flex flex-col justify-between h-48 cursor-pointer shadow-2xl overflow-hidden relative group`}
          >
            <div className="z-10">
              <div className="mb-4 text-white opacity-80">{item.icon}</div>
              <h2 className="text-2xl font-bold text-white">{item.title}</h2>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
