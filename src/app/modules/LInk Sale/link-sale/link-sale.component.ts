import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subscription, map, tap } from 'rxjs';
import { Pagination, createPagination } from 'src/app/core/models/pagination.model';
import { ModalConfirmComponent, ModalType } from 'src/app/shared/components/modal-confirm/modal-confirm.component';
import { LinkSaleVoucher, createLinkSaleModel } from 'src/app/shared/store/link-sale/link-sale.model';
import { LinkSaleService } from 'src/app/shared/store/link-sale/link-sale.service';
import { SaleModel } from 'src/app/shared/store/sales/sale.model';
import { SaleService } from 'src/app/shared/store/sales/sale.service';
import { SaleStoreService } from 'src/app/shared/store/sales/sale.store';
import { UserService } from 'src/app/shared/store/user/user.service';
import { VoucherModel } from 'src/app/shared/store/voucher/voucher.model';
import { VoucherService } from 'src/app/shared/store/voucher/voucher.service';
import { VoucherStoreService } from 'src/app/shared/store/voucher/voucher.store';

@Component({
  selector: 'app-link-sale',
  templateUrl: './link-sale.component.html',
  styleUrls: ['./link-sale.component.scss']
})
export default class LinkSaleComponent {
  // pagination config
  pagingConfig: Pagination = createPagination({});

  public active = 1;

  // Initialize an object to store the checked state of each row
  rowCheckedState: { [key: number]: boolean } = {};
  selectedIds: number[] = [];

  // users List
  saleList$: Observable<SaleModel[]> = this.saleStore.selectAll(); 
  voucherList$: Observable<VoucherModel[]> = this.voucherStore.selectAll().pipe(
    map((vouchers: VoucherModel[]) => vouchers.sort((a,b) => b.id - a.id))
  )

  // subscription
  subscriptions: Subscription[] = [];

  linkSaleForm: FormGroup<LinkSaleVoucher> = this.formBuilder.nonNullable.group({
    saleMasterId: [0, [Validators.required, Validators.min(1)]],
    voucherId: [0,],
    invoiceNo: [''],
  })

  get saleMasterId(){
    return this.linkSaleForm.get('saleMasterId') as FormControl;
  }

  get voucherId(){
    return this.linkSaleForm.get('voucherId') as FormControl;
  }

  get invoiceNo(){
    return this.linkSaleForm.get('invoiceNo') as FormControl;
  }

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private linkSaleService: LinkSaleService,
    private saleStore: SaleStoreService,
    private saleService: SaleService,
    private voucherStore: VoucherStoreService,
    private voucherService: VoucherService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.saleService.getAll().subscribe(),
      this.voucherService.getAll().subscribe(),
      this.userService.getAll().subscribe()
    )
  }

  // navigate to Pending Payment
  protected navigatePendingPayment(id: number = 0): void {
    this.router.navigate(['pending-payment/pending', id]);
  }

  // protected openDeleteConfirmationModal(item: PendingPaymentModel) {
  //   const initialState = {
  //     item,
  //     message: `delete pending payment: ${item.id}`,
  //     modalType: ModalType.Confirmation
  //   };

  //   const modalRef = this.modalService.show(ModalConfirmComponent, { initialState, class: 'modal-sm modal-dialog-centered' });
  //   const sub = modalRef.content?.onClose.pipe(
  //     tap(
  //       (result: boolean) => {
  //         if (result) {
  //           this.pendingPaymentService.deletePendingPayment(item);
  //         }
  //       }
  //     )
  //   ).subscribe();

  //   if (sub) {
  //     this.subscriptions.push(sub);
  //   }
  // }

  linkSaleClick(): void{
    const linkSale = createLinkSaleModel({
      saleMasterId: this.saleMasterId.value,
      voucherId: this.voucherId.value,
      invoiceNo: this.invoiceNo.value
    })

    this.subscriptions.push(
      this.linkSaleService.upsertLinkSale(linkSale).pipe(
        tap((response)=> {
          if(response){
            this.clear();
          }
        })
      ).subscribe()
    )
  }

  protected openDeleteConfirmationModal() {
    const initialState = {
      message: `Remove Voucher From Sale`,
      modalType: ModalType.Confirmation
    };

    const modalRef = this.modalService.show(ModalConfirmComponent, { initialState, class: 'modal-sm modal-dialog-centered' });
    const sub = modalRef.content?.onClose.pipe(
      tap(
        (result: boolean) => {
          if (result) {
            const sale = createLinkSaleModel({
              saleMasterId: this.saleMasterId.value
            })
            this.linkSaleService.deleteLinkSale(sale).pipe(
              tap((result=>{
                this.clear();
              }))
            ).subscribe()
          }
        }
      )
    ).subscribe()

    if (sub) {
      this.subscriptions.push(sub);
    }
  }

  clear(): void{
    this.saleMasterId.setValue(0);
    this.voucherId.setValue(0);
    this.invoiceNo.setValue('');
  }

  fillVoucherAndInvoiceNo(): void{
    this.saleList$.subscribe(sales => { 
      const sale = sales.find(sale => sale.id == this.saleMasterId.value);
      if (sale) {
        this.voucherId.setValue(sale.voucherId == null? 0: sale.voucherId);
        this.invoiceNo.setValue(sale.gstInvoiceNumber == null? '': sale.gstInvoiceNumber);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
