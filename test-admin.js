const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findUnique({
    where: { email: 'hr.admin01@dayflow.com' }
  });
  console.log(admin);
}
main();
