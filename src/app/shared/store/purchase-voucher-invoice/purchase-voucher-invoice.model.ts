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