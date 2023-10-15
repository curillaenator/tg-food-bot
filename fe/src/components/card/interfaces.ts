import type { ShowcaseItem } from '../../store';

export interface CardProps extends Partial<ShowcaseItem> {
  imgPath: string;
  to?: string;
  likes?: number;
  // onClick?: (itemId: ShowcaseItem) => void;
}
