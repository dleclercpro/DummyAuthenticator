import { UserType } from '../constants';

export interface UserJSON {
  type: UserType,
  email: string,
  favorited: boolean,
  banned: boolean,
  confirmed: boolean,
}