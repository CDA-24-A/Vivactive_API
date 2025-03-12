import { Role as RoleModel, Citizen as CitizenModel, Comment as CommentModel } from '@prisma/client';

export interface CitizenType
  extends Omit<
    CitizenModel,
    'id' | 'password' | 'roleId' | 'createdAt' | 'updatedAt'
  > {
  role: Omit<RoleModel, 'id' | 'createdAt' | 'updatedAt'>;
}

export interface RoleType
  extends Omit<RoleModel, 'id' | 'createdAt' | 'updatedAt'> {}

  export interface CommentType extends Omit<CommentModel,'id' | 'citizenId' | 'updatedAt'> {
    citizen: Omit<CitizenType, 'role' | 'createdAt' | 'updatedAt' | 'password' | 'roleId' | 'email' | 'id' | 'roleId' | 'Comment'>;
  } 