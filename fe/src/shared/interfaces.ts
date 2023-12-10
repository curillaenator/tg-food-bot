export type CategoryDbName = ' beverages' | 'food' | 'retail' | 'utilities';

export type ApplicationStatus = 'open' | 'accepted' | 'process' | 'done';

export type Role = 'business' | 'manager' | 'employee' | 'admin' | 'pixpax' | 'service-owner';

export type Zone = 'north' | 'south' | 'center' | 'gomart' | 'common';

export interface Application {
  id?: string;
  customer: string; // uid
  placed: string;
  status: ApplicationStatus;
  executor: string | null; // uid
  content: Record<string, Record<string, number>>;
  expectedTime: string;
}

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
  tme?: string;
  basket?: Item[];
  isAnon?: boolean;
};

export interface Category<T = string> {
  id: string;
  title: string;
  description: string;
  imgPath: string;
  type?: string;
  parent?: string;
  categories?: T[];
}

export interface Service extends Category<Item> {
  workHours: string;
  zone: Zone;
  isActive?: boolean;
  adress?: string;
}

export interface Item extends Omit<Category<string>, 'categories' | 'adress' | 'zone'> {
  price: string | number;
  qty?: number;
}

export interface SidebarItem {
  id: string;
  title: string;
  to: string;
}
