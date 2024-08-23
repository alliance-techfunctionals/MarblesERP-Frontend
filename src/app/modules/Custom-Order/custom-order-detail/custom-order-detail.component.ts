import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subscription, combineLatest, tap } from 'rxjs';
import { createPagination, Pagination } from 'src/app/core/models/pagination.model';
import { ImageService } from 'src/app/core/service/Image.service';
import { ModalConfirmComponent, ModalType } from 'src/app/shared/components/modal-confirm/modal-confirm.component';
import { DateService } from 'src/app/shared/service/date.service';
import { createCustomOrderProgressModel, CustomOrderProgressForm, CustomOrderProgressModel } from 'src/app/shared/store/custom-order-progress/custom-order-progress.model';
import { CustomOrderProgressService } from 'src/app/shared/store/custom-order-progress/custom-order-progress.service';
import { CustomOrderProgressStoreService } from 'src/app/shared/store/custom-order-progress/custom-order-progress.store';
import { CustomOrderForm, createCustomOrderModel } from 'src/app/shared/store/custom-order/custom-order.model';
import { CustomOrderService } from 'src/app/shared/store/custom-order/custom-order.service';
import { CustomOrderStoreService } from 'src/app/shared/store/custom-order/custom-order.store';
import { Role } from 'src/app/shared/store/role/role.model';
import { RoleService } from 'src/app/shared/store/role/role.service';
import { RoleStoreService } from 'src/app/shared/store/role/role.store';
import { UserModel } from 'src/app/shared/store/user/user.model';
import { UserService } from 'src/app/shared/store/user/user.service';
import { UserStoreService } from 'src/app/shared/store/user/user.store';

@Component({
  selector: 'app-custom-order-detail',
  templateUrl: './custom-order-detail.component.html',
  styleUrls: ['./custom-order-detail.component.scss']
})
export default class CustomOrderDetailComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  // pagination config
  pagingConfig: Pagination = createPagination({});
  
  roleList$: Observable<Role[]> = this.roleStoreService.selectAll();
  suppliersList$: Observable<UserModel[]> = this.userStoreService.selectByRoleId(5000);
  personOfContactList$: Observable<UserModel[]> = this.userStoreService.selectByRoleId(3000);

  // custom order progress List
  customOrderProgressList$: Observable<CustomOrderProgressModel[]> = this.customOrderProgressStore.selectAll();

  // default date
  orderDate1: NgbDate = this.calendar.getToday();
  dateOfDelivery: NgbDate = this.calendar.getToday(); // custom order should be delivered by this date
  limitDate:NgbDate = this.orderDate1;

  // flag for order progress update or create
  modifyProgress: boolean = false;

  // form group for custom order
  customOrderForm: FormGroup<CustomOrderForm> = this.formBuilder.nonNullable.group({
    id: [0],
    masterOrderId: [0],
    orderDate: [{ value: '', disabled: true }, Validators.required],
    orderNumber: [{ value: '', disabled: true }, Validators.required],
    orderDescription: [{ value: '', disabled: true }, Validators.required],
    supplierId: [0, [Validators.required, Validators.min(1)]],
    pocId: [0, [Validators.required, Validators.min(1)]],
    edd: [new Date(), Validators.required],
  });

  // form group for custom order progress
  customOrderProgressForm: FormGroup<CustomOrderProgressForm> = this.formBuilder.nonNullable.group({
    id: [0],
    saleDetailId: [0],
    file: [null, Validators.required],
    fileUrl: [''],
    comments: ['',Validators.required]
  }) as any;

  // getters for custom order
  get customOrderFormControl() {
    return this.customOrderForm.controls;
  }

  get id() {
    return this.customOrderForm.get('id') as FormControl;
  }

  get supplierId() {
    return this.customOrderForm.get('supplierId') as FormControl;
  }

  get orderNumber() {
    return this.customOrderForm.get('orderNumber') as FormControl;
  }

  get edd() {
    return this.customOrderForm.get('edd') as FormControl;
  }

  get pocId() {
    return this.customOrderForm.get('pocId') as FormControl;
  }

  get orderDate() {
    return this.customOrderForm.get('orderDate') as FormControl;
  }

  get orderDescription() {
    return this.customOrderForm.get('orderDescription') as FormControl;
  }

  get masterOrderId() {
    return this.customOrderForm.get('masterOrderId') as FormControl;
  }

  // getters for custom order progress
  get saleDetailId() {
    return this.customOrderProgressForm.get('saleDetailId') as FormControl;
  }

  get progressId() {
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
    private store: CustomOrderStoreService,
    private customOrderService: CustomOrderService,
    private customOrderProgressStore: CustomOrderProgressStoreService,
    private customOrderProgressService: CustomOrderProgressService,
    private userService: UserService,
    private roleService: RoleService,
    private roleStoreService: RoleStoreService,
    private userStoreService: UserStoreService,
    private modalService: BsModalService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    protected dateService: DateService,
    private datePipe: DatePipe,
    private _router: Router,
    public imageService: ImageService
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(
      combineLatest([
        this.route.params,
        this.userService.getAll(),
        this.roleService.getAll(),
        this.customOrderService.getAll(),
      ]).pipe(
        tap(([params]) => {
          if (params['id'] != 0) {
            const customOrderId = Number(params['id']);
            const customOrder  = this.store.getById(customOrderId) ?? createCustomOrderModel({})
            const formatedOrderDate = this.datePipe.transform(customOrder.orderDate, 'yyyy-MM-dd')
            this.orderDate1 = new NgbDate(Number(formatedOrderDate?.split('-',3)[0]), Number(formatedOrderDate?.split('-',3)[1]), Number(formatedOrderDate?.split('-',3)[2]))
            const formattedEdd = this.datePipe.transform(customOrder.edd, 'yyyy-MM-dd')
            if (formattedEdd != null){
              this.dateOfDelivery = new NgbDate(Number(formattedEdd?.split('-',3)[0]), Number(formattedEdd?.split('-',3)[1]), Number(formattedEdd?.split('-',3)[2]))
              }
            this.customOrderForm.setValue({
              id: customOrder.id,
              supplierId: customOrder.supplierId? customOrder.supplierId: 0,
              pocId: customOrder.pocId? customOrder.pocId: 0,
              orderNumber: customOrder.orderNumber,
              edd: customOrder.edd? customOrder.edd: new Date(),
              orderDate: customOrder.orderDate,
              orderDescription: customOrder.orderDescription + '\n' + customOrder.productComments,
              masterOrderId: customOrder.masterOrderId,
            })

            // getting custom order progress list
            this.customOrderProgressList$ = this.customOrderProgressService.getAll(customOrderId);
          }
        })
      ).subscribe()
    );

  }

  // submit button click
  protected uppertCustomOrder(): void {
    const customOrder = createCustomOrderModel({
      id: this.id.value,
      masterOrderId: this.id.value,
      orderNumber: this.orderNumber.value,
      orderDate: this.orderDate.value,
      orderDescription: this.orderDescription.value,
      pocId: this.pocId.value,
      edd: new Date(this.dateOfDelivery!.year,this.dateOfDelivery!.month - 1, this.dateOfDelivery!.day),
      supplierId: this.supplierId.value,
    });

    if (this.customOrderForm.valid || this.customOrderForm.disabled) {
      this.subscriptions.push(
        this.customOrderService.upsertCustomOrder(customOrder).pipe(
          tap(() => {
            this.customOrderForm.markAsPristine(),
            this.navigate();
          })
        ).subscribe()
      );
    }
  }

  // submit button click
  protected uppertCustomOrderProgress(): void {
    const customOrderProgress = createCustomOrderProgressModel({
      id: this.progressId.value,
      saleDetailId: this.id.value,
      imageUrl: this.fileUrl.value,
      comments: this.comments.value,
      image: this.file.value
    });

    if (this.modifyProgress? this.comments.valid: this.customOrderProgressForm.valid || this.customOrderProgressForm.disabled) {
      this.subscriptions.push(
        this.customOrderProgressService.upsertCustomProgressOrder(customOrderProgress).pipe(
          tap(() => {
            this.clear();
            this.customOrderProgressForm.markAsPristine();
            this.customOrderProgressList$ = this.customOrderProgressStore.selectAll();
          })
        ).subscribe()
      )
    }
  }

  clear(): void{
    this.progressId.setValue(0);
    this.comments.setValue('');
    this.file.setValue(null);
    this.modifyProgress = false;
  }

  protected openDeleteConfirmationModal(item: CustomOrderProgressModel) {
    const initialState = {
      item,
      message: `delete progress: ${item.comments}`,
      modalType: ModalType.Confirmation
    };

    const modalRef = this.modalService.show(ModalConfirmComponent, { initialState, class: 'modal-sm modal-dialog-centered' });
    const sub = modalRef.content?.onClose.pipe(
      tap(
        (result: boolean) => {
          if (result) {
            this.customOrderProgressService.deleteCustomOrderProgress(item);
            this.customOrderProgressList$ = this.customOrderProgressStore.selectAll();
          }
        }
      )
    ).subscribe();

    if (sub) {
      this.subscriptions.push(sub);
    }
  }

  // get the image file
  onFileSelect(event: Event){
    if(event.target instanceof HTMLInputElement && event.target.files?.length){
      this.file.setValue(event.target.files[0]);
    }  
  }

  progressEdit(order: CustomOrderProgressModel): void{
    this.progressId.setValue(order.id);
    this.comments.setValue(order.comments);
    this.modifyProgress = true;
    this.file.setValue(order.image);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.customOrderProgressStore.resetStore()
  }

  // navigate to list page
  navigate() {
    this._router.navigate(['/custom-order']);
  }
}
