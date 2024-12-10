import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ArtisanResponse } from '../store/artisan/artisan.model';
import { Color } from '../store/color/color.model';
import { CustomOrderProgressModel } from '../store/custom-order-progress/custom-order-progress.model';
import { CustomOrderModel } from '../store/custom-order/custom-order.model';
import { Shipping } from '../store/deliver-shipment/delivery-shipment.model';
import { DeliveryPartnerModel } from '../store/delivery-partner/delivery-partner.model';
import { DesignResponse } from '../store/design/design.model';
import { FeedbackModel, feedbackSaveModel } from '../store/feedback-form/feedback-form.model';
import { CheckInventoryModel, InventoryModel } from '../store/inventory/inventory.model';
import { Invoice } from '../store/invoice/invoice.model';
import { LinkSale } from '../store/link-sale/link-sale.model';
import { PendingPaymentModel } from '../store/pending-payment/pending-payment.model';
import { PrimaryColor } from '../store/primary-color/primary-color.model';
import { Product } from '../store/product/product.model';
import { QualityResponse } from '../store/quality/quality.model';
import { Role } from '../store/role/role.model';
import { ProductDetails, SaleModel } from '../store/sales/sale.model';
import { Shape } from '../store/shape/shape.model';
import { SignInModel } from '../store/sign-in/sign-in.model';
import { Size } from '../store/size/size.model';
import { SubPendingPaymentModel } from '../store/sub-pending-payment/sub-pending-payment.model';
import { UserModel } from '../store/user/user.model';
import { VoucherModel } from '../store/voucher/voucher.model';
import { City, Country, OpenSourceDataService, State } from './open-source-data.service';
import {PurchaseModel } from '../store/Purchase-voucher/purchase.model';

@Injectable({
  providedIn: 'root'
})
export class MarbleInventoryHttpService {
  baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private openSourceDataService: OpenSourceDataService
  ) { }

  private getHeaders(): HttpHeaders {
    const authToken = localStorage.getItem('Token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    });
  }



  // Sign In API
  signInUser(user: SignInModel): Observable<string>{
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text'
    }
    return this.http.post<string>(`${this.baseUrl}Authorization/logIn`,user,requestOptions)
  }

  // User API
  getAllUser(): Observable<UserModel[]> {
    const headers = this.getHeaders();
    return this.http.get<UserModel[]>(`${this.baseUrl}user`,{ headers: headers});
  }

  insertUser(user: UserModel): Observable<UserModel> {
    const headers = this.getHeaders();
    return this.http.post<UserModel>(`${this.baseUrl}user`, user, { headers: headers });
  }

  updateUser(user: UserModel): Observable<UserModel> {
    const headers = this.getHeaders();
    return this.http.put<UserModel>(`${this.baseUrl}user/${user.id}`, user, { headers: headers });
  }

  deleteUser(user: UserModel): Observable<UserModel> {
    const headers = this.getHeaders();
    return this.http.delete<UserModel>(`${this.baseUrl}user/${user.id}`, { headers: headers });
  }

  // Role API
  getAllRole(): Observable<Role[]> {
    const headers = this.getHeaders();
    return this.http.get<Role[]>(`${this.baseUrl}user/userrole`,{ headers: headers});
  }

  // Quality (qualityTypeName) API
  getAllQuality(): Observable<QualityResponse[]> {
    const headers = this.getHeaders();
    return this.http.get<QualityResponse[]>(`${this.baseUrl}Lookups/quality`, { headers: headers });
  }

  // Design API
  getAllDesign(): Observable<DesignResponse[]> {
    const headers = this.getHeaders();
    return this.http.get<DesignResponse[]>(`${this.baseUrl}Lookups/design`, { headers: headers });

  }

  // Color(Primary Stone) API
  getAllColor(): Observable<Color[]> {
    const headers = this.getHeaders();
    return this.http.get<Color[]>(`${this.baseUrl}Lookups/primarystone`, { headers: headers });
  }

  // Color(Primary Color) API
  getAllPrimaryColor(): Observable<Color[]> {
    const headers = this.getHeaders();
    return this.http.get<PrimaryColor[]>(`${this.baseUrl}Lookups/primarycolor`, { headers: headers });
  }

  // Size API
  getAllSize(): Observable<Size[]> {
    const headers = this.getHeaders();
    return this.http.get<Size[]>(`${this.baseUrl}colourSize/size`, { headers: headers });
  }

  // Shape API
  getAllShape(): Observable<Shape[]> {
    const headers = this.getHeaders();
    return this.http.get<Shape[]>(`${this.baseUrl}Lookups/shape`, { headers: headers });
  }

  // Product API
  getAllProduct(): Observable<Product[]> {
    const headers = this.getHeaders();
    return this.http.get<Product[]>(`${this.baseUrl}Lookups/product`, { headers: headers });
  }


  
  
  // Artisan API
  getAllArtisan(): Observable<ArtisanResponse[]> {
    const headers = this.getHeaders();
    return this.http.get<ArtisanResponse[]>(`${this.baseUrl}Lookups/artisian`, { headers: headers });

  }

  // cancele 
  cancelSale(sale: SaleModel, comment: string): Observable<boolean> {
    const headers = this.getHeaders();
    return this.http.delete<boolean>(`${this.baseUrl}sale/deleteTransaction/${sale.id}?type=1&cancelledComment=${comment}`, { headers: headers });
  }



  // Inventory API for Accordian
  // getAllInventory(): Observable<InventoryModel[]> {
  //const headers = this.getHeaders();   
  //return this.http.get<InventoryModel[]>(`${this.baseUrl}Carpets/withdetails`);
  // }

  // Inventory API for grid
  getAllInventory(): Observable<InventoryModel[]> {
    const headers = this.getHeaders();
    return this.http.get<InventoryModel[]>(`${this.baseUrl}inventory`, { headers: headers });
  }

  insertInventory(inventory: InventoryModel): Observable<InventoryModel> {

    // const formData = new FormData()
    // formData.append("id", inventory.id.toString());
    // formData.append("ArtisianName", inventory.supplierId.toString());
    // formData.append("Size", inventory.size);
    // formData.append("QualityTypeName", inventory.qualityType);
    // formData.append("ProductName", inventory.product);
    // formData.append("ProductCode", inventory.productCode);
    // formData.append("ShapeName", inventory.shape);
    // formData.append("PrimaryStoneName", inventory.primaryStone);
    // formData.append("DesignName", inventory.design);
    // formData.append("PrimaryColorName", inventory.primaryColor);
    // formData.append("StonesNb", inventory.stonesNb.toString());
    // formData.append("SellingPrice", inventory.sellingPrice.toString());
    // formData.append("IsDeleted", inventory.isDeleted.toString());
    // formData.append("Name", "N/A");
    // formData.append("Rate", inventory.rate.toString());
    // formData.append("Sadekaar", inventory.sadekaar.toString());
    // formData.append("DesignAmt", inventory.designAmt.toString());
    // formData.append("CostPrice", inventory.costPrice.toString());
    // formData.append("Quantity", inventory.sellingPrice.toString());

    delete inventory.guid;

    
    const authToken = localStorage.getItem('Token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`
    });

    // Convert the array into query parameters
    let params = new HttpParams();
    params = params.append('quantity', inventory.quantity);
    
    const requestOptions = {
      headers: headers,
      params: params,
    };
    return this.http.post<InventoryModel>(`${this.baseUrl}inventory`, inventory, requestOptions);
  }
  
  // updateInventory(inventory: InventoryModel): Observable<InventoryModel> {
  //   console.log(inventory)
        
  //   let params = new HttpParams();
  //   const authToken = localStorage.getItem('Token');
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${authToken}`
  //   });
    
    
  //   params = params.append('id', inventory.id);
  //   // params = params.append('guid', inventory.guid);

  //   console.log(params)
  //   const requestOptions = {
  //     headers: headers,
  //     params: params,
  //   };
  //   return this.http.put<InventoryModel>(`${this.baseUrl}inventory`, inventory, requestOptions);
  // }
  updateInventoryById(inventory: InventoryModel): Observable<InventoryModel> {
    console.log(inventory)
        
    let params = new HttpParams();
    const authToken = localStorage.getItem('Token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`
    });
    
    
    params = params.append('id', inventory.id);
    // params = params.append('guid', inventory.guid);

    console.log(params)
    const requestOptions = {
      headers: headers,
      params: params,
    };
    return this.http.put<InventoryModel>(`${this.baseUrl}inventory`, inventory, requestOptions);
  }
  updateInventoryByGuid(inventory: InventoryModel): Observable<InventoryModel> {
    console.log(inventory)
        
    let params = new HttpParams();
    const authToken = localStorage.getItem('Token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`
    });
    
    if(inventory.guid){
      params = params.append('guid', inventory.guid);
    }

    console.log(params)
    const requestOptions = {
      headers: headers,
      params: params,
    };
    return this.http.put<InventoryModel>(`${this.baseUrl}inventory`, inventory, requestOptions);
  }
  
  deleteInventory(inventory: InventoryModel): Observable<InventoryModel> {

    const authToken = localStorage.getItem('Token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`
    });
    let params = new HttpParams();
    params = params.append('id', inventory.id);
    // params = params.append('guid', inventory.guid);

    console.log(params)
    const requestOptions = {
      headers: headers,
      params: params,
    };
    
    return this.http.delete<InventoryModel>(`${this.baseUrl}inventory`, requestOptions);
  }
  deleteInventoryById(inventory: InventoryModel): Observable<InventoryModel> {

    const authToken = localStorage.getItem('Token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`
    });
    let params = new HttpParams();
    params = params.append('id', inventory.id);
    // params = params.append('guid', inventory.guid);

    console.log(params)
    const requestOptions = {
      headers: headers,
      params: params,
    };
    
    return this.http.delete<InventoryModel>(`${this.baseUrl}inventory`, requestOptions);
  }
  deleteInventoryByGuid(inventory: InventoryModel): Observable<InventoryModel> {

    const authToken = localStorage.getItem('Token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`
    });
    let params = new HttpParams();
    if(inventory.guid){

      params = params.append('guid', inventory.guid);
    }

    console.log(params)
    const requestOptions = {
      headers: headers,
      params: params,
    };
    
    return this.http.delete<InventoryModel>(`${this.baseUrl}inventory`, requestOptions);
  }
  
  checkInventory(inventory: CheckInventoryModel): Observable<CheckInventoryModel> {
    const headers = this.getHeaders();
    return this.http.post<CheckInventoryModel>(`${this.baseUrl}inventory/check-inventory`,inventory, { headers: headers });
  }

  // printInventoryBarcode(ids: number[]): Observable<string> {
  //   const headers = this.getHeaders()
  //   const requestOptions: Object = {
  //     headers: headers,
  //     responseType: 'text',
  //   }
  //   return this.http.get<string>(`${this.baseUrl}inventory/generate-barcode`, ids, requestOptions);
  // }

  printInventoryBarcode(ids: number[]): Observable<string> {
    const headers = this.getHeaders();

    // Convert the array into query parameters
    let params = new HttpParams();
    ids.forEach(id => {
        params = params.append('ids', id.toString());
    });

    const requestOptions = {
        headers: headers,
        params: params,
        responseType: 'text' as 'json' // Set response type to text
    };

    return this.http.get<string>(`${this.baseUrl}inventory/generate-barcode`, requestOptions);
}





  // Purchase-Voucher Product API

  insertPurchaseVoucher(purchase:PurchaseModel):Observable<PurchaseModel>{
    const headers = this.getHeaders();
    return this.http.post<PurchaseModel>(`${this.baseUrl}purchase-voucher`, purchase,{headers:headers});
  }
  
  getPurchaseVoucher():Observable<PurchaseModel[]>{
    const headers = this.getHeaders();
    return this.http.get<PurchaseModel[]>(`${this.baseUrl}purchase-voucher` , {headers : headers});
  }
  updatePurchaseVoucher(purchase:PurchaseModel):Observable<PurchaseModel>{
    const headers = this.getHeaders();
    return this.http.put<PurchaseModel>(`${this.baseUrl}purchase-voucher/${purchase.id}` , purchase ,{headers : headers});
  }
  deletePurchaseVoucher(purchase:PurchaseModel): Observable<PurchaseModel> {
    const headers = this.getHeaders();
    return this.http.delete<PurchaseModel>(`${this.baseUrl}purchase-voucher/${purchase.id}`,{ headers: headers });
  }

  getPurchaseVoucherById(purchase:PurchaseModel):Observable<PurchaseModel[]>{
    const headers = this.getHeaders();
    return this.http.get<PurchaseModel[]>(`${this.baseUrl}purchase-voucher${purchase.id}`,{headers : headers});
  }


  printPurchaseVoucher(id: number): Observable<string> {
    const headers = this.getHeaders()
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text'
    }
    return this.http.get<string>(`${this.baseUrl}purchase-voucher/generate-purchaseVoucher/${id}`, requestOptions);
  }
  // getPurchaseVoucherByMasterId(purchase:PurchaseModel):Observable<PurchaseModel[]>{
  //   const headers = this.getHeaders();
  //   return this.http.get<PurchaseModel[]>(`${this.baseUrl}purchase-voucher/details${purchase.id}`,{headers : headers});
  // }

  // Voucher API
  getAllVoucher(): Observable<VoucherModel[]> {
    const headers = this.getHeaders();
    return this.http.get<VoucherModel[]>(`${this.baseUrl}sale/voucher`, { headers: headers });
  }

  insertVoucher(voucher: VoucherModel): Observable<VoucherModel> {
    const headers = this.getHeaders();
    return this.http.post<VoucherModel>(`${this.baseUrl}sale/voucher`, voucher, { headers: headers });
  }

  updateVoucher(voucher: VoucherModel): Observable<VoucherModel> {
    const headers = this.getHeaders();
    return this.http.put<VoucherModel>(`${this.baseUrl}sale/voucher/${voucher.id}`, voucher, { headers: headers });
  }

  deleteVoucher(voucher: VoucherModel): Observable<VoucherModel> {
    const headers = this.getHeaders();
    return this.http.delete<VoucherModel>(`${this.baseUrl}sale/voucher/${voucher.id}`, { headers: headers });
  }

  getNextVoucherNo(): Observable<string> {
    const headers = this.getHeaders()
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text'
    }
    return this.http.get<string>(`${this.baseUrl}sale/voucher/next-voucher-code`,requestOptions);
  }

  // sale API
  getAllSale(): Observable<SaleModel[]> {
    const headers = this.getHeaders();
    return this.http.get<SaleModel[]>(`${this.baseUrl}sale/getTransactionsWithDetails`, { headers: headers });
  }

  insertSale(sale: SaleModel): Observable<SaleModel> {
    const headers = this.getHeaders();
    return this.http.post<SaleModel>(`${this.baseUrl}sale/addTransaction`, sale, { headers: headers });
  }

  updateSale(sale: SaleModel): Observable<SaleModel> {
    const headers = this.getHeaders();
    return this.http.put<SaleModel>(`${this.baseUrl}sale/saleTransaction/${sale.id}`, sale, { headers: headers });
  }

  deleteSale(sale: SaleModel): Observable<SaleModel> {
    const headers = this.getHeaders();
    return this.http.delete<SaleModel>(`${this.baseUrl}sale/deleteTransaction/${sale.id}`, { headers: headers });
  }

  isOrderNoExists(orderNo: string): Observable<boolean>{
    const headers = this.getHeaders();
    return this.http.get<boolean>(`${this.baseUrl}sale/order-exist/${orderNo}`, { headers: headers });
  }

  getNextOrderNo(): Observable<string> {
    const headers = this.getHeaders()
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text'
    }
    return this.http.get<string>(`${this.baseUrl}sale/sale/next-order-number`,requestOptions);
  }

  getByProductCode(productCode: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.baseUrl}inventory/product-code/${productCode}`, { headers: headers });
  }

  // Invoice API
  getInvoice(saleDetail: Invoice): Observable<any> {
    // const headers = this.getHeaders();
    // return this.http.post<Invoice>(`${this.baseUrl}Notification/getInvoice/pushE-mail`, saleDetail, { headers: headers });

    const headers = this.getHeaders()
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text'
    }
    return this.http.post<any>(`${this.baseUrl}Notification/getInvoice/pushE-mail`, saleDetail,requestOptions);
  }

  printInvoice(saleId: number): Observable<string> {
    // const headers = this.getHeaders();
    // return this.http.get<string>(`${this.baseUrl}sale/invoice/${saleId}`, { headers: headers });

    const headers = this.getHeaders()
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text'
    }
    return this.http.get<any>(`${this.baseUrl}sale/invoice/${saleId}?invoiceType=1`, requestOptions);
  }

  // Custom Order API
  getAllCustomOrder(): Observable<CustomOrderModel[]> {
    const headers = this.getHeaders();
    return this.http.get<CustomOrderModel[]>(`${this.baseUrl}sale/getAllCustomizedOrder`, { headers: headers });
  }

  insertCustomOrder(customOrder: CustomOrderModel): Observable<CustomOrderModel> {
    const headers = this.getHeaders();
    return this.http.post<CustomOrderModel>(`${this.baseUrl}sale/addTransaction`, customOrder, { headers: headers });
  }

  updateCustomOrder(customOrder: CustomOrderModel): Observable<CustomOrderModel> {
    const headers = this.getHeaders();
    return this.http.put<CustomOrderModel>(`${this.baseUrl}sale/customizedOrder/${customOrder.masterOrderId}`, customOrder, { headers: headers });
  }

  deleteCustomOrder(customOrder: CustomOrderModel): Observable<CustomOrderModel> {
    const headers = this.getHeaders();
    return this.http.delete<CustomOrderModel>(`${this.baseUrl}sale/deleteTransaction/${customOrder.id}`, { headers: headers });
  }

  orderReceived(customOrder: CustomOrderModel): Observable<string>{
    const headers = this.getHeaders();
    return this.http.patch<string>(`${this.baseUrl}sale/custom-product-status/${customOrder.id}`,true, { headers: headers })
  }

  // Custom Order Progress API
  getAllCustomOrderProgresses(id: number): Observable<CustomOrderProgressModel[]> {
    const headers = this.getHeaders();
    return this.http.get<CustomOrderProgressModel[]>(`${this.baseUrl}sale/customProgress/${id}`, { headers: headers });
  }

  insertCustomOrderProgress(customOrderProgress: CustomOrderProgressModel): Observable<CustomOrderProgressModel> {
    const formData = new FormData()
    formData.append("id", customOrderProgress.id.toString());
    formData.append("saleDetailId", customOrderProgress.saleDetailId.toString());
    formData.append("comments", customOrderProgress.comments);
    formData.append("image", customOrderProgress.image!);
    formData.append("imageUrl", customOrderProgress.imageUrl);
    
    const authToken = localStorage.getItem('Token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`
    });

    return this.http.post<CustomOrderProgressModel>(`${this.baseUrl}sale/addCustomProgress`, formData, { headers: headers });
  }

  updateCustomOrderProgress(customOrderProgress: CustomOrderProgressModel): Observable<CustomOrderProgressModel> {
    const formData = new FormData()
    formData.append("id", customOrderProgress.id.toString());
    formData.append("saleDetailId", customOrderProgress.saleDetailId.toString());
    formData.append("comments", customOrderProgress.comments);
    formData.append("image", customOrderProgress.image!);
    formData.append("imageUrl", customOrderProgress.imageUrl);
    
    const authToken = localStorage.getItem('Token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`
    });
    
    return this.http.put<CustomOrderProgressModel>(`${this.baseUrl}sale/CustomProgress/${customOrderProgress.id}`, formData, { headers: headers });
  }

  deleteCustomOrderProgress(customOrder: CustomOrderProgressModel): Observable<CustomOrderProgressModel> {
    const headers = this.getHeaders();
    return this.http.delete<CustomOrderProgressModel>(`${this.baseUrl}sale/custom-progress/${customOrder.id}`, { headers: headers });
  }

  // Pending Payment API
  getAllPendingPayment(): Observable<PendingPaymentModel[]> {
    const headers = this.getHeaders();
    return this.http.get<PendingPaymentModel[]>(`${this.baseUrl}partPayment`, { headers: headers });
  }

  insertPendingPayment(pendingPayment: PendingPaymentModel): Observable<PendingPaymentModel> {
    const headers = this.getHeaders();
    return this.http.post<PendingPaymentModel>(`${this.baseUrl}partPayment`, pendingPayment, { headers: headers });
  }

  updatePendingPayment(pendingPayment: PendingPaymentModel): Observable<PendingPaymentModel> {
    const headers = this.getHeaders();
    return this.http.put<PendingPaymentModel>(`${this.baseUrl}partPayment/${pendingPayment.id}`, pendingPayment, { headers: headers });
  }

  sendReminder(list: number[]): Observable<boolean>{
    const headers = this.getHeaders();
    return this.http.post<boolean>(`${this.baseUrl}notification/sendPartPaymentAlerts`,list, { headers: headers });
  }

  // Sub Payment Pending List
  getAllSubPendingList(id: number): Observable<SubPendingPaymentModel[]> {
    const headers = this.getHeaders();
    return this.http.get<SubPendingPaymentModel[]>(`${this.baseUrl}partPayment/${id}`, { headers: headers });
  }

  updateSubPendingPayment(subPendingPayment: SubPendingPaymentModel): Observable<SubPendingPaymentModel> {
    const headers = this.getHeaders();
    return this.http.put<SubPendingPaymentModel>(`${this.baseUrl}partPayment/${subPendingPayment.id}`, subPendingPayment, { headers: headers });
  }

  patchSubPendingPayment(subPendingPaymentId: number, isCompleted: boolean): Observable<SubPendingPaymentModel> {
    const headers = this.getHeaders();
    return this.http.patch<SubPendingPaymentModel>(`${this.baseUrl}partPayment/changePaymentStatus/${subPendingPaymentId}`, isCompleted, { headers: headers });
  }

  deleteSubPendingPayment(subPendingPayment: SubPendingPaymentModel): Observable<SubPendingPaymentModel> {
    const headers = this.getHeaders();
    return this.http.delete<SubPendingPaymentModel>(`${this.baseUrl}partPayment/${subPendingPayment.id}`, { headers: headers });
  }

  // Link sale voucher API
  patchLinkSaleVoucher(sale: LinkSale): Observable<boolean> {
    const headers = this.getHeaders();
    return this.http.patch<boolean>(`${this.baseUrl}sale/link-sale?saleMasterId=${sale.saleMasterId}&voucherId=${sale.voucherId == 0? '': sale.voucherId}&gstInvoiceNumber=${sale.invoiceNo}`,sale.saleMasterId, { headers: headers });
  }

  deleteLinkSaleVoucher(sale: LinkSale): Observable<boolean> {
    const headers = this.getHeaders();
    return this.http.delete<boolean>(`${this.baseUrl}sale/removeLinkSaleToVoucher/?saleMasterId=${sale.saleMasterId}`, { headers: headers });
  }

  // feedback API
  getAllFeedbackQuestions(): Observable<FeedbackModel[]> {
    const headers = this.getHeaders();
    return this.http.get<FeedbackModel[]>(`${this.baseUrl}feedback/questions`, { headers: headers });
  }

  insertFeedback(pendingPayment: feedbackSaveModel): Observable<feedbackSaveModel> {
    const headers = this.getHeaders();
    return this.http.post<feedbackSaveModel>(`${this.baseUrl}feedback/customerFeedback`, pendingPayment, { headers: headers });
  }

  // Delivery and Shipment API
  upsertShipment(shipping: Shipping): Observable<Shipping> {
    const headers = this.getHeaders();
    return this.http.post<Shipping>(`${this.baseUrl}ShipmentDelivery/Shipping`, shipping, { headers: headers });
  }

  upsertDelivery(delivery: Shipping): Observable<Shipping> {
    const headers = this.getHeaders();
    return this.http.post<Shipping>(`${this.baseUrl}ShipmentDelivery/Delivery`, delivery, { headers: headers });
  }

  // Delivery Partner API
  getAllDeliveryPartners(): Observable<DeliveryPartnerModel[]> {
    const headers = this.getHeaders();
    return this.http.get<DeliveryPartnerModel[]>(`${this.baseUrl}DeliveryPartner`,{ headers: headers});
  }

  insertDeliveryPartner(deliveryPartner: DeliveryPartnerModel): Observable<DeliveryPartnerModel> {
    const headers = this.getHeaders();
    return this.http.post<DeliveryPartnerModel>(`${this.baseUrl}DeliveryPartner`, deliveryPartner, { headers: headers });
  }

  // Open Source API for Country and State
  getCountries(): Observable<Country[]> {
      return this.openSourceDataService.getAuthToken().pipe(
        switchMap(response => {
          const authToken = response['auth_token'];
          const headers = new HttpHeaders({
            Authorization: `Bearer ${authToken}`,
            "Accept": "application/json"
          });
          return this.http.get<Country[]>('https://www.universal-tutorial.com/api/countries/', { headers });
        })
      );
  }

  getStates(country: string): Observable<State[]> {
    return this.openSourceDataService.getAuthToken().pipe(
      switchMap(response => {
        const authToken = response['auth_token'];
        const headers = new HttpHeaders({
          Authorization: `Bearer ${authToken}`,
          "Accept": "application/json"
        });
        return this.http.get<State[]>(`https://www.universal-tutorial.com/api/states/${country}`, { headers });
      })
    );
  }

  getCities(state: string): Observable<City[]> {
    return this.openSourceDataService.getAuthToken().pipe(
      switchMap(response => {
        const authToken = response['auth_token'];
        const headers = new HttpHeaders({
          Authorization: `Bearer ${authToken}`,
          "Accept": "application/json"
        });
        return this.http.get<City[]>(`https://www.universal-tutorial.com/api/cities/${state}`, { headers });
      })
    );
  }

}