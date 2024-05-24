import { UserType } from '../constants';

export interface UserJSON {
  type: UserType,
  email: string,
  banned: boolean,
  confirmed: boolean,
}