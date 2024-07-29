import { Component, OnInit } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { ModalType } from '../modal-confirm/modal-confirm.component';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DeliveryPartnerStoreService } from '../../store/delivery-partner/delivery-partner.store';
import { DeliveryPartnerService } from '../../store/delivery-partner/delivery-partner.service';
import { DeliveryPartnerModel } from '../../store/delivery-partner/delivery-partner.model';

@Component({
  selector: 'app-modal-input',
  templateUrl: './modal-input.component.html',
  styleUrls: ['./modal-input.component.scss']
})
export default class ModalInputComponent implements OnInit {
  subscriptions: Subscription[] = [];
  
  public onClose: Subject<any> = new Subject<any>();
  public message: string = '';
  public title: string = '';
  public inputValue: any = '';
  public modalType: ModalType = ModalType.Delete;
  ModalType = ModalType;

  deliveryPartnerList$: Observable<DeliveryPartnerModel[]> = this.store.selectAll();

  inputForm = this.formBuilder.nonNullable.group({
    input: ['', Validators.required],
    deliveryPartnerRadioValue: ['1'],
    deliveryPartnerId: [1, Validators.required],
  });

  get deliveryPartnerId() {
    return this.inputForm.get('deliveryPartnerId') as FormControl;
  }

  constructor(
    private store: DeliveryPartnerStoreService,
    private service: DeliveryPartnerService,
    public modalRef: BsModalRef,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.service.getAll().subscribe(),
    )
    this.onClose = new Subject();
  }

  modalConfirm(): void {
    // send the form details
    this.onClose.next(this.inputForm.controls);
    this.modalRef.hide();
  }

  modalDecline(): void {
    this.onClose.next('');
    this.modalRef.hide();
  }

  radioButtonChange(event: Event){
    // console.log(event.target);
    this.deliveryPartnerId.setValue(Number((event.target as HTMLInputElement).value));

  }

}
