/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { CreateCitizenDto } from 'src/citizen/dto/create-citizen.dto';
import { UpdateCitizenDto } from 'src/citizen/dto/update-citizen.dto';

@Injectable()
export class ClerkService {
  private readonly clerkApiUrl = 'https://api.clerk.com/v1/users';
  private readonly clerkSecretKey = process.env.CLERK_SECRET_KEY;

  async createClerkUser(citizenData: CreateCitizenDto) {
    try {
      const response = await clerkClient.users.createUser({
        firstName: citizenData.name,
        lastName: citizenData.surname,
        emailAddress: [citizenData.email],
        password: citizenData.password,
      });
      return response;
    } catch (error) {
      console.error('Erreur Clerk:', error.response?.data || error.message);
      throw new InternalServerErrorException(
        'Erreur lors de la création dans Clerk',
      );
    }
  }

  async updateClerkUser(clerkId: string, citizenData: UpdateCitizenDto) {
    try {
      const response = await clerkClient.users.updateUser(clerkId, {
        firstName: citizenData.name,
        lastName: citizenData.surname,
        password: citizenData.password,
      });
      return response;
    } catch (error) {
      console.error('Erreur Clerk:', error.response?.data || error.message);
      throw new InternalServerErrorException(
        'Erreur lors de la mise à jour dans Clerk',
      );
    }
  }

  async getClerkUser(citizenData: CreateCitizenDto) {
    try {
      const response = await clerkClient.users.getUser(citizenData.clerkId);
      return response;
    } catch (error) {
      console.error('Erreur Clerk:', error.response?.data || error.message);
      throw new InternalServerErrorException(
        'Erreur lors de la récupération du citoyen dans Clerk',
      );
    }
  }

  async deleteClerkUser(id: string) {
    try {
      const response = await clerkClient.users.deleteUser(id);
      return response;
    } catch (error) {
      console.error('Erreur Clerk:', error.response?.data || error.message);
      throw new InternalServerErrorException(
        'Erreur lors de la récupération du citoyen dans Clerk',
      );
    }
  }
}
