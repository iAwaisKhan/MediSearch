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

export interface ISearchHistory extends Document {
  user: any;
  query: string;
  type: 'search' | 'compare';
  resultCount: number;
}

export interface IMedicineCache extends Document {
  key: string;
  data: any;
  hitCount: number;
  lastAccessed: Date;
}
