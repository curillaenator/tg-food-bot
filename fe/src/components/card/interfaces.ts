import type { ShowcaseItem } from '../../store';

export interface CardProps extends ShowcaseItem {
  imgPath: string;
  likes: number;
  onIncrease: (itemId: string) => void;
  onDecrease: (itemId: string) => void;
}
