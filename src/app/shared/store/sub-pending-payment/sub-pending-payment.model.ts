import { FormControl } from "@angular/forms";

export interface SubPendingPaymentModel {
  id: number;
  masterOrderId: number;
  paymentDueDate: Date;
  amount: number;
  ccyCode: string;
  status: boolean;
  createdOn: Date;
  isDeleted: boolean;
  comments: string;
}


export function createSubPendingPaymentModel({
  id = 0,
  masterOrderId = 0,
  paymentDueDate = new Date(),
  amount = 0,
  ccyCode = '',
  status = false,
  comments = '',
  isDeleted = false,
  createdOn = new Date(),
}: Partial<SubPendingPaymentModel>) {
  return {
    id,
    masterOrderId,
    paymentDueDate,
    amount,
    ccyCode,
    status,
    comments,
    isDeleted,
    createdOn
  } as SubPendingPaymentModel;
}

export interface SubPendingPaymentForm {
  id: FormControl<number>;
  masterId: FormControl<number>;
  orderNo: FormControl<string>;
  amount: FormControl<number>;
  currency: FormControl<string>;
  status: FormControl<string>;
  comments: FormControl<string>;
  paymentDueDate: FormControl<string>;
}