export interface CardProps {
  id: string;
  imgPath: string;
  title: string;
  description: string;
  price: string;
  type: string;
  onSelect: () => void;
}
