// prisma/seed/resourceType.ts

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const ressourceType = [
  {
    name: 'Article',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Vidéo',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Podcast',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Infographie',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Checklist',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Outil interactif',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function main() {
  await prisma.ressourceType.createMany({
    data: ressourceType,
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
