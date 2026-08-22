const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ take: 5 });
  
  if (users.length === 0) {
    console.log("No users found.");
    return;
  }

  const types = ["PAID", "SICK", "UNPAID"];
  const reasons = ["Personal reason", "Not feeling well", "Family emergency", "Vacation"];

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    
    // create a pending leave
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + (i * 2) + 1);
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 4) + 1);

    await prisma.leaveRequest.create({
      data: {
        userId: user.id,
        type: types[i % types.length],
        startDate: startDate,
        endDate: endDate,
        reason: reasons[i % reasons.length],
        status: "PENDING"
      }
    });
    console.log(`Created leave request for ${user.name}`);
  }
}

main();
