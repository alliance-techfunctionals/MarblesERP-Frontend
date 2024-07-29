import { FormControl } from '@angular/forms';

export interface CustomOrderModel {
  id: number;
  masterOrderId: number;
  orderNumber: string;
  orderDate: string;
  orderDescription: string;
  pocId: number;
  supplierId: number;
  productComments: string;
  edd: Date; // expected date of delivery

  // columns for ag-grid
  supplierName: string;
  pocName: string;
}


export function createCustomOrderModel({
  id = 0,
  masterOrderId = 0,
  orderNumber = '',
  orderDate = '',
  orderDescription = '',
  pocId = 0,
  supplierId = 0,
  productComments = '',
  edd = new Date(),
}: Partial<CustomOrderModel>) {
  return {
    id,
    masterOrderId,
    orderNumber,
    orderDate,
    orderDescription,
    pocId,
    supplierId,
    productComments,
    edd, // expected date of delivery
  } as CustomOrderModel;
}

export interface CustomOrderForm {
  id: FormControl<number>;
  masterOrderId: FormControl<number>;
  orderDate: FormControl<string>;
  orderDescription: FormControl<string>;
  supplierId: FormControl<number>;
  pocId: FormControl<number>;
  orderNumber: FormControl<string>;
  edd: FormControl<Date>;
}
