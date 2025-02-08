import { Role as RoleModel, Citizen as CitizenModel } from '@prisma/client';

export interface CitizenType
  extends Omit<
    CitizenModel,
    'id' | 'password' | 'roleId' | 'createdAt' | 'updatedAt'
  > {
  role: Omit<RoleModel, 'id' | 'createdAt' | 'updatedAt'>;
}

export interface RoleType
  extends Omit<RoleModel, 'id' | 'createdAt' | 'updatedAt'> {}
