import { Category } from '../../shared/interfaces';

export interface ShowcaseSectionProps extends Category {
  onMenuAdd?: (serviceId: string) => void;
  onMenuItemRemove?: (serviceId: string, itemId: string) => void;
}
