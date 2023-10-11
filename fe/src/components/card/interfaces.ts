export interface CardProps {
  id: string;
  imgPath: string;
  title: string;
  description: string;
  price: string;
  type: string;
  waitTime: string;
  likes: number;
  qty: number;
  onIncrease: (itemId: string) => void;
  onDecrease: (itemId: string) => void;
}
