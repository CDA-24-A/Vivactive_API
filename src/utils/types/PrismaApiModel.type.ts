import { File as FileModel, Resource as ResourceModel } from '@prisma/client';

export interface CitizenType
  extends Omit<
    ResourceModel,
    'id' | 'category' | 'categoryId' | 'createdAt' | 'updatedAt'  | 'fileId' | 'banner' | 'bannerId' | 'file'
  > {
  file?: Omit<FileModel, 'id' | 'resources'> | null;
}

export type FileType = Omit<FileModel, 'id' | 'resources'>;


