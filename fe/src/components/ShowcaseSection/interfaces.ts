import type { Category, Service, Item } from '../../shared/interfaces';

type FromItem = Partial<Pick<Item, 'price' | 'qty'>>;
type FromService = Partial<Pick<Service, 'workHours' | 'zone' | 'isActive' | 'adress'>>;

export interface ShowcaseSectionProps extends Omit<Category, 'categories'>, FromService, FromItem {
  categories?: Category[] | Service[] | Item[];
  onMenuAdd?: (serviceId: string) => void;
  onMenuItemRemove?: (serviceId: string, itemId: string) => void;
  onRemoveService?: (serviceId: string) => void;
}
