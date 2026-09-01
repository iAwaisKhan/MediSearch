import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  preferredLang: 'en' | 'hi';
  isActive: boolean;
  lastLogin?: Date | null;
  passwordChangedAt?: Date;
  matchPassword(entered: string): Promise<boolean>;
  changedPasswordAfter(jwtTimestamp: number): boolean;
  getSignedJWT(): string;
}
