// prisma/seed/resourceType.ts

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const typeRessource = [
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
  await prisma.typeRessource.createMany({
    data: typeRessource,
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect();
  });
