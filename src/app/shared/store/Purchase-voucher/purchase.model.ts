export interface PurchaseVoucherDetail{
    id: number;
    poNumber:string;
    voucherDate:string;
    supplierId:number;
    otherCharges:number;
  }
  export interface ProductDetail{
    purchaseOrderId?:number;
    productDescription: string;
    hsnCode:number | null;
    quantity:number;
    rate:number;
    amount:number;
    
    
    // 
  }
  
  
  export interface PurchaseModel{
    id: number;
    poNumber:string;
    voucherDate:string;
    otherCharges:number;
    supplierId:number;
    purchaseOrderId:number;
    productDescription: string;
    hsnCode:number;
    quantity:number;
    rate:number;
    amount:number;
    details: ProductDetail[];
    // productDescription:string;

  }
export function createPurchaseModel({
  id= 0,
  poNumber="",
  voucherDate="",
  supplierId=0,
  otherCharges=0,
  details=[]
  
}: Partial< PurchaseModel>) {
  return {
    id,
    poNumber,
    voucherDate,
    supplierId,
    otherCharges,
    details,
    

    
  } as  PurchaseModel;
}