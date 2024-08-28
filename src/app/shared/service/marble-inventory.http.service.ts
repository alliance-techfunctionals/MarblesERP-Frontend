import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { UserModel } from '../store/user/user.model';
import { Role } from '../store/role/role.model';
import { environment } from 'src/environments/environment';
import { CheckInventoryModel, InventoryModel } from '../store/inventory/inventory.model';
import { QualityResponse } from '../store/quality/quality.model';
import { DesignResponse } from '../store/design/design.model';
import { Color } from '../store/color/color.model';
import { Size } from '../store/size/size.model';
import { VoucherModel } from '../store/voucher/voucher.model';
import { SaleModel } from '../store/sales/sale.model';
import { CustomOrderModel } from '../store/custom-order/custom-order.model';
import { MasterInventoryModel } from '../store/MasterInventory/masterInventory.model';
import { PendingPaymentModel } from '../store/pending-payment/pending-payment.model';
import { Invoice } from '../store/invoice/invoice.model';
import { SubPendingPaymentModel } from '../store/sub-pending-payment/sub-pending-payment.model';
import { LinkSale } from '../store/link-sale/link-sale.model';
import { FeedbackModel, feedbackSaveModel } from '../store/feedback-form/feedback-form.model';
import { Shipping } from '../store/deliver-shipment/delivery-shipment.model';
import { SignInModel } from '../store/sign-in/sign-in.model';
import { CustomOrderProgressModel } from '../store/custom-order-progress/custom-order-progress.model';
import { DeliveryPartnerModel } from '../store/delivery-partner/delivery-partner.model';
import { City, Country, OpenSourceDataService, State } from './open-source-data.service';
import { head } from 'lodash';

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

  // Quality API
  getAllQuality(): Observable<QualityResponse[]> {
    const headers = this.getHeaders();
    return this.http.get<QualityResponse[]>(`${this.baseUrl}quality`, { headers: headers });
  }

  // Design API
  getAllDesign(): Observable<DesignResponse[]> {
    const headers = this.getHeaders();
    return this.http.get<DesignResponse[]>(`${this.baseUrl}design`, { headers: headers });

  }

  // Color API
  getAllColor(): Observable<Color[]> {
    const headers = this.getHeaders();
    return this.http.get<Color[]>(`${this.baseUrl}colourSize/colours`, { headers: headers });
  }

  // Size API
  getAllSize(): Observable<Size[]> {
    const headers = this.getHeaders();
    return this.http.get<Size[]>(`${this.baseUrl}colourSize/size`, { headers: headers });
  }

  // Inventory API for Accordian
  // getAllInventory(): Observable<InventoryModel[]> {
  //const headers = this.getHeaders();   
  //return this.http.get<InventoryModel[]>(`${this.baseUrl}Carpets/withdetails`);
  // }

  // Inventory API for grid
  getAllInventory(): Observable<InventoryModel[]> {
    const headers = this.getHeaders();
    return this.http.get<InventoryModel[]>(`${this.baseUrl}inventory/details`, { headers: headers });
  }

  insertInventory(inventory: InventoryModel): Observable<InventoryModel> {

    const formData = new FormData()
    formData.append("QualityName", inventory.qualityId.toString());
    formData.append("DesignName", inventory.designId.toString());
    formData.append("ColorCode", inventory.colorCode);
    formData.append("Quantity", inventory.quantity.toString());
    formData.append("Size", inventory.size);
    formData.append("file", inventory.file);
    formData.append("supplierId", inventory.supplierId.toString());
    const authToken = localStorage.getItem('Token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`
    });
    return this.http.post<InventoryModel>(`${this.baseUrl}inventory`, formData, { headers: headers });
  }

  updateInventory(inventory: InventoryModel): Observable<InventoryModel> {
    console.log(inventory)
    const formData = new FormData()
    formData.append("MasterId", String(inventory.id));
    formData.append("QualityId", String(inventory.qualityId));
    formData.append("DesignId", String(inventory.designId));
    formData.append("ColorCode", inventory.colorCode);
    formData.append("Quantity", String(inventory.quantity));
    formData.append("Size", inventory.size);
    formData.append("file", inventory.file);
    formData.append("supplierId", inventory.supplierId.toString());
    formData.append("isNormalUpdate",inventory.isNormalUpdate.toString())
    
    const authToken = localStorage.getItem('Token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`
    });
    
    return this.http.put<InventoryModel>(`${this.baseUrl}inventory/${inventory.id}`, formData, { headers: headers });
  }

  deleteInventory(inventory: InventoryModel): Observable<InventoryModel> {
    const headers = this.getHeaders();
    return this.http.delete<InventoryModel>(`${this.baseUrl}inventory/${inventory.id}`, { headers: headers });
  }

  checkInventory(inventory: CheckInventoryModel): Observable<CheckInventoryModel> {
    const headers = this.getHeaders();
    return this.http.post<CheckInventoryModel>(`${this.baseUrl}inventory/check-inventory`,inventory, { headers: headers });
  }

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
    return this.http.get<any>(`${this.baseUrl}sale/invoice/${saleId}`, requestOptions);
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