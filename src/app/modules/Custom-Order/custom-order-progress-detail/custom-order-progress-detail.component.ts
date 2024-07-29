import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { combineLatest, Subscription, tap } from 'rxjs';
import { ModalConfirmComponent, ModalType } from 'src/app/shared/components/modal-confirm/modal-confirm.component';
import { createCustomOrderProgressModel, CustomOrderProgressForm, CustomOrderProgressModel } from 'src/app/shared/store/custom-order-progress/custom-order-progress.model';
import { CustomOrderProgressService } from 'src/app/shared/store/custom-order-progress/custom-order-progress.service';
import { CustomOrderProgressStoreService } from 'src/app/shared/store/custom-order-progress/custom-order-progress.store';

@Component({
  selector: 'app-custom-order-progress-detail',
  templateUrl: './custom-order-progress-detail.component.html',
  styleUrls: ['./custom-order-progress-detail.component.scss']
})
export default class CustomOrderProgressDetailComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  customOrderProgressForm: FormGroup<CustomOrderProgressForm> = this.formBuilder.nonNullable.group({
    id: [0],
    saleDetailId: [0],
    file: [null],
    fileUrl: [''],
    comments: ['',Validators.required]
  }) as any;


  get saleDetailId() {
    return this.customOrderProgressForm.get('saleDetailId') as FormControl;
  }

  get id() {
    return this.customOrderProgressForm.get('id') as FormControl;
  }

  get file() {
    return this.customOrderProgressForm.get('file') as FormControl;
  }

  get fileUrl() {
    return this.customOrderProgressForm.get('fileUrl') as FormControl;
  }

  get comments() {
    return this.customOrderProgressForm.get('comments') as FormControl;
  }

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private store: CustomOrderProgressStoreService,
    private customOrderProgressService: CustomOrderProgressService,
    private modalService: BsModalService,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    // get inventory
    this.subscriptions.push(
      combineLatest([
        this.route.params,
      ]).pipe(
        tap(([params]) => {
          if (params['id'] != '0') {
            const customOrderProgressId = Number(params['id']);
            const customOrderProgress = this.store.getById(customOrderProgressId) ?? createCustomOrderProgressModel({})
            this.customOrderProgressForm.setValue({
              id: customOrderProgress.id,
              saleDetailId: customOrderProgress.saleDetailId,
              fileUrl: '', //customOrderProgress.imageUrl,
              file: customOrderProgress.image,
              comments: customOrderProgress.comments
            });
          }
          else{
            // set sale order id bcozz its required in case of new progress insert
            this.saleDetailId.setValue(params['saleOrderId']);
          }
        })
      ).subscribe()
    );

  }

  // submit button click
  protected uppertCustomOrderProgress(): void {
    const customOrderProgress = createCustomOrderProgressModel({
      id: this.id.value,
      saleDetailId: this.saleDetailId.value,
      imageUrl: this.fileUrl.value,
      comments: this.comments.value,
      image: this.file.value
    });

    if (this.customOrderProgressForm.valid || this.customOrderProgressForm.disabled) {
      this.subscriptions.push(
        this.customOrderProgressService.upsertCustomProgressOrder(customOrderProgress).pipe(
          tap(() => {
            this.customOrderProgressForm.markAsPristine(),
            this.navigate();
          })
        ).subscribe()
    )
    }
  }

  protected openUpdateConfirmationModal(item: CustomOrderProgressModel) {
    const initialState = {
      item,
      message: `delete custom order progress detail: ${item.id}`,
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

  // navigate to list page
  navigate(){
    this._router.navigate(['/custom-order/progress', this.saleDetailId.value]);
  }

  protected cancel(): void {
    //  cancel the
  }
  
  // get the image file
  onFileSelect(event: Event){
    if(event.target instanceof HTMLInputElement && event.target.files?.length){
      this.file.setValue(event.target.files[0]);
    }  
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }


}
