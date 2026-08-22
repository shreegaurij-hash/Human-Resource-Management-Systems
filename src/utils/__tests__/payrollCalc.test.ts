import {
  calculateGrossEarnings,
  calculatePf,
  calculateTds,
  calculateUnpaidLeaveDeduction,
  computeFullPayroll,
} from '../payrollCalc';

describe('Payroll Calculation Utility', () => {
  const sampleAllowances = {
    hra: 15000,
    medical: 3000,
    special: 7000,
    performanceBonus: 5000,
  };

  describe('calculateGrossEarnings', () => {
    it('correctly calculates total gross earnings from base salary and allowances', () => {
      const gross = calculateGrossEarnings(50000, sampleAllowances);
      expect(gross).toBe(80000); // 50000 + 15000 + 3000 + 7000 + 5000
    });

    it('throws an error if base salary is negative', () => {
      expect(() => calculateGrossEarnings(-5000, sampleAllowances)).toThrow(
        'Base salary cannot be negative'
      );
    });

    it('throws an error if any allowance is negative', () => {
      expect(() =>
        calculateGrossEarnings(50000, { ...sampleAllowances, hra: -1000 })
      ).toThrow('Allowances cannot be negative');
    });
  });

  describe('calculatePf', () => {
    it('correctly calculates PF based on percentage', () => {
      const pf = calculatePf(50000, 12);
      expect(pf).toBe(6000);
    });

    it('throws error for invalid percentage', () => {
      expect(() => calculatePf(50000, -5)).toThrow(
        'PF percentage must be between 0 and 100'
      );
      expect(() => calculatePf(50000, 105)).toThrow(
        'PF percentage must be between 0 and 100'
      );
    });
  });

  describe('calculateTds', () => {
    it('correctly calculates TDS on gross earnings', () => {
      const tds = calculateTds(80000, 10);
      expect(tds).toBe(8000);
    });
  });

  describe('calculateUnpaidLeaveDeduction', () => {
    it('returns 0 when unpaid leave days are 0', () => {
      expect(calculateUnpaidLeaveDeduction(60000, 0, 30)).toBe(0);
    });

    it('correctly calculates pro-rated deduction for unpaid leave days', () => {
      // 60000 / 30 = 2000 per day. 3 days = 6000
      const deduction = calculateUnpaidLeaveDeduction(60000, 3, 30);
      expect(deduction).toBe(6000);
    });

    it('throws error if unpaid leave days are negative', () => {
      expect(() => calculateUnpaidLeaveDeduction(60000, -2, 30)).toThrow(
        'Unpaid leave days cannot be negative'
      );
    });
  });

  describe('computeFullPayroll', () => {
    it('computes complete payroll summary accurately', () => {
      const result = computeFullPayroll({
        baseSalary: 50000,
        allowances: sampleAllowances,
        taxPercentage: 10,
        pfPercentage: 12,
        unpaidLeaveDays: 2,
        workingDaysInMonth: 30,
        otherDeductions: 1000,
      });

      // Gross = 50000 + 25000 = 75000 (15000+3000+7000+5000 = 30000; total 80000)
      expect(result.grossEarnings).toBe(80000);
      expect(result.deductions.pf).toBe(6000);   // 12% of 50000
      expect(result.deductions.tds).toBe(8000);  // 10% of 80000
      // 50000/30 * 2 = 3333.33 -> 3333
      expect(result.deductions.unpaidLeaveDeduction).toBe(3333);
      expect(result.totalDeductions).toBe(6000 + 8000 + 3333 + 1000); // 18333
      expect(result.netPay).toBe(80000 - 18333); // 61667
    });

    it('ensures net pay does not drop below 0', () => {
      const result = computeFullPayroll({
        baseSalary: 1000,
        allowances: { hra: 0, medical: 0, special: 0, performanceBonus: 0 },
        taxPercentage: 50,
        pfPercentage: 50,
        otherDeductions: 5000,
      });
      expect(result.netPay).toBe(0);
    });
  });
});
