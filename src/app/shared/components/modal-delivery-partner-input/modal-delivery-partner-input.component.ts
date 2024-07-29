import { Component, OnInit } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { ModalType } from '../modal-confirm/modal-confirm.component';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DeliveryPartnerModel } from '../../store/delivery-partner/delivery-partner.model';
import { DeliveryPartnerStoreService } from '../../store/delivery-partner/delivery-partner.store';
import { DeliveryPartnerService } from '../../store/delivery-partner/delivery-partner.service';

@Component({
  selector: 'app-modal-delivery-partner-input',
  templateUrl: './modal-delivery-partner-input.component.html',
  styleUrls: ['./modal-delivery-partner-input.component.scss']
})
export default class ModalDeliveryPartnerInputComponent implements OnInit {
  public onClose: Subject<any> = new Subject<any>();
  public message: string = '';
  public title: string = '';
  public inputValue: any = '';
  public modalType: ModalType = ModalType.Delete;
  ModalType = ModalType;

  // subscription
  subscriptions: Subscription[] = [];

  // users List
  deliveryPartnersList$: Observable<DeliveryPartnerModel[]> = this.store.selectAll();

  inputForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    url: ['', Validators.required],
  });

  constructor(
    private service: DeliveryPartnerService,
    private store: DeliveryPartnerStoreService,
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
}
