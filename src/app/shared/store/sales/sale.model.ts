import { FormArray, FormControl } from "@angular/forms";
export interface Sale {
  id: number;
  orderNumber: string;
  clientName: string;
}

export interface temporary {
  voucher: number;
  orderNumberId: number;
  customer: number;
  orderStatus: boolean;
  paymentStatus: number;
  orderDate: Date;
  gstInvoiceNumber: string;
  isHandCarry: boolean;
}

export interface SaleModel {
  id: number;
  voucherId: number;
  orderNumber: string;
  isForeignSale:boolean;
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
  Amount: number;
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
  expectedDeliveryDate: Date | null;
  orderDate: Date;
  gstInvoiceNumber: string;
  isBackDatedOrder: boolean;
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
  isCancelled: boolean;
}

export function createSaleModel({
  id = 0,
  voucherId = 0,
  orderNumber = "",
  isForeignSale = false,
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
  comments = "",
  isDeleted = false,
  createdOn = new Date(),
  expectedDeliveryDate = null as Date | null,
  orderDate = new Date(),
  gstInvoiceNumber = "",
  isBackDatedOrder = false,
}: Partial<SaleModel>) {
  return {
    id,
    voucherId,
    orderNumber,
    isForeignSale,
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
    expectedDeliveryDate,
    orderDate,
    gstInvoiceNumber,
    isBackDatedOrder,
  } as SaleModel;
}

export interface ProductDetails {
  id: number;
  masterId: number;
  quality: string;
  product: string;
  design: string;
  primaryStone: string;
  colour: string;
  size: string;
  shape: string;
  quantity: number;
  stonesNB : number | null;
  supplierId: number;
  amount: number;
  ccyCode: string;
  description: string;
  isCustomized: boolean;
  isFreightInclude: boolean;
  isCustomFullfilled?: boolean;
  expectedDeliveryDate: Date;
  productCode: string;
  isTaxExempted: boolean;
}

export interface PartPaymentDetails {
  id: number;
  masterOrderId: number;
  paymentDueDate: Date;
  amount: number;
  ccyCode: string;
  comments: string;
  status: boolean;
  paymentType: number;
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
export interface ClientDetailForm {
  id: FormControl<number>;
  orderNumber: FormControl<string>;
  isForeignSale:FormControl<boolean>;
  customerId: FormControl<number>;
  clientName: FormControl<string>;
  emailList: FormArray;
  mobileList: FormArray;
  street: FormControl<string>;
  apartment: FormControl<string>;
  houseNumber: FormControl<string>;
  shippingCountry: FormControl<string>;
  shippingState: FormControl<string>;
  shippingCity: FormControl<string>;
  shippingPinCode: FormControl<string>;
}

// Add product Form
export interface addProductForm {
  id: FormControl<number>;
  masterId: FormControl<number>;
  product: FormControl<string>;
  quality: FormControl<string>;
  design: FormControl<string>;
  primaryStone: FormControl<string>;
  colour: FormControl<string>;
  quantity: FormControl<number>;
  stonesNb: FormControl<null>;
  supplierId: FormControl<string>;
  amount: FormControl<string>;
  size: FormControl<string>;
  shape: FormControl<string>;
  currency: FormControl<string>;
  description: FormControl<string>;
  salesManId: FormControl<number>;
  expectedDeliveryDate: FormControl<string>;
  isHandCarry: FormControl<string>;
  orderStatus: FormControl<number>;
  paymentStatus: FormControl<number>;
  isCustomized: FormControl<boolean>;
  isFreightInclude: FormControl<boolean>;
  productCode: FormControl<string>;
  getByProductCode: FormControl<string>;
  isTaxExempted: FormControl<boolean>;
}

export interface checkoutForm {
  id: FormControl<number>;
  masterOrderId: FormControl<number>;
  paymentDate: FormControl<Date>;
  amount: FormControl<string>;
  comments: FormControl<string>;
  saleComments: FormControl<string>;
  partPaymentStatus: FormControl<boolean>;
  orderDate: FormControl<string>;
  advancePayment: FormControl<number>;
}

export interface orderNoForm {
  orderNo: FormControl<string>;
  enableOrderNo: FormControl<boolean>;
  isForeignSale:FormControl<boolean>;
}
