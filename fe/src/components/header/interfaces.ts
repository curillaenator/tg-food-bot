import type { UserCredential } from 'firebase/auth';

export interface HeaderProps {
  signOut: () => Promise<void>;
  authWith: {
    google: () => Promise<UserCredential>;
    apple: () => Promise<UserCredential>;
  };
}
