import type { ShowcaseItem } from '../../store';

export interface CardProps extends Partial<ShowcaseItem> {
  imgPath: string;
  to?: string;
  likes?: number;
  onIncrease?: (itemId: string) => void;
  onDecrease?: (itemId: string) => void;
}
