import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { ModalSaleTypeConfirmModule } from './modal-sale-type-confirm.module';
export enum ModalType {
  Confirmation,
  Delete
}

@Component({
  selector: 'app-modal-sale-type-confirm',
  templateUrl: './modal-sale-type-confirm.component.html',
  styleUrls: ['./modal-sale-type-confirm.component.scss']
})
export class ModalSaleTypeConfirmComponent {
  public onClose: Subject<any> = new Subject<any>();
  public message: string = '';
  public modalType: ModalType = ModalType.Confirmation;
  ModalType = ModalType;
  public icon: string = 'bi bi-check-circle';

  constructor(public modalRef: BsModalRef, private fb: FormBuilder) {
    this.saleTypeForm = this.fb.group({
      saleType: ['foreign']
    })
   }

  saleTypeForm: FormGroup;

  ngOnInit() {
    this.onClose = new Subject();
  }

  modalConfirm(): void {
    const result = {value: this.saleTypeForm.value.saleType};
    this.onClose.next(result);
    this.modalRef.hide();
  }

  modalDecline(): void {
    this.onClose.next("");
    this.modalRef.hide();
  }
}
