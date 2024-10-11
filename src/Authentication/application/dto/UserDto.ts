import { AutoMap } from '@automapper/classes';

export class UserDto {
  @AutoMap()
  googleId: string;
  @AutoMap()
  id?: string;
  @AutoMap()
  email: string;
  @AutoMap()
  firstName: string;
  @AutoMap()
  lastName: string;
  @AutoMap()
  password: string;
  @AutoMap()
  lastLogin: Date;
  @AutoMap()
  createdAt: Date;
  @AutoMap()
  cellphoneNumber?: string;
}
