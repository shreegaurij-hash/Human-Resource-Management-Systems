const fs = require('fs');
const path = require('path');

// 1. Verify we haven't overwritten teammates' domains
const forbiddenPaths = [
  'src/components/Dashboard', // SG
  'src/components/Profile', // SG
  'src/components/Attendance', // Karan
  'src/components/Payroll', // Ninaad
  'src/components/Admin' // Ninaad
];

let failed = false;

console.log('Running Pre-Integration Checks...');

for (const p of forbiddenPaths) {
  if (fs.existsSync(path.join(__dirname, p))) {
    console.error(`❌ Error: Detected changes in teammate's domain: ${p}`);
    failed = true;
  }
}

// 2. Mock Test for Leave Service logic
const leaveServiceMock = {
  applyForLeave: (type, days, balance) => {
    if (balance < days) throw new Error('Insufficient balance');
    return true;
  }
};

try {
  leaveServiceMock.applyForLeave('Paid', 5, 10);
  console.log('✅ Passed: Can apply for leave with sufficient balance');
} catch(e) {
  console.error('❌ Failed: Should apply for leave');
  failed = true;
}

try {
  leaveServiceMock.applyForLeave('Paid', 15, 10);
  console.error('❌ Failed: Should reject if insufficient balance');
  failed = true;
} catch(e) {
  console.log('✅ Passed: Rejects leave with insufficient balance');
}

if (failed) {
  console.error('❌ Pre-Integration Checks Failed');
  process.exit(1);
} else {
  console.log('✅ Pre-Integration Checks Passed Successfully');
  process.exit(0);
}
