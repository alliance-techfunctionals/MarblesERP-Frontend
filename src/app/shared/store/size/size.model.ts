export interface Size {
  name: string;
}

export function createSizeModel({ name = "" }: Partial<Size>) {
  return {
    name,
  } as Size;
}

export interface SizeResponse {
  id: number;
  name: string;
  createdOn: Date;
  modifiedOn: Date;
  createdBy: number;
  modifiedBy: number;
  isDeleted: boolean;
}

export function createSizeResponse({
  id = 0,
  name = "",
  createdOn = new Date(),
  modifiedOn = new Date(),
  createdBy = 0,
  modifiedBy = 0,
  isDeleted = false,
}: Partial<SizeResponse>) {
  return {
    id,
    name,
    createdOn,
    modifiedOn,
    createdBy,
    modifiedBy,
    isDeleted,
  } as SizeResponse;
}
