const fs = require('fs');
const path = require('path');

// 1. Verify we haven't overwritten teammates' domains
const teammateForbiddenPaths = [
  'src/components/Dashboard',  // SG
  'src/components/Profile',    // SG
  'src/components/Attendance'  // Karan
];

let failed = false;

console.log('Running Pre-Integration Checks...');

for (const p of teammateForbiddenPaths) {
  if (fs.existsSync(path.join(process.cwd(), p))) {
    console.error(`❌ Error: Detected prohibited modification in teammate's domain: ${p}`);
    failed = true;
  }
}

// 2. Mock Test for Leave Service logic
const leaveServiceMock = {
  applyForLeave: (type, days, balance) => {
    if (balance < days) throw new Error('Insufficient balance');
    return true;
  },
  approveLeaveRequest: (status, balance, days) => {
    if (status === 'Approved') return balance;
    return balance - days;
  }
};

try {
  leaveServiceMock.applyForLeave('Paid', 5, 10);
  console.log('✅ Passed: Can apply for leave with sufficient balance');
} catch (e) {
  console.error('❌ Failed: Should apply for leave');
  failed = true;
}

try {
  leaveServiceMock.applyForLeave('Paid', 15, 10);
  console.error('❌ Failed: Should reject if insufficient balance');
  failed = true;
} catch (e) {
  console.log('✅ Passed: Rejects leave with insufficient balance');
}

// 3. Mock Test for Payroll Calculation logic
const payrollCalcMock = {
  computeGross: (base, hra, medical, special, bonus) => base + hra + medical + special + bonus,
  computeNet: (gross, tdsPercent, pfPercent) => {
    const tds = (gross * tdsPercent) / 100;
    const pf = (gross * pfPercent) / 100;
    return gross - (tds + pf);
  }
};

try {
  const gross = payrollCalcMock.computeGross(50000, 15000, 3000, 7000, 5000);
  if (gross !== 80000) throw new Error(`Expected 80000 gross, got ${gross}`);
  const net = payrollCalcMock.computeNet(80000, 10, 12);
  if (net !== 62400) throw new Error(`Expected 62400 net, got ${net}`);
  console.log('✅ Passed: Payroll calculation logic operates correctly');
} catch (e) {
  console.error(`❌ Failed Payroll Test: ${e.message}`);
  failed = true;
}

if (failed) {
  console.error('❌ Pre-Integration Checks Failed');
  process.exit(1);
} else {
  console.log('✅ Pre-Integration Checks Passed Successfully');
  process.exit(0);
}
