import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

export enum ModalType {
  Confirmation,
  Delete
}

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss']
})
export class ModalConfirmComponent implements OnInit {

  public onClose: Subject<boolean> = new Subject<boolean>();  
  public message: string = '';
  public modalType: ModalType = ModalType.Delete;
  ModalType = ModalType;
  public icon: string = 'feather icon-trash-2';

  constructor(public modalRef: BsModalRef) { }

  ngOnInit() {
    this.onClose = new Subject();
  }

  modalConfirm(): void {
    this.onClose.next(true);
    this.modalRef.hide();
  }

  modalDecline(): void {
    this.onClose.next(false);
    this.modalRef.hide();
  }

}
