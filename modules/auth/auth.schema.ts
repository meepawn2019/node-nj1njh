export interface UserEntry {
  email: string;
  type: 'user' | 'admin';
  salt: string;
  passwordhash: string;
}