import { faker } from '@faker-js/faker';

interface InviteInput {
  demoCitizenId: string;
  otherCitizenIds: string[];
  ressourceIds: string[];
  count?: number;
}

export function generateInvites({
  demoCitizenId,
  otherCitizenIds,
  ressourceIds,
  count = 10,
}: InviteInput) {
  if (otherCitizenIds.length === 0) {
    throw new Error(
      'Il faut au moins un autre citoyen pour générer les invitations',
    );
  }

  return Array.from({ length: count }).map((_, i) => {
    const isDemoSender = i % 2 === 0;
    const other = faker.helpers.arrayElement(otherCitizenIds);

    return {
      senderId: isDemoSender ? demoCitizenId : other,
      receverId: isDemoSender ? other : demoCitizenId,
      ressourceId: faker.helpers.arrayElement(ressourceIds),
      accept: faker.datatype.boolean(),
      createdAt: faker.date.recent({ days: 15 }),
      updatedAt: new Date(),
    };
  });
}
