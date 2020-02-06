export interface IUser {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
}

export interface IUserDTO {
  login: string;
  password: string;
  age: number;
}
