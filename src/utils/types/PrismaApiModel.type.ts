import {
  Role as RoleModel,
  Citizen as CitizenModel,
  Comment as CommentModel,
} from '@prisma/client';

export interface CitizenType
  extends Omit<
    CitizenModel,
    'id' | 'password' | 'roleId' | 'createdAt' | 'updatedAt'
  > {
  role: Omit<RoleModel, 'id' | 'createdAt' | 'updatedAt'>;
}

export type RoleType = Omit<RoleModel, 'id' | 'createdAt' | 'updatedAt'>;

export interface CommentType
  extends Omit<CommentModel, 'id' | 'citizenId' | 'updatedAt'> {
  citizen: Omit<
    CitizenType,
    | 'role'
    | 'createdAt'
    | 'updatedAt'
    | 'password'
    | 'roleId'
    | 'email'
    | 'id'
    | 'Comment'
    | 'sentInvites'
    | 'recivedInvites'
  >;
}

export interface InviteType {
  accept: boolean;
  createdAt: Date;
  sender: {
    name: string;
    surname: string;
  };
  recever: {
    name: string;
    surname: string;
  };
}


export interface MessageType
  extends Omit<CommentModel, 'id' | 'citizenId' | 'updatedAt'> {
  citizen: Omit<
    CitizenType,
    | 'role'
    | 'createdAt'
    | 'updatedAt'
    | 'password'
    | 'roleId'
    | 'email'
    | 'id'
    | 'Comment'
  >;
}
