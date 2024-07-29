import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { combineLatest, Observable, Subscription, tap } from 'rxjs';
import { createPagination, Pagination } from 'src/app/core/models/pagination.model';
import { ModalConfirmComponent, ModalType } from 'src/app/shared/components/modal-confirm/modal-confirm.component';
import { CustomOrderProgressService } from 'src/app/shared/store/custom-order-progress/custom-order-progress.service';
import { CustomOrderProgressStoreService } from 'src/app/shared/store/custom-order-progress/custom-order-progress.store';
import { CustomOrderProgressModel } from 'src/app/shared/store/custom-order-progress/custom-order-progress.model';
import { ImageService } from 'src/app/core/service/Image.service';

@Component({
  selector: 'app-custom-order-progress-list',
  templateUrl: './custom-order-progress-list.component.html',
  styleUrls: ['./custom-order-progress-list.component.scss']
})
export default class CustomOrderProgressListComponent implements OnInit, OnDestroy{
  // pagination config
  pagingConfig: Pagination = createPagination({});

  public active = 1;

  // users List
  customOrderProgressList$: Observable<CustomOrderProgressModel[]> = this.store.selectAll();

  // sale order id
  saleOrderId: number = 0;

  // subscription
  subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: CustomOrderProgressStoreService,
    private customOrderProgressService: CustomOrderProgressService,
    private imageService: ImageService,
    private modalService: BsModalService

  ) { }

  ngOnInit() {
    this.store.resetStore(); // resetting the store bcoz not showing the list after one time
    this.subscriptions.push(
      combineLatest([
        this.route.params,
      ]).pipe(
        tap(([params]) => {
          if (params['id'] != 0) {
            const customOrderProgressId = Number(params['id']);
            this.saleOrderId = customOrderProgressId;
            this.customOrderProgressList$ = this.customOrderProgressService.getAll(customOrderProgressId);
            
            
          }
        })
      ).subscribe()
    );
  }

  // navigate to CustomOrder
  protected navigate(id: number = 0): void {
    this.router.navigate(['custom-order/progressDetail',this.saleOrderId, id]);
  }

  protected openDeleteConfirmationModal(item: CustomOrderProgressModel) {
    const initialState = {
      item,
      // message: `delete custom order: ${item.orderNumberId}`,
      modalType: ModalType.Confirmation
    };

    const modalRef = this.modalService.show(ModalConfirmComponent, { initialState, class: 'modal-sm modal-dialog-centered' });
    const sub = modalRef.content?.onClose.pipe(
      tap(
        (result: boolean) => {
          if (result) {
            this.customOrderProgressService.deleteCustomOrderProgress(item);
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
