import { FormControl } from '@angular/forms';

export interface PendingPaymentModel {
  id: number;
  orderNumber: string;
  customerId: number;
  shippingAddress: string;
  country: string;
  state: string;
  city: string;
  pinCode: string;
  emailAddress: string;
  salesManId: number;
  voucherId: number;
  comments: string;
  isFullPayment: boolean;
  paymentStatus: number;
  createdOn: Date;
  isDeleted: boolean;

  // columns for ag-grid
  customerName: string;
  paymentStatusName: string;
}
