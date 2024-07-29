import { FormArray, FormControl } from "@angular/forms";
export interface Sale {
  id:number,
  orderNumber: string;
  clientName: string;
}

export interface temporary{
  voucher: number,
  orderNumberId: number, 
  customer: number,
  orderStatus: boolean,
  paymentStatus: number,
  orderDate: Date,
  gstInvoiceNumber: string,
  isHandCarry: boolean,
}

export interface SaleModel {
  id: number;
  voucherId: number;
  orderNumber: string;
  // client details
  clientName: string;
  emailAddressList: string[];
  mobileNumberList: string[];
  street: string;
  apartment: string;
  houseNumber: string;
  shippingCountry: string;
  country: string;
  shippingState: string;
  state: string;
  shippingCity: string;
  city: string;
  shippingPincode: string;
  pinCode: string;
  salesManId: number;
  customerId: number;
  orderStatus: number;
  paymentStatus: number;
  // product details
  details: ProductDetails[];
  isHandCarry: boolean;
  // checkout details
  isFullPayment: boolean;
  partPayment: PartPaymentDetails[];
  comments: string;
  isCustomizedOrder: boolean;
  isFreightInclusive: boolean; // added on 12-Jul-24
  isDeleted: boolean;
  createdOn: Date;
  orderDate: Date;
  gstInvoiceNumber: string;
  tracking: {
    id: number;
    masterSaleId: number;
    trackingNumber: string;
    shipmentDate: Date;
    deliveryPartnerId: number;
  };
  formattedAddress: string;

  // columns for ag-grid
  salesManName: string;
  voucherCode: string;
  customerName: string;
  orderStatusName: string;
  paymentStatusName: string;
  deliveryPartnerName: string;
}

export function createSaleModel({
  id = 0,
  voucherId = 0,
  orderNumber = "",
  clientName = "",
  mobileNumberList = [],
  emailAddressList = [],
  street = "",
  apartment = "",
  houseNumber = "",
  shippingCountry = "",
  country = "",
  shippingState = "",
  state = "",
  shippingPincode = "",
  pinCode = "",
  shippingCity = "",
  city = "",
  salesManId = 0,
  customerId = 0,
  orderStatus = 0,
  paymentStatus = 0,
  details = [],
  isHandCarry = true,
  isFullPayment = false,
  partPayment = [],
  comments = '',
  isDeleted = false,
  createdOn = new Date(),
  orderDate = new Date(),
  gstInvoiceNumber = ''
}: Partial<SaleModel>) {
  return {
    id,
    voucherId,
    orderNumber,
    clientName,
    mobileNumberList,
    emailAddressList,
    street,
    apartment,
    houseNumber,
    shippingCountry,
    country,
    shippingState,
    state,
    shippingCity,
    city,
    shippingPincode,
    pinCode,
    salesManId,
    customerId,
    orderStatus,
    paymentStatus,
    isFullPayment,
    partPayment,
    comments,
    isDeleted,
    createdOn,
    details,
    isHandCarry,
    orderDate,
    gstInvoiceNumber
  } as SaleModel;
}

export interface ProductDetails{
  id: number;
  masterId: number;
  quality: string;
  design: string;
  colour: string;
  size: string;
  quantity: number;
  amount: number;
  ccyCode: string;
  description: string;
  isCustomized: boolean;
  isFreightInclude: boolean;
  isCustomFullfilled?: boolean;
}

export interface PartPaymentDetails{
  id: number;
  masterOrderId: number;
  paymentDueDate: Date;
  amount: number;
  ccyCode: string;
  comments: string;
  status: boolean;
}

export interface SaleForm {
  id: FormControl<number>;
  voucherId: FormControl<number>;
  clientName: FormControl<string>;
  emailList: FormArray;
  mobileList: FormArray;
  street: FormControl<string>;
  apartment: FormControl<string>;
  houseNumber: FormControl<string>;
  shippingCountry: FormControl<string>;
  shippingPinCode: FormControl<string>;
  shippingState: FormControl<string>;
  shippingCity: FormControl<string>;
  salesManId: FormControl<number>;
  details: FormArray;
  paymentDetails: FormArray;
  saleComments: FormControl<string>;
}

// client detail Form
export interface ClientDetailForm{
  id: FormControl<number>,
  orderNumber: FormControl<string>,
  customerId: FormControl<number>,
  clientName: FormControl<string>,
  emailList: FormArray;
  mobileList: FormArray;
  street: FormControl<string>,
  apartment: FormControl<string>,
  houseNumber: FormControl<string>,
  shippingCountry: FormControl<string>,
  shippingState: FormControl<string>,
  shippingCity: FormControl<string>,
  shippingPinCode: FormControl<string>,
}

// Add product Form
export interface addProductForm {
  id: FormControl<number>;
  masterId: FormControl<number>;
  quality: FormControl<string>;
  design: FormControl<string>;
  color: FormControl<string>;
  quantity: FormControl<number>;
  amount: FormControl<string>;
  size: FormControl<string>;
  currency: FormControl<string>;
  description: FormControl<string>;
  salesManId: FormControl<number>;
  isHandCarry: FormControl<string>;
  orderStatus: FormControl<number>;
  paymentStatus: FormControl<number>;
  isCustomized: FormControl<boolean>;
  isFreightInclude: FormControl<boolean>;
}

export interface checkoutForm{
  id: FormControl<number>;
  masterOrderId: FormControl<number>;
  paymentDate: FormControl<Date>;
  amount: FormControl<string>;
  comments: FormControl<string>;
  saleComments: FormControl<string>;
  partPaymentStatus: FormControl<boolean>;
  orderDate: FormControl<string>;
}

export interface orderNoForm{
  orderNo: FormControl<string>;
}

