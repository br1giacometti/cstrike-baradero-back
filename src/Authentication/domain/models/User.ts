import { AutoMap } from '@automapper/classes';

export default class User {
  @AutoMap()
  firstName: string;
  @AutoMap()
  lastName: string;
  @AutoMap()
  email: string;
  @AutoMap()
  password: string;
  @AutoMap()
  createdAt: Date;
  @AutoMap()
  lastLogin: Date;
  @AutoMap()
  googleId: string;
  @AutoMap()
  id?: string;
  @AutoMap()
  cellphoneNumber?: string;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    createdAt: Date,
    lastLogin: Date,
    googleId: string,
    cellphoneNumber?: string,
    id?: string,
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.lastLogin = lastLogin;
    this.googleId = googleId;
    this.cellphoneNumber = cellphoneNumber;
    this.id = id;
  }
}
