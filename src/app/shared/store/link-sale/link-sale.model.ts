import { FormControl } from "@angular/forms";

export interface LinkSale {
    saleMasterId: number;
    voucherId: number;
    invoiceNo: string;
}

export function createLinkSaleModel({
    saleMasterId = 0,
    voucherId = 0,
    invoiceNo = ""
  }: Partial<LinkSale>) {
    return {
      saleMasterId,
      voucherId,
      invoiceNo
    } as LinkSale;
  }

export interface LinkSaleVoucher {
    saleMasterId: FormControl<number>;
    voucherId: FormControl<number>;
    invoiceNo: FormControl<string>;
}