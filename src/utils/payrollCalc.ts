import { AllowanceBreakdown, DeductionBreakdown } from '../types/payroll';

export interface CalculationInput {
  baseSalary: number;
  allowances: AllowanceBreakdown;
  taxPercentage: number;
  pfPercentage: number;
  unpaidLeaveDays?: number;
  workingDaysInMonth?: number;
  otherDeductions?: number;
}

export interface CalculationResult {
  grossEarnings: number;
  totalDeductions: number;
  netPay: number;
  deductions: DeductionBreakdown;
  allowances: AllowanceBreakdown;
}

/**
 * Calculates gross monthly earnings based on base salary and allowances.
 */
export function calculateGrossEarnings(
  baseSalary: number,
  allowances: AllowanceBreakdown
): number {
  if (baseSalary < 0) throw new Error('Base salary cannot be negative');
  const { hra = 0, medical = 0, special = 0, performanceBonus = 0 } = allowances;
  if (hra < 0 || medical < 0 || special < 0 || performanceBonus < 0) {
    throw new Error('Allowances cannot be negative');
  }
  return baseSalary + hra + medical + special + performanceBonus;
}

/**
 * Calculates Provident Fund (PF) contribution based on base salary and percentage.
 */
export function calculatePf(baseSalary: number, pfPercentage: number): number {
  if (baseSalary < 0) throw new Error('Base salary cannot be negative');
  if (pfPercentage < 0 || pfPercentage > 100) {
    throw new Error('PF percentage must be between 0 and 100');
  }
  return Math.round((baseSalary * pfPercentage) / 100);
}

/**
 * Calculates Tax Deducted at Source (TDS) based on gross earnings.
 */
export function calculateTds(grossEarnings: number, taxPercentage: number): number {
  if (grossEarnings < 0) throw new Error('Gross earnings cannot be negative');
  if (taxPercentage < 0 || taxPercentage > 100) {
    throw new Error('Tax percentage must be between 0 and 100');
  }
  return Math.round((grossEarnings * taxPercentage) / 100);
}

/**
 * Calculates unpaid leave deduction penalty based on daily base pay rate.
 */
export function calculateUnpaidLeaveDeduction(
  baseSalary: number,
  unpaidLeaveDays: number = 0,
  workingDaysInMonth: number = 30
): number {
  if (unpaidLeaveDays < 0) throw new Error('Unpaid leave days cannot be negative');
  if (workingDaysInMonth <= 0) throw new Error('Working days must be greater than zero');
  if (unpaidLeaveDays === 0) return 0;
  
  const dailyRate = baseSalary / workingDaysInMonth;
  return Math.round(dailyRate * unpaidLeaveDays);
}

/**
 * Full payroll computation combining earnings, tax, PF, unpaid leave penalty, and net pay.
 */
export function computeFullPayroll(input: CalculationInput): CalculationResult {
  const {
    baseSalary,
    allowances,
    taxPercentage,
    pfPercentage,
    unpaidLeaveDays = 0,
    workingDaysInMonth = 30,
    otherDeductions = 0,
  } = input;

  if (otherDeductions < 0) throw new Error('Other deductions cannot be negative');

  const grossEarnings = calculateGrossEarnings(baseSalary, allowances);
  const pf = calculatePf(baseSalary, pfPercentage);
  const tds = calculateTds(grossEarnings, taxPercentage);
  const unpaidLeaveDeduction = calculateUnpaidLeaveDeduction(
    baseSalary,
    unpaidLeaveDays,
    workingDaysInMonth
  );

  const totalDeductions = pf + tds + unpaidLeaveDeduction + otherDeductions;
  const netPay = Math.max(0, grossEarnings - totalDeductions);

  const deductions: DeductionBreakdown = {
    pf,
    tds,
    unpaidLeaveDeduction,
    otherDeductions,
  };

  return {
    grossEarnings,
    totalDeductions,
    netPay,
    deductions,
    allowances,
  };
}
