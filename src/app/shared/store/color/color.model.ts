export interface Color {
  name: string;
}

export function createColorModel({
  name = ''
}: Partial<Color>) {
  return {
    name,
  } as Color;
}

export interface ColorResponse {
  id: number;
  name: string;
  createdOn: Date;
  modifiedOn: Date;
  createdBy: number;
  modifiedBy: number;
  isDeleted: boolean;
}

export function createColorResponseModel({
  id = 0,
  name = '',
  createdOn = new Date(),
  modifiedOn = new Date(),
  createdBy = 0,
  modifiedBy = 0,
  isDeleted = false,

}: Partial<ColorResponse>) {
  return {
    id,
    name,
    createdOn,
    modifiedOn,
    createdBy,
    modifiedBy,
    isDeleted,
  } as ColorResponse;
}
