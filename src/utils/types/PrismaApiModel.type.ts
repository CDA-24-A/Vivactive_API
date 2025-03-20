import {
  Role as RoleModel,
  Citizen as CitizenModel,
  Comment as CommentModel,
  File as FileModel,
  Ressource as ResourceModel,
  Step as StepModel,
  Progression as ProgressionModel,
, Category as CategoryModel} from '@prisma/client';

export interface CitizenType
  extends Omit<
    CitizenModel,
    'id' | 'password' | 'roleId' | 'createdAt' | 'updatedAt' | 'clerkId'
  > {
  role: Omit<RoleModel, 'id' | 'createdAt' | 'updatedAt'>;
}

export type RoleType = Omit<RoleModel, 'id' | 'createdAt' | 'updatedAt'>;


export interface RessourceType
  extends Omit<
    ResourceModel,
    | 'id'
    | 'category'
    | 'categoryId'
    | 'createdAt'
    | 'updatedAt'
    | 'fileId'
    | 'banner'
    | 'bannerId'
    | 'file'
  > {
  file?: Omit<FileModel, 'id' | 'resources'> | null;
  step: Array<Omit<StepModel, 'id' | 'ressourceId'> | null>;
}

export type FileType = Omit<FileModel, 'id' | 'resources'>;

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
    | 'roleId'
    | 'Comment'
  >;
}
