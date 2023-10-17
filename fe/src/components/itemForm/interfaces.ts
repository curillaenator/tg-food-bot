export interface CustomOption {
  label: string;
  value: string;
}

export interface ItemFormValuesType {
  itemService: CustomOption;
  itemTitle: string;
  itemDescription: string;
  itemWaitTime: string;
  itemPrice: string;
  itemImage: FileList;
}
