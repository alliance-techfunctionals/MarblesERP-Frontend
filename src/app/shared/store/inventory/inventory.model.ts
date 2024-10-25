import { FormControl } from "@angular/forms";

export interface InventoryModel {
  // masterId: number,
  // id: number,
  qualityId: number,
  designId: number,
  // quantity: number,
  // colorCode: string,
  // size: string,
  // supplierId: number,
  // isDeleted: boolean,
  // createdOn: Date,
  // file: File,
  // fileKey: string,
  // name: string,
  // isNormalUpdate: boolean

  // // columns for ag-grid
  // qualityName: string,
  // designName: string,
  // supplierName: string

  masterId: number,
  id: number,
  size: string,
  qualityTypeName: string,
  productName: string,
  productCode: string,
  shapeName: string,
  primaryStoneName: string,
  designName: string,
  primaryColorName: string,
  stoneNb: number,
  stonesNb: number,
  rate: number,
  sadekaar: number,
  designAmt: number,
  artisianName: string,
  artisanId: number,
  isNormalUpdate: boolean,
  isDeleted: boolean,
  createdOn: Date,
  costPrice: number,
  sellingPrice: number,
  quantity: number


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
  masterId= 0,
  id= 0,
  size= "",
  qualityTypeName= "",
  productName= "",
  productCode= "",
  shapeName= "",
  primaryStoneName= "",
  designName= "",
  primaryColorName= "",
  stoneNb= 0,
  rate= 0,
  sadekaar= 0,
  designAmt= 0,
  artisianName= '',
  artisanId= 0,
  isNormalUpdate= false,
  isDeleted= false,
  createdOn= new Date(),
  costPrice= 0,
  sellingPrice= 0,
  quantity= 0
}: Partial<InventoryModel>) {
  return {
    id,
    artisianName,
    size,
    qualityTypeName,
    productName,
    productCode,
    shapeName,
    primaryStoneName,
    designName,
    primaryColorName,
    stoneNb,
    // rate,
    // sadekaar,
    // designAmt,
    // costPrice,
    sellingPrice,
    // quantity,
    isDeleted
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
  size: FormControl<string>,
  productType: FormControl<string>,
  productName: FormControl<string>,
  productCode: FormControl<string>,
  shape: FormControl<string>,
  primaryStone: FormControl<string>,
  design: FormControl<string>,
  primaryColor: FormControl<string>,
  noOfStone: FormControl<number>,
  // rate: FormControl<number>,
  // sadekaar: FormControl<number>,
  // designAmt: FormControl<number>,
  artisanName: FormControl<string>,
  artisanId: FormControl<number>,
  cp: FormControl<number>,
  sp: FormControl<number>,
  userCode: FormControl<string>,
  pc: FormControl<string>
  // qty : FormControl<number>


  // quality: FormControl<string>,
  // design: FormControl<string>,
  // quantity: FormControl<number>,
  // color: FormControl<string>,
  // file: FormControl<File | null>,
  // name: FormControl<string>,
  // supplierId: FormControl<number>


}