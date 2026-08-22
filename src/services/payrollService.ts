import {
  SalaryStructure,
  Payslip,
  PayrollSummary,
  PayrollStatus,
} from '../types/payroll';
import { computeFullPayroll } from '../utils/payrollCalc';

const mockSalaryStructures: Record<string, SalaryStructure> = {
  'emp-1': {
    employeeId: 'emp-1',
    employeeName: 'Ninaad Kashyap',
    designation: 'Senior Software Engineer',
    department: 'Engineering',
    baseSalary: 75000,
    allowances: {
      hra: 22500,
      medical: 4000,
      special: 8500,
      performanceBonus: 10000,
    },
    taxBracketPercentage: 12,
    pfPercentage: 12,
    updatedAt: new Date().toISOString(),
  },
  'emp-2': {
    employeeId: 'emp-2',
    employeeName: 'Rishik',
    designation: 'Frontend Lead',
    department: 'Product',
    baseSalary: 80000,
    allowances: {
      hra: 24000,
      medical: 4000,
      special: 10000,
      performanceBonus: 12000,
    },
    taxBracketPercentage: 15,
    pfPercentage: 12,
    updatedAt: new Date().toISOString(),
  },
  'emp-3': {
    employeeId: 'emp-3',
    employeeName: 'Shreegauri',
    designation: 'UX Director',
    department: 'Design',
    baseSalary: 85000,
    allowances: {
      hra: 25500,
      medical: 5000,
      special: 12000,
      performanceBonus: 15000,
    },
    taxBracketPercentage: 15,
    pfPercentage: 12,
    updatedAt: new Date().toISOString(),
  },
  'emp-4': {
    employeeId: 'emp-4',
    employeeName: 'Karan',
    designation: 'Full Stack Engineer',
    department: 'Engineering',
    baseSalary: 70000,
    allowances: {
      hra: 21000,
      medical: 4000,
      special: 8000,
      performanceBonus: 8000,
    },
    taxBracketPercentage: 10,
    pfPercentage: 12,
    updatedAt: new Date().toISOString(),
  },
};

const mockPayslips: Payslip[] = [
  {
    id: 'pay-2026-07-emp-1',
    employeeId: 'emp-1',
    employeeName: 'Ninaad Kashyap',
    designation: 'Senior Software Engineer',
    department: 'Engineering',
    payPeriod: 'July 2026',
    issueDate: '2026-07-31',
    baseSalary: 75000,
    grossEarnings: 120000,
    totalDeductions: 23400,
    netPay: 96600,
    unpaidLeaveDays: 0,
    allowances: {
      hra: 22500,
      medical: 4000,
      special: 8500,
      performanceBonus: 10000,
    },
    deductions: {
      pf: 9000,
      tds: 14400,
      unpaidLeaveDeduction: 0,
      otherDeductions: 0,
    },
    status: 'Paid',
    paymentMethod: 'Direct Deposit (HDFC Bank ****4821)',
  },
  {
    id: 'pay-2026-06-emp-1',
    employeeId: 'emp-1',
    employeeName: 'Ninaad Kashyap',
    designation: 'Senior Software Engineer',
    department: 'Engineering',
    payPeriod: 'June 2026',
    issueDate: '2026-06-30',
    baseSalary: 75000,
    grossEarnings: 115000,
    totalDeductions: 22800,
    netPay: 92200,
    unpaidLeaveDays: 1,
    allowances: {
      hra: 22500,
      medical: 4000,
      special: 8500,
      performanceBonus: 5000,
    },
    deductions: {
      pf: 9000,
      tds: 13800,
      unpaidLeaveDeduction: 2500,
      otherDeductions: 0,
    },
    status: 'Paid',
    paymentMethod: 'Direct Deposit (HDFC Bank ****4821)',
  },
];

export const payrollService = {
  getSalaryStructure: (employeeId: string): SalaryStructure => {
    const structure = mockSalaryStructures[employeeId];
    if (!structure) {
      throw new Error(`Salary structure for employee ${employeeId} not found`);
    }
    return { ...structure };
  },

  getAllSalaryStructures: (): SalaryStructure[] => {
    return Object.values(mockSalaryStructures);
  },

  updateSalaryStructure: (
    employeeId: string,
    updates: Partial<SalaryStructure>
  ): SalaryStructure => {
    const current = mockSalaryStructures[employeeId];
    if (!current) {
      throw new Error(`Employee ${employeeId} not found`);
    }

    const updated: SalaryStructure = {
      ...current,
      ...updates,
      allowances: {
        ...current.allowances,
        ...(updates.allowances || {}),
      },
      updatedAt: new Date().toISOString(),
    };

    mockSalaryStructures[employeeId] = updated;
    return updated;
  },

  getEmployeePayslips: (employeeId: string): Payslip[] => {
    return mockPayslips.filter((p) => p.employeeId === employeeId);
  },

  getAllPayslips: (): Payslip[] => {
    return [...mockPayslips];
  },

  generatePayslipForEmployee: (
    employeeId: string,
    payPeriod: string,
    unpaidLeaveDays: number = 0
  ): Payslip => {
    const struct = mockSalaryStructures[employeeId];
    if (!struct) {
      throw new Error(`Employee ${employeeId} not found`);
    }

    const calcResult = computeFullPayroll({
      baseSalary: struct.baseSalary,
      allowances: struct.allowances,
      taxPercentage: struct.taxBracketPercentage,
      pfPercentage: struct.pfPercentage,
      unpaidLeaveDays,
    });

    const newPayslip: Payslip = {
      id: `pay-${payPeriod.toLowerCase().replace(/\s+/g, '-')}-${employeeId}`,
      employeeId: struct.employeeId,
      employeeName: struct.employeeName,
      designation: struct.designation,
      department: struct.department,
      payPeriod,
      issueDate: new Date().toISOString().split('T')[0],
      baseSalary: struct.baseSalary,
      grossEarnings: calcResult.grossEarnings,
      totalDeductions: calcResult.totalDeductions,
      netPay: calcResult.netPay,
      unpaidLeaveDays,
      allowances: calcResult.allowances,
      deductions: calcResult.deductions,
      status: 'Paid',
      paymentMethod: 'Direct Bank Transfer',
    };

    // Check if existing payslip for period exists and replace, else push
    const existingIndex = mockPayslips.findIndex(
      (p) => p.employeeId === employeeId && p.payPeriod === payPeriod
    );
    if (existingIndex >= 0) {
      mockPayslips[existingIndex] = newPayslip;
    } else {
      mockPayslips.unshift(newPayslip);
    }

    return newPayslip;
  },

  processPayrollForPeriod: (payPeriod: string): Payslip[] => {
    const generated: Payslip[] = [];
    for (const employeeId of Object.keys(mockSalaryStructures)) {
      const payslip = payrollService.generatePayslipForEmployee(
        employeeId,
        payPeriod,
        0
      );
      generated.push(payslip);
    }
    return generated;
  },

  getPayrollSummary: (): PayrollSummary => {
    const structures = Object.values(mockSalaryStructures);
    const recentPayslips = mockPayslips.slice(0, 10);

    const totalCost = recentPayslips.reduce((acc, p) => acc + p.netPay, 0);
    const totalTds = recentPayslips.reduce((acc, p) => acc + p.deductions.tds, 0);
    const totalPf = recentPayslips.reduce((acc, p) => acc + p.deductions.pf, 0);

    return {
      totalEmployees: structures.length,
      totalPayrollCost: totalCost,
      totalTdsDeducted: totalTds,
      totalPfDeducted: totalPf,
      pendingApprovals: 2,
      processedCount: recentPayslips.length,
    };
  },
};
