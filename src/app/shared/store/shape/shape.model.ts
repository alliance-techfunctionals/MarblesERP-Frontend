export interface Shape {
  name: string;
}

export function createShapeModel({
  name = ''
}: Partial<Shape>) {
  return {
    name,
  } as Shape;
}

export interface ShapeResponse {
  id: number;
  name: string;
  createdOn: Date;
  modifiedOn: Date;
  createdBy: number;
  modifiedBy: number;
  isDeleted: boolean;
}

export function ShapeResponseModel({
  id = 0,
  name = '',
  createdOn = new Date(),
  modifiedOn = new Date(),
  createdBy = 0,
  modifiedBy = 0,
  isDeleted = false,

}: Partial<ShapeResponse>) {
  return {
    id,
    name,
    createdOn,
    modifiedOn,
    createdBy,
    modifiedBy,
    isDeleted,
  } as ShapeResponse;
}
