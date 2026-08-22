import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { payrollService } from '../../services/payrollService';
import { SalaryStructure, PayrollSummary } from '../../types/payroll';

export const AdminPayrollManagement: React.FC = () => {
  const [structures, setStructures] = useState<SalaryStructure[]>([]);
  const [summary, setSummary] = useState<PayrollSummary | null>(null);
  const [editingStruct, setEditingStruct] = useState<SalaryStructure | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [processingPeriod, setProcessingPeriod] = useState('August 2026');
  const [successMessage, setSuccessMessage] = useState('');

  const loadData = () => {
    setStructures(payrollService.getAllSalaryStructures());
    setSummary(payrollService.getPayrollSummary());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStructure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStruct) return;

    payrollService.updateSalaryStructure(editingStruct.employeeId, editingStruct);
    loadData();
    setSuccessMessage(`Updated salary structure for ${editingStruct.employeeName}`);
    setEditingStruct(null);

    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleProcessPayroll = () => {
    payrollService.processPayrollForPeriod(processingPeriod);
    loadData();
    setSuccessMessage(`Successfully processed monthly payroll for ${processingPeriod}!`);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const filteredStructures = structures.filter(
    (s) =>
      s.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-black font-sans p-6 md:p-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-full text-xs font-bold uppercase tracking-wider">
              Admin & HR Control Center
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 uppercase tracking-tight">
            Payroll Management
          </h1>
          <p className="text-gray-500 font-medium">
            Configure employee compensation, adjust tax rates, and execute monthly payroll runs.
          </p>
        </div>

        <button
          onClick={handleProcessPayroll}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 hover:scale-105 text-black font-black text-lg transition-transform shadow-xl shadow-amber-500/10 flex items-center gap-2"
        >
          <span>🚀 Run Payroll ({processingPeriod})</span>
        </button>
      </motion.div>

      {/* Notification Toast */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-2xl font-bold flex justify-between items-center"
        >
          <span>✅ {successMessage}</span>
          <button onClick={() => setSuccessMessage('')} className="text-zinc-500 hover:text-black">✕</button>
        </motion.div>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <AdminStatCard
            title="Total Monthly Payroll"
            value={`₹${summary.totalPayrollCost.toLocaleString()}`}
            subtext={`${summary.totalEmployees} active employees`}
            color="border-yellow-500/30 bg-yellow-500/5"
          />
          <AdminStatCard
            title="TDS Tax Collected"
            value={`₹${summary.totalTdsDeducted.toLocaleString()}`}
            subtext="Government remittance ready"
            color="border-amber-500/30 bg-amber-500/5"
          />
          <AdminStatCard
            title="PF Contributions"
            value={`₹${summary.totalPfDeducted.toLocaleString()}`}
            subtext="Provident Fund balance"
            color="border-orange-500/30 bg-orange-500/5"
          />
          <AdminStatCard
            title="Payroll Runs"
            value={`${summary.processedCount} Issued`}
            subtext="All current month ready"
            color="border-gray-200 bg-white shadow-xl/50"
          />
        </div>
      )}

      {/* Search & Employee Table */}
      <div className="bg-white shadow-xl/90 border border-gray-200 p-8 rounded-3xl backdrop-blur shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-2xl font-bold text-black flex items-center gap-3">
            <span>Employee Salary Structures</span>
            <span className="text-xs bg-gray-50 text-gray-500 px-3 py-1 rounded-full font-mono">
              {filteredStructures.length} Employees
            </span>
          </h2>

          <input
            type="text"
            placeholder="Search by name, department, designation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-80 bg-gray-50 border border-gray-200 text-black rounded-xl px-4 py-2.5 outline-none focus:border-yellow-500 transition-colors text-sm"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-950 text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200">
              <tr>
                <th className="p-4">Employee</th>
                <th className="p-4">Department</th>
                <th className="p-4">Base Pay</th>
                <th className="p-4">Allowances</th>
                <th className="p-4">TDS Rate</th>
                <th className="p-4">PF Rate</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredStructures.map((struct) => {
                const totalAllowances =
                  struct.allowances.hra +
                  struct.allowances.medical +
                  struct.allowances.special +
                  struct.allowances.performanceBonus;

                return (
                  <tr key={struct.employeeId} className="hover:bg-gray-50/40 transition-colors">
                    <td className="p-4 font-bold text-black">
                      <div>{struct.employeeName}</div>
                      <div className="text-xs font-normal text-zinc-500">{struct.designation}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-gray-50 rounded-lg text-xs font-semibold">
                        {struct.department}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-emerald-400">
                      ₹{struct.baseSalary.toLocaleString()}
                    </td>
                    <td className="p-4 font-mono text-zinc-300">
                      ₹{totalAllowances.toLocaleString()}
                    </td>
                    <td className="p-4 font-mono">{struct.taxBracketPercentage}%</td>
                    <td className="p-4 font-mono">{struct.pfPercentage}%</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setEditingStruct({ ...struct })}
                        className="px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500 text-yellow-400 hover:text-black font-bold rounded-xl transition-all border border-yellow-500/30"
                      >
                        Edit Compensation
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Structure Modal */}
      <AnimatePresence>
        {editingStruct && (
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
              className="bg-white shadow-xl border border-gray-200 p-8 rounded-3xl w-full max-w-xl relative"
            >
              <button
                onClick={() => setEditingStruct(null)}
                className="absolute top-6 right-6 text-zinc-500 hover:text-black text-xl font-bold"
              >
                ✕
              </button>

              <h2 className="text-2xl font-black text-black mb-1">
                Edit Salary Structure
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Employee: <span className="text-yellow-400 font-bold">{editingStruct.employeeName}</span> ({editingStruct.designation})
              </p>

              <form onSubmit={handleUpdateStructure} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Base Salary (Monthly ₹)
                  </label>
                  <input
                    type="number"
                    value={editingStruct.baseSalary}
                    onChange={(e) =>
                      setEditingStruct({
                        ...editingStruct,
                        baseSalary: Number(e.target.value),
                      })
                    }
                    className="w-full bg-gray-50 text-black rounded-xl p-3 outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                      HRA (House Rent)
                    </label>
                    <input
                      type="number"
                      value={editingStruct.allowances.hra}
                      onChange={(e) =>
                        setEditingStruct({
                          ...editingStruct,
                          allowances: {
                            ...editingStruct.allowances,
                            hra: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full bg-gray-50 text-black rounded-xl p-3 outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                      Performance Bonus
                    </label>
                    <input
                      type="number"
                      value={editingStruct.allowances.performanceBonus}
                      onChange={(e) =>
                        setEditingStruct({
                          ...editingStruct,
                          allowances: {
                            ...editingStruct.allowances,
                            performanceBonus: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full bg-gray-50 text-black rounded-xl p-3 outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                      TDS Tax Bracket (%)
                    </label>
                    <input
                      type="number"
                      value={editingStruct.taxBracketPercentage}
                      onChange={(e) =>
                        setEditingStruct({
                          ...editingStruct,
                          taxBracketPercentage: Number(e.target.value),
                        })
                      }
                      className="w-full bg-gray-50 text-black rounded-xl p-3 outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                      PF Percentage (%)
                    </label>
                    <input
                      type="number"
                      value={editingStruct.pfPercentage}
                      onChange={(e) =>
                        setEditingStruct({
                          ...editingStruct,
                          pfPercentage: Number(e.target.value),
                        })
                      }
                      className="w-full bg-gray-50 text-black rounded-xl p-3 outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingStruct(null)}
                    className="px-5 py-3 rounded-xl bg-gray-50 text-zinc-300 font-bold text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AdminStatCard = ({
  title,
  value,
  subtext,
  color,
}: {
  title: string;
  value: string;
  subtext: string;
  color: string;
}) => (
  <motion.div
    whileHover={{ y: -4 }}
    className={`p-6 rounded-3xl border ${color} backdrop-blur shadow-xl`}
  >
    <div className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-2">
      {title}
    </div>
    <div className="text-3xl font-black text-black">{value}</div>
    <div className="text-xs text-zinc-500 mt-2 font-medium">{subtext}</div>
  </motion.div>
);
