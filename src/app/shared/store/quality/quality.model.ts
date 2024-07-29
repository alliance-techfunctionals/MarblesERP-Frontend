export interface Quality {
  id:number,
  name: string;
}

export function createQualityModel({ name = "", id = 0 }: Partial<Quality>) {
  return {
    id,
    name,
  } as Quality;
}

export interface QualityResponse {
  id: number;
  name: string;
  createdOn: Date;
  modifiedOn: Date;
  createdBy: number;
  modifiedBy: number;
  isDeleted: boolean;
}

export function createQualityResponse({
  id = 0,
  name = "",
  createdOn = new Date(),
  modifiedOn = new Date(),
  createdBy = 0,
  modifiedBy = 0,
  isDeleted = false,
}: Partial<QualityResponse>) {
  return {
    id,
    name,
    createdOn,
    modifiedOn,
    createdBy,
    modifiedBy,
    isDeleted,
  } as QualityResponse;
}
