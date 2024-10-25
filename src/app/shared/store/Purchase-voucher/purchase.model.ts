export interface purchaseVoucherDetail{
    id: number;
    invoiceNo:string;
    voucherDate:string;
    supplierId:number;
  }
  export interface productDetail{
    masterId:number;
    productDescription: string;
    hsnCode:number;
    quantity:number;
    rate:number;
    amount:number
    otherCharges:number;
    otherDetails:string;
    // 
  }
  
  
  export interface PurchaseModel{
    id: number;
    invoiceNo:string;
    voucherDate:string;
    supplierId:number;
    masterId:number;
    productDescription: string;
    hsnCode:number;
    quantity:number;
    rate:number;
    amount:number
    otherCharges:number;
    otherDetails:string;
    details: productDetail[];
    // productDescription:string;

  }
export function createPurchaseModel({
  id= 0,
  invoiceNo="",
  voucherDate="",
  supplierId=0,
  details=[]
  
}: Partial< PurchaseModel>) {
  return {
    id,
    invoiceNo,
    voucherDate,
    supplierId,
    details,
    

    
  } as  PurchaseModel;
}