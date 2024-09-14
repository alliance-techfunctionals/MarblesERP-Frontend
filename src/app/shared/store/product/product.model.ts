export interface Product {
  name: string;
}

export function createProductModel({
  name = ''
}: Partial<Product>) {
  return {
    name,
  } as Product;
}

export interface ProductResponse {
  id: number;
  name: string;
  createdOn: Date;
  modifiedOn: Date;
  createdBy: number;
  modifiedBy: number;
  isDeleted: boolean;
}

export function ProductResponseModel({
  id = 0,
  name = '',
  createdOn = new Date(),
  modifiedOn = new Date(),
  createdBy = 0,
  modifiedBy = 0,
  isDeleted = false,

}: Partial<ProductResponse>) {
  return {
    id,
    name,
    createdOn,
    modifiedOn,
    createdBy,
    modifiedBy,
    isDeleted,
  } as ProductResponse;
}
