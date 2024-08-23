import { FormControl } from "@angular/forms";

export interface InventoryModel {
  masterId: number,
  id: number,
  qualityId: number,
  designId: number,
  quantity: number,
  colorCode: string,
  size: string,
  supplierId: number,
  isDeleted: boolean,
  createdOn: Date,
  file: File,
  fileKey: string,
  name: string,
  isNormalUpdate: boolean

  // columns for ag-grid
  qualityName: string,
  designName: string,
  supplierName: string
}

export interface CheckInventoryModel{
  quality: number,
  design: number,
  colorCode: string,
  size: string,
  firstMatchingId: number,
  totalQuantity: number,
  supplierId: number,
}

export function createCheckInventoryModel({
  quality = 0,
  design = 0,
  colorCode = '',
  size = '',
  supplierId = 0
}: Partial<CheckInventoryModel>) {
  return {
    quality,
    design,
    colorCode,
    size,
    supplierId
  } as CheckInventoryModel;
}

export function createInventoryModel({
  masterId = 0,
  id = 0,
  qualityId = 0,
  designId = 0,
  quantity = 0,
  colorCode = '',
  size = '',
  file = new File([], ''),
  name = '',
  fileKey = '',
  supplierId = 0,
  isNormalUpdate = true,
}: Partial<InventoryModel>) {
  return {
    masterId,
    id,
    qualityId,
    designId,
    quantity,
    colorCode,
    size,
    file,
    name,
    fileKey,
    supplierId,
    isNormalUpdate,
  } as InventoryModel;
}
/***** Below Code were used for Accordian *****/

// export interface InventoryModel {
//   masterId: number,
//   id: number,
//   qualityId: number,
//   designId: number,
//   quantity: number,
//   colorCode: string,
//   size: string,
//   details: InventoryDetailModel[],
//   isDeleted: boolean,
//   createdOn: Date,
//   file: File,
//   name: string
// }

// interface InventoryDetailModel {
//   masterId: number;
//   colorCode: string;
//   size: string;
//   quantity: number;
//   fileKey: string | null;
//   name: string | null;
//   id: number;
//   createdOn: Date;
//   modifiedOn: Date;
//   createdBy: string;
//   modifiedBy: string;
//   isDeleted: boolean;
// }


// export function createInventoryDetailModel({
//   masterId = 0,
//   colorCode = '',
//   size = '',
//   quantity = 0,
//   fileKey = '',
//   id = 0,
//   createdOn = new Date(),
//   modifiedOn = new Date(),
//   createdBy = '',
//   modifiedBy = '',
//   isDeleted = false,
// }: Partial<InventoryDetailModel>) {
//   return {
//     masterId,
//     id,
//     colorCode,
//     size,
//     quantity,
//     fileKey,
//     createdOn,
//     modifiedOn,
//     createdBy,
//     modifiedBy,
//     isDeleted
//   } as InventoryDetailModel;
// }

// export function createInventoryModel({
//   // MasterId = 0,
//   id = 0,
//   qualityId = 0,
//   designId = 0,
//   quantity = 0,
//   colorCode = '',
//   size = '',
//   file = new File([], ''),
//   name = '',
//   details = [createInventoryDetailModel({})],
// }: Partial<InventoryModel>) {
//   return {
//     // MasterId,
//     id,
//     qualityId,
//     designId,
//     quantity,
//     colorCode,
//     size,
//     file,
//     name,
//     details
//   } as InventoryModel;
// }

export interface inventoryForm {
  masterId: FormControl<number>,
  id: FormControl<number>,
  quality: FormControl<string>,
  design: FormControl<string>,
  quantity: FormControl<number>,
  color: FormControl<string>,
  size: FormControl<string>,
  file: FormControl<File | null>,
  name: FormControl<string>,
  supplierId: FormControl<number>
}