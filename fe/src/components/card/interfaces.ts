import type { ShowcaseItem } from '../../store';

export interface CardProps extends Partial<ShowcaseItem> {
  imgPath: string;
  to?: string;
  likes?: number;
  onMenuItemRemove?: (serviceId: string, itemId: string) => void;
}
