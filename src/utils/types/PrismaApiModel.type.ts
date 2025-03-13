import { Role as RoleModel, Citizen as CitizenModel, Comment as CommentModel, Ressource as ResourceModel} from '@prisma/client';


export interface CitizenType
  extends Omit<
    CitizenModel,
    'id' | 'password' | 'roleId' | 'createdAt' | 'updatedAt'
  > {
  role: Omit<RoleModel, 'id' | 'createdAt' | 'updatedAt'>;
}

export type RoleType = Omit<RoleModel, 'id' | 'createdAt' | 'updatedAt'>;


export interface RessourceType
  extends Omit<
    ResourceModel, 
    'id' | 'category' | 'categoryId' | 'createdAt' | 'updatedAt'  | 'fileId' | 'banner' | 'bannerId' | 'file'
  > {}

  export interface CommentType extends Omit<CommentModel,'id' | 'citizenId' | 'updatedAt'> {
    citizen: Omit<CitizenType, 'role' | 'createdAt' | 'updatedAt' | 'password' | 'roleId' | 'email' | 'id' | 'roleId' | 'Comment'>;
  } 