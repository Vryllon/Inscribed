import { Model, Document } from 'mongoose';

export interface User {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  created_at: Date;
  last_login: Date;
  verifed: boolean;
  locked: boolean;
  login_attempts: number;
}

export interface UserDocument extends User, Document {}

export type UserModel = Model<UserDocument>;
