export interface Design {
  id:number,
  name: string;
}

export function createDesignModel({
  id = 0,
  name = ''
}: Partial<Design>) {
  return {
    id,
    name,
  } as Design;
}

export interface DesignResponse {
  id: number;
  name: string;
  createdOn: Date;
  modifiedOn: Date;
  createdBy: number;
  modifiedBy: number;
  isDeleted: boolean;
}

export function createDesignResponseModel({
  id = 0,
  name = '',
  createdOn = new Date(),
  modifiedOn = new Date(),
  createdBy = 0,
  modifiedBy = 0,
  isDeleted = false,

}: Partial<DesignResponse>) {
  return {
    id,
    name,
    createdOn,
    modifiedOn,
    createdBy,
    modifiedBy,
    isDeleted,
  } as DesignResponse;
}

