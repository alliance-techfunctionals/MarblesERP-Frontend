import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subscription, combineLatest, map, tap } from 'rxjs';
import { Pagination, createPagination } from 'src/app/core/models/pagination.model';
import { ModalConfirmComponent, ModalType } from 'src/app/shared/components/modal-confirm/modal-confirm.component';
import { LinkSaleVoucher, createLinkSaleModel } from 'src/app/shared/store/link-sale/link-sale.model';
import { LinkSaleService } from 'src/app/shared/store/link-sale/link-sale.service';
import { SaleModel } from 'src/app/shared/store/sales/sale.model';
import { SaleService } from 'src/app/shared/store/sales/sale.service';
import { SaleStoreService } from 'src/app/shared/store/sales/sale.store';
import { UserService } from 'src/app/shared/store/user/user.service';
import { UserStoreService } from 'src/app/shared/store/user/user.store';
import { VoucherModel } from 'src/app/shared/store/voucher/voucher.model';
import { VoucherService } from 'src/app/shared/store/voucher/voucher.service';
import { VoucherStoreService } from 'src/app/shared/store/voucher/voucher.store';

@Component({
  selector: 'app-link-sale',
  templateUrl: './link-sale.component.html',
  styleUrls: ['./link-sale.component.scss']
})
export default class LinkSaleComponent {
  saleFilterValue: string = '';
  voucherFilterValue: string = '';
  saleList: SaleModel[] = [];
  filteredSaleList: SaleModel[] = [];
  batchSize = 50; 
  currentIndex = 0;
  voucherList: VoucherModel[] = [];
  filteredVoucherList: VoucherModel[] = [];
  @ViewChild('sale-lazy-load-panel', { static: false }) saleLazyLoadPanel!: ElementRef;
  @ViewChild('voucher-lazy-load-panel', { static: false }) voucherLazyLoadPanel!: ElementRef;
  @ViewChild('saleSelect') saleSelect!: MatSelect;
  @ViewChild('voucherSelect') voucherSelect!: MatSelect;
  private resizeListener!: () => void;

  // pagination config
  pagingConfig: Pagination = createPagination({});

  public active = 1;

  // Initialize an object to store the checked state of each row
  rowCheckedState: { [key: number]: boolean } = {};
  selectedIds: number[] = [];

  // users List
  saleList$ = combineLatest([
    this.saleStore.selectAll(),
    this.userStoreService.selectAll(),
  ]).pipe(
    map(([sales, users]) => {
      const userMap = new Map(users.map(user => [user.id, user]));

      const result = sales.map((sale) => {
        const salesMan = userMap.get(sale.salesManId);
        const customer = userMap.get(sale.customerId);

        return {
          ...sale,
          salesManName: salesMan?.name || "N/A",
          customerName: customer?.name || "N/A",
        };
      }).sort((a: { orderDate: string | number | Date; }, b: { orderDate: string | number | Date; }) => {
        const dateA = new Date(a.orderDate);
        const dateB = new Date(b.orderDate);
        return dateB.getTime() - dateA.getTime();
      });

      console.timeEnd('Mapping and Sorting Time');
      return result;
    })
  ); 
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
    private userStoreService: UserStoreService,
    private saleService: SaleService,
    private voucherStore: VoucherStoreService,
    private voucherService: VoucherService,
    private userService: UserService,
  ) { 
    this.resizeListener = this.onResize.bind(this);
    window.addEventListener('resize', this.resizeListener);
  }
  
  ngOnInit() {
    this.subscriptions.push(
      this.saleService.getAll().subscribe(),
      this.voucherService.getAll().subscribe(),
      this.userService.getAll().subscribe()
    )
    this.saleList$.subscribe((sales) => {
      this.saleList = sales;
      this.loadInitialSaleItems();
    });

    this.voucherList$.subscribe((vouchers) => {
      this.voucherList = vouchers;
      this.loadInitialVoucherItems();
    });
  }

  onResize(): void {
    if (this.saleSelect && this.saleSelect.panelOpen) {
      this.saleSelect.close();
      this.voucherSelect.close();
    }
    if (this.voucherSelect && this.voucherSelect.panelOpen) {
      this.voucherSelect.close();
    }
  }

  loadInitialSaleItems(): void {
    this.filteredSaleList = this.saleList.slice(0, this.batchSize);
    this.currentIndex = this.batchSize;
  }

  loadInitialVoucherItems(): void {
    this.filteredVoucherList = this.voucherList.slice(0, this.batchSize);
    this.currentIndex = this.batchSize;
  }

  onSaleScroll(event: any): void {
    const panel = event.target;
    const scrollPosition = panel.scrollTop + panel.offsetHeight;
    const threshold = panel.scrollHeight - 10;

    if (scrollPosition >= threshold && !this.saleFilterValue) {
      this.loadMoreSaleItems();
    }
  }

  onVoucherScroll(event: any): void {
    const panel = event.target;
    const scrollPosition = panel.scrollTop + panel.offsetHeight;
    const threshold = panel.scrollHeight - 10;

    if (scrollPosition >= threshold && !this.voucherFilterValue) {
      this.loadMoreVoucherItems();
    }
  }

  loadMoreSaleItems(): void {
    const nextBatch = this.saleList.slice(this.currentIndex, this.currentIndex + this.batchSize);

    if (nextBatch.length > 0) {
      this.filteredSaleList = [...this.filteredSaleList, ...nextBatch];
      this.currentIndex += this.batchSize;
    }
  }

  loadMoreVoucherItems(): void {
    const nextBatch = this.voucherList.slice(this.currentIndex, this.currentIndex + this.batchSize);

    if (nextBatch.length > 0) {
      this.filteredVoucherList = [...this.filteredVoucherList, ...nextBatch];
      this.currentIndex += this.batchSize;
    }
  }

  onSaleDropdownOpen(): void {
    this.fillVoucherAndInvoiceNo()
    const panel = document.querySelector('.sale-lazy-load-panel');

    if (panel) {
      panel.addEventListener('scroll', this.onSaleScroll.bind(this));
    }
  }

  onVoucherDropdownOpen(): void {
    const panel = document.querySelector('.voucher-lazy-load-panel');

    if (panel) {
      panel.addEventListener('scroll', this.onVoucherScroll.bind(this));
    }
  }
  // navigate to Pending Payment
  protected navigatePendingPayment(id: number = 0): void {
    this.router.navigate(['pending-payment/pending', id]);
  }
  getSaleFilterValue(value: string) {
    this.saleFilterValue = value
  }
  
  getVoucherFilterValue(value: string) {
    this.voucherFilterValue = value
  }

  onSaleInputChange(event: any): void {
    this.getSaleFilterValue(event.target.value);
    this.filterSale();
  }

  onVoucherInputChange(event: any): void {
    this.getVoucherFilterValue(event.target.value);
    this.filterVoucher();
  }

  filterSale() {
    const query = this.saleFilterValue.toLowerCase();
    if (!this.saleFilterValue) {
      this.loadInitialSaleItems();
    } else {
    this.filteredSaleList = this.saleList.filter((sale) =>
      sale.orderNumber.toLowerCase().includes(query) ||
      sale.customerName.toLowerCase().includes(query) ||
      sale.salesManName.toLowerCase().includes(query)
    );
  }
  }

  filterVoucher() {
    const query = this.voucherFilterValue.toLowerCase();
    if (!this.voucherFilterValue) {
      this.loadInitialVoucherItems();
    } else {
    this.filteredVoucherList = this.voucherList.filter((vouchers) =>
      vouchers.voucherCode.toLowerCase().includes(query) ||
      vouchers.companyName.toLowerCase().includes(query) ||
      vouchers.guideName.toLowerCase().includes(query)
    );
  }
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
    window.removeEventListener('resize', this.resizeListener);
  }
}
