import { AutoMap } from '@automapper/classes';
import { User as IUserEntity } from '@prisma/client';

class UserEntity implements IUserEntity {
  @AutoMap()
  cellphoneNumber: string;
  @AutoMap()
  googleId: string;
  @AutoMap()
  id: string;
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
}

export default UserEntity;
