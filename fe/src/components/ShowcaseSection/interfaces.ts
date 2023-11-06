export interface Category {
  id: string;
  title: string;
  description: string;
  imgPath: string;
  type?: string;
  parent?: string;
  adress?: string;
  categories?: Category[];
}
