import BaseGuidRepository from 'Base/repository/BaseGuidRepository';
import User from '../../domain/models/User';

export default abstract class UserRepository extends BaseGuidRepository<User> {
  abstract findUserByEmail: (email: string) => Promise<User | null>;
  abstract updateLastLogin: (id: string) => Promise<boolean>;
}
