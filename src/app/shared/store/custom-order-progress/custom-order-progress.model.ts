import { FormControl } from "@angular/forms";

export interface CustomOrderProgressModel {
  id: number;
  saleDetailId: number;
  image: File | null;
  imageUrl: string;
  comments: string;
  createdOn: Date;
}


export function createCustomOrderProgressModel({
  id = 0,
  saleDetailId = 0,
  image = new File([], ''),
  imageUrl = '',
  comments = '',
}: Partial<CustomOrderProgressModel>) {
  return {
    id,
    saleDetailId,
    image,
    imageUrl,
    comments,
  } as CustomOrderProgressModel;
}

export interface CustomOrderProgressForm{
  id: FormControl<number>;
  file: FormControl<File | null>;
  fileUrl: FormControl<string>;
  saleDetailId: FormControl<number>;
  comments: FormControl<string>;
}