export type PayrollStatus = 'Draft' | 'Processing' | 'Paid' | 'On Hold';

export interface AllowanceBreakdown {
  hra: number;             // House Rent Allowance
  medical: number;         // Medical Allowance
  special: number;         // Special Allowance
  performanceBonus: number; // Performance Bonus
}

export interface DeductionBreakdown {
  pf: number;              // Provident Fund
  tds: number;             // Tax Deducted at Source / Income Tax
  unpaidLeaveDeduction: number; // Penalty for unpaid leaves
  otherDeductions: number; // Misc deductions
}

export interface SalaryStructure {
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  baseSalary: number;      // Annual or monthly base pay
  allowances: AllowanceBreakdown;
  taxBracketPercentage: number; // TDS percentage (e.g. 10%)
  pfPercentage: number;    // PF percentage (e.g. 12%)
  updatedAt: string;
}

export interface Payslip {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  payPeriod: string;       // e.g. "August 2026"
  issueDate: string;
  baseSalary: number;
  grossEarnings: number;
  totalDeductions: number;
  netPay: number;
  unpaidLeaveDays: number;
  allowances: AllowanceBreakdown;
  deductions: DeductionBreakdown;
  status: PayrollStatus;
  paymentMethod: string;
}

export interface PayrollSummary {
  totalEmployees: number;
  totalPayrollCost: number;
  totalTdsDeducted: number;
  totalPfDeducted: number;
  pendingApprovals: number;
  processedCount: number;
}
