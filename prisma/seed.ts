import { PrismaClient } from '@prisma/client';
import { createCitizen } from './data/citizen';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
    },
  });
  const moderator = await prisma.role.upsert({
    where: { name: 'MODERATOR' },
    update: {},
    create: {
      name: 'MODERATOR',
    },
  });

  const user = await prisma.role.upsert({
    where: { name: 'USER' },
    update: {},
    create: {
      name: 'USER',
    },
  });
  console.log({ admin, moderator });

  void createCitizen([admin, moderator, user]);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
