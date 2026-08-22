"use client";

import React from 'react';
import { motion } from 'framer-motion';

export const AboutUsSection = () => {
  return (
    <section className="py-32 bg-[#f8f9fa] border-t border-gray-200 overflow-hidden relative z-10">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* Top small headers */}
        <div className="flex justify-between items-center text-xs font-bold tracking-[0.2em] text-gray-400 mb-20 uppercase">
          <div>Why Blond</div>
          <div>Less chaos. More order.</div>
        </div>

        {/* Giant Typography */}
        <div className="mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-[4rem] md:text-[7rem] leading-[0.9] font-bold tracking-tighter text-black uppercase"
            style={{ fontFamily: 'monospace' }}
          >
            We build<br/>
            <span className="text-[#FCEF3B]">
              intelligent
            </span><br/>
            HR technology<br/>
            <span className="text-gray-400">for modern</span><br/>
            organizations.
          </motion.h2>
        </div>

        <hr className="border-gray-300 mb-12" />

        {/* Paragraph Text */}
        <div className="max-w-3xl">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed"
          >
            <strong className="text-black">Blond</strong> is a workforce management platform designed to simplify the way organizations manage their people and everyday operations.<br/><br/>
            From attendance and leave to payroll and workforce analytics, we bring HR processes together in one connected platform. Our AI-driven insights help HR teams identify patterns, spot anomalies and make better-informed decisions, while giving employees a simple, intuitive way to manage their workday.<br/><br/>
            <strong className="text-black">One platform. Better visibility. Smarter workforce management.</strong>
          </motion.p>
        </div>

      </div>
    </section>
  );
};
