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
  pickedApplications?: Application[];
  ownerOf?: Record<string, boolean>;
};

export interface Category {
  id: string;
  title: string;
  description: string;
  imgPath: string;
  type?: string;
  parent?: string;
  adress?: string;
  categories?: Category[];
}
