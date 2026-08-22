import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { payrollService } from '../../services/payrollService';
import { SalaryStructure, Payslip } from '../../types/payroll';

interface EmployeePayrollViewProps {
  employeeId?: string;
}

export const EmployeePayrollView: React.FC<EmployeePayrollViewProps> = ({
  employeeId = 'emp-1',
}) => {
  const [structure, setStructure] = useState<SalaryStructure | null>(null);
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);

  useEffect(() => {
    try {
      const struct = payrollService.getSalaryStructure(employeeId);
      setStructure(struct);
      const history = payrollService.getEmployeePayslips(employeeId);
      setPayslips(history);
    } catch (e) {
      console.error(e);
    }
  }, [employeeId]);

  if (!structure) {
    return (
      <div className="p-8 text-gray-500">
        Loading salary breakdown...
      </div>
    );
  }

  const { baseSalary, allowances, taxBracketPercentage, pfPercentage } = structure;
  const grossEarnings =
    baseSalary +
    allowances.hra +
    allowances.medical +
    allowances.special +
    allowances.performanceBonus;
  const estimatedPf = Math.round((baseSalary * pfPercentage) / 100);
  const estimatedTds = Math.round((grossEarnings * taxBracketPercentage) / 100);
  const totalDeductions = estimatedPf + estimatedTds;
  const estimatedNet = grossEarnings - totalDeductions;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-black font-sans p-6 md:p-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider">
            Employee View • Confidential
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 uppercase tracking-tight">
          My Compensation
        </h1>
        <p className="text-gray-500 font-medium">
          Detailed breakdown of your salary structure, tax deductions, and monthly payslips.
        </p>
      </motion.div>

      {/* Salary Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard
          label="Net Take-Home Salary"
          value={`₹${estimatedNet.toLocaleString()}`}
          subtext="Estimated monthly payout"
          gradient="from-emerald-600 to-teal-700"
        />
        <StatCard
          label="Gross Monthly Earnings"
          value={`₹${grossEarnings.toLocaleString()}`}
          subtext="Base + Allowances & Bonus"
          gradient="from-cyan-600 to-blue-700"
        />
        <StatCard
          label="Total Monthly Deductions"
          value={`₹${totalDeductions.toLocaleString()}`}
          subtext={`TDS (${taxBracketPercentage}%) + PF (${pfPercentage}%)`}
          gradient="from-purple-600 to-indigo-700"
        />
        <StatCard
          label="Base Fixed Pay"
          value={`₹${baseSalary.toLocaleString()}`}
          subtext="Annualized equivalent"
          gradient="from-zinc-800 to-zinc-900 border border-gray-200"
        />
      </div>

      {/* Main Grid: Breakdown & Payslip History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Itemized Compensation Structure */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white shadow-xl/90 border border-gray-200 p-8 rounded-3xl backdrop-blur shadow-2xl"
        >
          <h2 className="text-2xl font-bold text-black mb-6 border-b border-gray-200 pb-4 flex justify-between items-center">
            <span>Salary Breakdown</span>
            <span className="text-sm font-normal text-zinc-500">Fixed & Variable</span>
          </h2>

          <div className="space-y-6">
            {/* Earnings Component List */}
            <div>
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-3">
                Earnings Components
              </h3>
              <div className="space-y-3">
                <BreakdownRow label="Basic Salary" amount={baseSalary} total={grossEarnings} color="bg-emerald-500" />
                <BreakdownRow label="House Rent Allowance (HRA)" amount={allowances.hra} total={grossEarnings} color="bg-teal-400" />
                <BreakdownRow label="Medical Allowance" amount={allowances.medical} total={grossEarnings} color="bg-cyan-400" />
                <BreakdownRow label="Special Allowance" amount={allowances.special} total={grossEarnings} color="bg-blue-400" />
                <BreakdownRow label="Performance Bonus" amount={allowances.performanceBonus} total={grossEarnings} color="bg-indigo-400" />
              </div>
            </div>

            {/* Deductions Component List */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-bold text-rose-400 uppercase tracking-widest mb-3">
                Standard Deductions
              </h3>
              <div className="space-y-3">
                <BreakdownRow label={`Provident Fund (PF - ${pfPercentage}%)`} amount={estimatedPf} total={grossEarnings} color="bg-rose-500" isDeduction />
                <BreakdownRow label={`Income Tax / TDS (${taxBracketPercentage}%)`} amount={estimatedTds} total={grossEarnings} color="bg-amber-500" isDeduction />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Monthly Payslips History */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-2xl font-bold text-black mb-6 border-b border-gray-200 pb-4 flex justify-between items-center">
            <span>Payslip History</span>
            <span className="text-sm font-normal text-zinc-500">{payslips.length} Records Available</span>
          </h2>

          <div className="space-y-4">
            {payslips.length === 0 ? (
              <div className="bg-white shadow-xl/50 border border-gray-200 p-8 rounded-2xl text-center text-zinc-500 italic">
                No past payslips generated yet.
              </div>
            ) : (
              payslips.map((payslip) => (
                <motion.div
                  key={payslip.id}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white shadow-xl/90 border border-gray-200 hover:border-emerald-500/50 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-black text-xl text-black">{payslip.payPeriod}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {payslip.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Issue Date: {payslip.issueDate} • Net Payout: <span className="text-emerald-400 font-bold">₹{payslip.netPay.toLocaleString()}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedPayslip(payslip)}
                    className="px-5 py-2.5 rounded-xl bg-gray-50 hover:bg-emerald-600 text-black font-bold text-sm transition-colors border border-gray-200 flex items-center gap-2"
                  >
                    <span>📄 View Payslip</span>
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Modal: Itemized Payslip Preview */}
      <AnimatePresence>
        {selectedPayslip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#F8F9FA]/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white shadow-xl border border-gray-200 p-8 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
            >
              <button
                onClick={() => setSelectedPayslip(null)}
                className="absolute top-6 right-6 text-zinc-500 hover:text-black text-xl font-bold"
              >
                ✕
              </button>

              <div className="border-b border-gray-200 pb-6 mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                  DAYFLOW. Official Salary Statement
                </span>
                <h2 className="text-3xl font-black text-black mt-1">
                  Payslip for {selectedPayslip.payPeriod}
                </h2>
                <p className="text-sm text-gray-500">
                  Employee: {selectedPayslip.employeeName} ({selectedPayslip.designation})
                </p>
              </div>

              {/* Table Breakdown */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-zinc-950 p-5 rounded-2xl border border-gray-200">
                  <h4 className="font-bold text-emerald-400 text-sm uppercase tracking-wider mb-3">Earnings</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Basic</span> <span>₹{selectedPayslip.baseSalary.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">HRA</span> <span>₹{selectedPayslip.allowances.hra.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Medical</span> <span>₹{selectedPayslip.allowances.medical.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Special</span> <span>₹{selectedPayslip.allowances.special.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Bonus</span> <span>₹{selectedPayslip.allowances.performanceBonus.toLocaleString()}</span></div>
                    <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-black">
                      <span>Gross Total</span> <span>₹{selectedPayslip.grossEarnings.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-950 p-5 rounded-2xl border border-gray-200">
                  <h4 className="font-bold text-rose-400 text-sm uppercase tracking-wider mb-3">Deductions</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Provident Fund (PF)</span> <span>₹{selectedPayslip.deductions.pf.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">TDS / Income Tax</span> <span>₹{selectedPayslip.deductions.tds.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Unpaid Leave ({selectedPayslip.unpaidLeaveDays}d)</span> <span>₹{selectedPayslip.deductions.unpaidLeaveDeduction.toLocaleString()}</span></div>
                    <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-black">
                      <span>Total Deductions</span> <span>₹{selectedPayslip.totalDeductions.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Payout Banner */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 rounded-2xl text-black flex justify-between items-center mb-6">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-100">Net Payable Salary</div>
                  <div className="text-3xl font-black">₹{selectedPayslip.netPay.toLocaleString()}</div>
                </div>
                <div className="text-right text-xs text-emerald-100">
                  Status: <span className="font-bold uppercase bg-white/20 px-2.5 py-1 rounded-full">{selectedPayslip.status}</span>
                  <div className="mt-1">{selectedPayslip.paymentMethod}</div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => alert(`Downloading Payslip PDF for ${selectedPayslip.payPeriod}...`)}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-xl transition-all"
                >
                  Download PDF Statement
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCard = ({
  label,
  value,
  subtext,
  gradient,
}: {
  label: string;
  value: string;
  subtext: string;
  gradient: string;
}) => (
  <motion.div
    whileHover={{ y: -4 }}
    className={`bg-gradient-to-br ${gradient} p-6 rounded-3xl shadow-xl relative overflow-hidden`}
  >
    <div className="text-black/80 font-bold text-xs uppercase tracking-wider mb-2">
      {label}
    </div>
    <div className="text-3xl md:text-4xl font-black text-black tracking-tight">
      {value}
    </div>
    <div className="text-xs text-black/70 mt-2 font-medium">{subtext}</div>
  </motion.div>
);

const BreakdownRow = ({
  label,
  amount,
  total,
  color,
  isDeduction = false,
}: {
  label: string;
  amount: number;
  total: number;
  color: string;
  isDeduction?: boolean;
}) => {
  const percentage = Math.min(100, Math.round((amount / total) * 100));

  return (
    <div>
      <div className="flex justify-between text-sm mb-1 font-medium">
        <span className="text-zinc-300">{label}</span>
        <span className={isDeduction ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
          {isDeduction ? '-' : ''}₹{amount.toLocaleString()} ({percentage}%)
        </span>
      </div>
      <div className="w-full bg-gray-50 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
};
