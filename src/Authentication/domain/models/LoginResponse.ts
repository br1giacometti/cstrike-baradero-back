import { AutoMap } from '@automapper/classes';
import User from './User';

export default class LoginResponse {
  @AutoMap()
  accessToken: string;
  @AutoMap(() => User)
  user: User;

  constructor(accesToken: string, user: User) {
    this.accessToken = accesToken;
    this.user = user;
  }
}
