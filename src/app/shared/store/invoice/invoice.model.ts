export interface Invoice {
    masterOrderId: number,
    orderNumber: string;
    url: string;
    name: string;
    address: string;
    mobileNo: string;
    emailAddress: string[];
    products: ProductDetail[];
    ccyCode: string;
    nationality: string;
    isEmailOnly: boolean;
    invoiceDescription: string;
    invoiceType: number;
}

export function createInvoiceModel({
  masterOrderId = 0,
    orderNumber = '',
    name = '',
    address = '',
    mobileNo = '',
    emailAddress = [],
    products = [],
    ccyCode = '',
    nationality = '',
    isEmailOnly = false,
    invoiceDescription = '',
    invoiceType = 0
  }: Partial<Invoice>) {
    return {
      masterOrderId,
      orderNumber,
      name,
      address,
      mobileNo,
      emailAddress,
      products,
      ccyCode,
      nationality,
      isEmailOnly,
      invoiceDescription,
      invoiceType
    } as Invoice;
  }

export interface ProductDetail {
    quality: string;
    design: string;
    colour: string;
    quantity: number;
    amount: number;
}