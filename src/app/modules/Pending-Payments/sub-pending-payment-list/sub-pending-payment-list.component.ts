import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subscription, combineLatest, tap } from 'rxjs';
import { Pagination, createPagination } from 'src/app/core/models/pagination.model';
import { ModalConfirmComponent, ModalType } from 'src/app/shared/components/modal-confirm/modal-confirm.component';
import { PendingPaymentStoreService } from 'src/app/shared/store/pending-payment/pending-payment.store';
import { SaleService } from 'src/app/shared/store/sales/sale.service';
import { SaleStoreService } from 'src/app/shared/store/sales/sale.store';
import { SubPendingPaymentModel } from 'src/app/shared/store/sub-pending-payment/sub-pending-payment.model';
import { SubPendingPaymentService } from 'src/app/shared/store/sub-pending-payment/sub-pending-payment.service';
import { SubPendingPaymentStoreService } from 'src/app/shared/store/sub-pending-payment/sub-pending-payment.store';

@Component({
  selector: 'app-sub-pending-payment-list',
  templateUrl: './sub-pending-payment-list.component.html',
  styleUrls: ['./sub-pending-payment-list.component.scss']
})
export default class SubPendingPaymentListComponent implements OnInit, OnDestroy{
  // pagination config
  pagingConfig: Pagination = createPagination({});
  subPendingPaymentList$?: Observable<SubPendingPaymentModel[]> = this.subPendingPaymentStoreService.selectAll();
  public active = 1;
  pendingPaymentId: number = 0;

  // subscription
  subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: PendingPaymentStoreService,
    private subPendingPaymentService: SubPendingPaymentService,
    private subPendingPaymentStoreService: SubPendingPaymentStoreService,
    private modalService: BsModalService,
    private saleService: SaleService,
    private saleStoreService: SaleStoreService
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      combineLatest([
        this.route.params,
        this.saleService.getAll()
      ]).pipe(
        tap(([params]) => {
          if (params['id']) {
            this.pendingPaymentId = Number(params['id']);
            // console.log(this.pendingPaymentId);
            // users List
            this.subPendingPaymentStoreService.resetSubPendingPaymentStore();
            this.subPendingPaymentList$ = this.subPendingPaymentService.getAll(this.pendingPaymentId);

          }
        })
      ).subscribe()
    );
  }

  // navigate to Pending Payment
  protected navigatePendingPayment(id: number = 0): void {
    this.router.navigate(['pending-payment', id]);
  }

  protected openDeleteConfirmationModal(item: SubPendingPaymentModel) {
    const initialState = {
      item,
      message: `delete pending payment: ${item.masterOrderId}`,
      modalType: ModalType.Confirmation
    };

    const modalRef = this.modalService.show(ModalConfirmComponent, { initialState, class: 'modal-sm modal-dialog-centered' });
    const sub = modalRef.content?.onClose.pipe(
      tap(
        (result: boolean) => {
          if (result) {
            this.subPendingPaymentService.deleteSubPendingPayment(item);
          }
        }
      )
    ).subscribe();

    if (sub) {
      this.subscriptions.push(sub);
    }
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
