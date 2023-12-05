import type { Category, Item, Service } from '../../shared/interfaces';

type FromItem = Partial<Pick<Item, 'price' | 'qty'>>;
type FromService = Partial<Pick<Service, 'workHours' | 'zone' | 'isActive' | 'adress'>>;

export interface CardProps extends Omit<Category, 'categories'>, FromService, FromItem {
  to?: string;
  onMenuItemRemove?: (serviceId: string, itemId: string) => void;
}
