import { AutoMap } from '@automapper/classes';
import { UserDto } from './UserDto';

export class LoginResponseDto {
  @AutoMap()
  accessToken: string;
  @AutoMap(() => UserDto)
  user: UserDto;
}
