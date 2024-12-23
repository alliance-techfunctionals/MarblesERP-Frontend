import { FormControl } from "@angular/forms";

export interface InventoryModel {
  id: number,
  createdOn: Date,
  modifiedOn: Date,
  createdBy: number,
  modifiedBy: number,
  isDeleted: true,
  supplierId: number,
  size: string,
  qualityType: string,
  product: string,
  productCode: string,
  shape: string,
  primaryStone: string,
  design: string,
  primaryColor: string,
  stonesNb: number | null;
  costPrice: number | null,
  sellingPrice: number,
  isSold: boolean,
  soldDate: Date,
  guid?: string,
  quantity:number,
  productNameCode: string,
  isTaxExempted:boolean
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
  supplierId = 0,
  

  
}: Partial<CheckInventoryModel>) {
  return {
    quality,
    design,
    colorCode,
    size,
    supplierId,
  } as CheckInventoryModel;
}

export function createInventoryModel({
  id= 0,
  size= "",
  qualityType= "",
  productCode= "",
  shape= "",
  product="",
  primaryStone= "",
  design="",
  primaryColor= "",
  stonesNb= 0,
  supplierId= 0,
  isSold= false,
  soldDate=new Date(),
  costPrice= 0,
  sellingPrice= 0,
  quantity=0,
  productNameCode='',
  guid= '',
  isTaxExempted=false
}: Partial<InventoryModel>) {
  return {
    id,
    size,
    qualityType,
    product,
    supplierId,
    productCode,
    shape,
    primaryStone,
    design,
    primaryColor,
    stonesNb,
    costPrice,
    sellingPrice,
    isSold,
    soldDate,
    quantity,
    productNameCode,
    guid,
    isTaxExempted

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
  guid:FormControl<string>,
  id: FormControl<number>,
  supplierId: FormControl<number>,
  size: FormControl<string>,
  qualityType: FormControl<string>,
  product: FormControl<string>,
  productCode: FormControl<string>,
  shape: FormControl<string>,
  primaryStone: FormControl<string>,
  design: FormControl<string>,
  primaryColor: FormControl<string>,
  stonesNb: FormControl<number | null>,
  costPrice: FormControl<number | null>,
  sellingPrice: FormControl<number>,
  quantity: FormControl<number>,
  isTaxExempted: FormControl<boolean>,
  // productType: FormControl<string>,
  // rate: FormControl<number>,
  // sadekaar: FormControl<number>,
  // designAmt: FormControl<number>,
  userCode: FormControl<string>,
  productNameCode: FormControl<string>,
  // qty : FormControl<number>


  // design: FormControl<string>,
  // color: FormControl<string>,
  // file: FormControl<File | null>,
  // name: FormControl<string>,
  // supplierId: FormControl<number>


}