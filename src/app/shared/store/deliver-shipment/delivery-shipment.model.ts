export interface Shipping {
  masterSaleId: number;
  trackingNumber: string;
  clientName: string;
  deliveryPartnerId: number;
}

export function createShippingModel({
  masterSaleId = 0,
  trackingNumber = '',
  clientName = '',
  deliveryPartnerId = 0,
}: Partial<Shipping>) {
  return {
    masterSaleId,
    trackingNumber,
    clientName,
    deliveryPartnerId,
  } as Shipping;
}


