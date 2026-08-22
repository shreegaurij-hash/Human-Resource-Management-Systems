"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, TrendingUp, ChevronDown, Calendar, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { payrollService } from '../../services/payrollService';
import { Payslip } from '../../types/payroll';

export function EmployeePayrollView() {
  const { user } = useCurrentUser();
  const employeeId = user?.id || 'emp-1';
  
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);

  useEffect(() => {
    try {
      const history = payrollService.getEmployeePayslips(employeeId);
      setPayslips(history);
      if (history.length > 0) {
        setSelectedPayslip(history[0]);
      }
    } catch (e) {
      console.error(e);
    }
  }, [employeeId]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (!selectedPayslip) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-8">
        <Wallet size={48} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Payslips Found</h2>
        <p className="text-gray-500 text-sm">We couldn't find any payslip records for your account.</p>
        <Link href="/" className="mt-6 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900 pb-20">
      
      {/* Top Navigation */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm mb-10">
        <Link href="/" className="text-xl font-black tracking-tighter hover:opacity-70 transition-opacity">
          blond
        </Link>
        <div className="flex items-center gap-6 text-sm font-semibold text-gray-500">
          <Link href="/attendance" className="hover:text-gray-900 transition-colors">Attendance</Link>
          <Link href="/leave" className="hover:text-gray-900 transition-colors">Leave</Link>
          <Link href="/payroll" className="text-gray-900 border-b-2 border-blue-600 pb-0.5">Salary</Link>
          <Link href="/profile" className="hover:text-gray-900 transition-colors">Profile</Link>
        </div>
      </nav>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto px-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-semibold uppercase tracking-wider rounded-md mb-3 border border-blue-100">
              Employee View • Confidential
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-1">
              My Compensation
            </h1>
            <p className="text-gray-500 font-medium text-sm">
              Review and download your recent payslips.
            </p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold shadow-sm">
            <Download size={16} />
            Download YTD Report
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          
          {/* Main Details */}
          <motion.div variants={itemVariants} className="space-y-6">
            
            {/* Top Net Pay Card */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-2">Net Payable Salary</div>
                <div className="text-4xl font-bold tracking-tight text-gray-900">₹{selectedPayslip.netPay.toLocaleString()}</div>
              </div>
              <div className="text-right text-xs font-medium text-gray-500">
                Status: <span className="font-semibold uppercase bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md ml-2 border border-emerald-100">{selectedPayslip.status}</span>
                <p className="mt-2 text-gray-400">Processed on {new Date(selectedPayslip.issueDate).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Earnings vs Deductions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Earnings */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-600 mb-6 border-b border-gray-100 pb-4">
                  <ArrowUpRight size={18} />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">Earnings</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Base Salary</span>
                    <span className="font-medium text-gray-900">₹{selectedPayslip.baseSalary?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">HRA</span>
                    <span className="font-medium text-gray-900">₹{selectedPayslip.allowances?.hra?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Medical Allowance</span>
                    <span className="font-medium text-gray-900">₹{selectedPayslip.allowances?.medical?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Special Allowance</span>
                    <span className="font-medium text-gray-900">₹{selectedPayslip.allowances?.special?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Performance Bonus</span>
                    <span className="font-medium text-gray-900">₹{selectedPayslip.allowances?.performanceBonus?.toLocaleString() || 0}</span>
                  </div>
                  <div className="pt-4 mt-2 border-t border-gray-100 flex justify-between items-center font-semibold">
                    <span className="text-gray-900 text-xs uppercase tracking-wider">Gross Earnings</span>
                    <span className="text-gray-900 text-base">₹{selectedPayslip.grossEarnings?.toLocaleString() || 0}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 text-rose-600 mb-6 border-b border-gray-100 pb-4">
                  <ArrowDownRight size={18} />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">Deductions</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">PF</span>
                    <span className="font-medium text-gray-900">-₹{selectedPayslip.deductions?.pf?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">TDS</span>
                    <span className="font-medium text-gray-900">-₹{selectedPayslip.deductions?.tds?.toLocaleString() || 0}</span>
                  </div>
                  {selectedPayslip.deductions?.unpaidLeaveDeduction > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Unpaid Leaves</span>
                      <span className="font-medium text-gray-900">-₹{selectedPayslip.deductions?.unpaidLeaveDeduction?.toLocaleString()}</span>
                    </div>
                  )}
                  {selectedPayslip.deductions?.otherDeductions > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Other</span>
                      <span className="font-medium text-gray-900">-₹{selectedPayslip.deductions?.otherDeductions?.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="pt-4 mt-2 border-t border-gray-100 flex justify-between items-center font-semibold">
                    <span className="text-gray-900 text-xs uppercase tracking-wider">Total Deductions</span>
                    <span className="text-gray-900 text-base">₹{selectedPayslip.totalDeductions?.toLocaleString() || 0}</span>
                  </div>
                </div>
              </div>
            </div>
            
          </motion.div>

          {/* Sidebar */}
          <motion.div variants={itemVariants} className="space-y-6">
            
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900 mb-4 border-b border-gray-100 pb-3">Payslip History</h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {payslips.map(ps => (
                  <button 
                    key={ps.id}
                    onClick={() => setSelectedPayslip(ps)}
                    className={`w-full text-left p-3 rounded-xl transition-all border ${selectedPayslip.id === ps.id ? 'bg-blue-50 border-blue-200 text-blue-900' : 'bg-transparent border-transparent hover:bg-gray-50 text-gray-600'}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`font-semibold text-sm ${selectedPayslip.id === ps.id ? 'text-blue-900' : 'text-gray-900'}`}>{ps.month} {ps.year}</span>
                      <span className="text-xs font-medium bg-white px-2 py-0.5 rounded border border-gray-200 shadow-sm">₹{(ps.netPay / 1000).toFixed(1)}k</span>
                    </div>
                    <div className="text-[10px] uppercase tracking-wider font-medium flex items-center gap-1 opacity-70">
                      <Calendar size={10} /> {new Date(ps.issueDate).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-sm font-semibold mb-2">Need Help?</h3>
                <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                  Have questions about your tax deductions or need corrections? Contact payroll.
                </p>
                <button className="text-xs font-semibold bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors w-full">
                  Contact HR
                </button>
              </div>
            </div>

          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
