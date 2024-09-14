export interface PrimaryColor {
  name: string;
}

export function createPrimaryColorModel({
  name = ''
}: Partial<PrimaryColor>) {
  return {
    name,
  } as PrimaryColor;
}

export interface PrimaryColorResponse {
  id: number;
  name: string;
  createdOn: Date;
  modifiedOn: Date;
  createdBy: number;
  modifiedBy: number;
  isDeleted: boolean;
}

export function createPrimaryColorResponseModel({
  id = 0,
  name = '',
  createdOn = new Date(),
  modifiedOn = new Date(),
  createdBy = 0,
  modifiedBy = 0,
  isDeleted = false,

}: Partial<PrimaryColorResponse>) {
  return {
    id,
    name,
    createdOn,
    modifiedOn,
    createdBy,
    modifiedBy,
    isDeleted,
  } as PrimaryColorResponse;
}
