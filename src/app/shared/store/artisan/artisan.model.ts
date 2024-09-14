export interface Artisan {
  id:number,
  name: string;
}

export function createArtisanModel({
  id = 0,
  name = ''
}: Partial<Artisan>) {
  return {
    id,
    name,
  } as Artisan;
}

export interface ArtisanResponse {
  id: number;
  name: string;
  createdOn: Date;
  modifiedOn: Date;
  createdBy: number;
  modifiedBy: number;
  isDeleted: boolean;
}

export function createArtisanResponseModel({
  id = 0,
  name = '',
  createdOn = new Date(),
  modifiedOn = new Date(),
  createdBy = 0,
  modifiedBy = 0,
  isDeleted = false,

}: Partial<ArtisanResponse>) {
  return {
    id,
    name,
    createdOn,
    modifiedOn,
    createdBy,
    modifiedBy,
    isDeleted,
  } as ArtisanResponse;
}

