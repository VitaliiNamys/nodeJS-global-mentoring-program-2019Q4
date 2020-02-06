export interface IGroup {
  id: string;
  name: string;
  permissions: Permisson[];
}

export interface IGroupDTO {
  name: string;
  permissions: Permisson[];
}

export type Permisson = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES';