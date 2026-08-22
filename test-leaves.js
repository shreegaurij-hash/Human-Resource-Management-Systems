const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const leaves = await prisma.leaveRequest.findMany({ include: { user: true } });
  console.log("Leaves count:", leaves.length);
  if (leaves.length > 0) console.log(leaves[0]);
}
main();
