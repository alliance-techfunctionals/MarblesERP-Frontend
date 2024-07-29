import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, combineLatest, tap } from 'rxjs';
import { GetOrderNoByIdPipe } from 'src/app/core/pipes/get-orderNo-by-id.pipe';
import { CURRENCY_DATA } from 'src/app/shared/DataBase/currencyList';
import { PendingPaymentService } from 'src/app/shared/store/pending-payment/pending-payment.service';
import { PendingPaymentStoreService } from 'src/app/shared/store/pending-payment/pending-payment.store';
import { SubPendingPaymentForm, SubPendingPaymentModel, createSubPendingPaymentModel } from 'src/app/shared/store/sub-pending-payment/sub-pending-payment.model';
import { SubPendingPaymentService } from 'src/app/shared/store/sub-pending-payment/sub-pending-payment.service';
import { SubPendingPaymentStoreService } from 'src/app/shared/store/sub-pending-payment/sub-pending-payment.store';

@Component({
  selector: 'app-pending-payment-detail',
  templateUrl: './pending-payment-detail.component.html',
  styleUrls: ['./pending-payment-detail.component.scss']
})
export default class PendingPaymentDetailComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  currencyList = CURRENCY_DATA;

  // flag for due received or not
  isDueReceived: boolean = false;

  pendingPaymentForm: FormGroup<SubPendingPaymentForm> = this.formBuilder.nonNullable.group({
    id: [0],
    masterId: [0],
    orderNo: [''],
    amount: [0, Validators.required],
    currency: ['', Validators.required],
    status: ['false', Validators.required],
    comments: ['', Validators.required],
    paymentDueDate: ['', Validators.required]
  });

  get pendingPaymentFormControl() {
    return this.pendingPaymentForm.controls;
  }

  get id() {
    return this.pendingPaymentForm.get('id') as FormControl;
  }

  get masterId() {
    return this.pendingPaymentForm.get('masterId') as FormControl;
  }

  get amount() {
    return this.pendingPaymentForm.get('amount') as FormControl;
  }

  get currency() {
    return this.pendingPaymentForm.get('currency') as FormControl;
  }

  get paymentDueDate() {
    return this.pendingPaymentForm.get('paymentDueDate') as FormControl;
  }

  get status() {
    return this.pendingPaymentForm.get('status') as FormControl;
  }

  get comments() {
    return this.pendingPaymentForm.get('comments') as FormControl;
  }

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private store: SubPendingPaymentStoreService,
    private subPendingPaymentService: SubPendingPaymentService,
    private getOrderNoPipe: GetOrderNoByIdPipe,
    private datePipe: DatePipe,
    private _router: Router
  ) { }

  ngOnInit(): void {
    // get user role

    this.subscriptions.push(
      combineLatest([
        this.route.params,
      ]).pipe(
        tap(([params]) => {
          if (params['id'] != 0) {
            const subPendingPaymentId = Number(params['id']);
            const subPendingPayment = this.store.getById(subPendingPaymentId) ?? createSubPendingPaymentModel({})
            let orderNo = '';
            this.getOrderNoPipe.transform(subPendingPayment.masterOrderId).pipe(
              tap((res) => {
                if(res){
                  orderNo = res;
                }
              })
            ).subscribe();
            // console.log(subPendingPayment);
            // console.log(subPendingPayment.paymentDueDate.toISOString());
            const formattedDate = this.datePipe.transform(subPendingPayment.paymentDueDate,'yyyy-MM-dd')
            this.pendingPaymentForm.setValue({
              id: subPendingPayment.id,
              masterId: subPendingPayment.masterOrderId,
              orderNo: orderNo,
              amount: subPendingPayment.amount,
              status: subPendingPayment.status?'true':'false',
              comments: subPendingPayment.comments,
              paymentDueDate: formattedDate!,
              currency: subPendingPayment.ccyCode
            })
          }
        })
      ).subscribe()
    );

  }

  // submit button click
  protected uppertPendingPayment(): void {
    const pendingPayment = createSubPendingPaymentModel({
      id: this.id.value,
      masterOrderId: this.masterId.value,
      amount: this.amount.value,
      status: this.status.value=="true"?true: false,
      paymentDueDate: this.paymentDueDate.value,
      ccyCode: this.currency.value,
      comments: this.comments.value
    });

    if (this.pendingPaymentForm.valid || this.pendingPaymentForm.disabled) {
      this.subscriptions.push(
        this.subPendingPaymentService.upsertSubPendingPayment(pendingPayment).pipe(
          tap(() => {
            this.pendingPaymentForm.markAsPristine(),
              this.navigate();
          })
        ).subscribe()
      );
    }
  }

  patchPendingPayment(): void {
    this.subscriptions.push(
      this.subPendingPaymentService.patchSubPendingPayment(this.id.value, this.status.value=='true'?false:true).pipe(
        tap(() => {
          this.pendingPaymentForm.markAsPristine(),
          this.navigate();
        })
      ).subscribe()
    )
  }

  // radio buttons clicked
  dueRadioChange(){
    this.isDueReceived = false;
  }

  completedRadioChange(){
    this.isDueReceived = true;
  }


  protected cancel(): void {
    this._router.navigate(['pending-payment/pending',this.masterId.value]);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // navigate to list page
  navigate() {
    this._router.navigate(['/pending-payment/pending',this.masterId.value]);
  }

}
