export interface CustomOption {
  label: string;
  value: string;
}

export interface ServiceFormValuesType {
  serviceTitle: string;
  serviceAddres: string;
  serviceDescription: string;
  serviceImage: FileList;
  serviceCategory: CustomOption;
  serviceSubcategory: CustomOption;
}
