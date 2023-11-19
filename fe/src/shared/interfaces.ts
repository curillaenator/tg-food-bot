export type ApplicationStatus = 'open' | 'accepted' | 'process' | 'done';

export interface Application {
  id?: string;
  customer: string; // uid
  placed: string;
  status: ApplicationStatus;
  executor: string | null; // uid
  content: Record<string, Record<string, number>>;
  expectedTime: string;
}

export type Role = 'business' | 'manager' | 'employee' | 'admin' | 'pixpax';

export type User = {
  id: string;
  name?: string;
  avatar?: string;
  email?: string;
  tel?: string;
  adress?: string;
  role?: Role;
  ownerOf?: Record<string, boolean>;
  // orders?: Order['id'];
};
