import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal-print-show',
  templateUrl: './modal-print-show.component.html',
  styleUrls: ['./modal-print-show.component.scss']
})
export class ModalPrintShowComponent implements OnInit {

  public onClose: Subject<number> = new Subject<number>();  
  public message: string = '';
  public icon: string = 'feather icon-alert-triangle';

  constructor(public modalRef: BsModalRef,
    private formBuilder: FormBuilder
  ) { }

  inputForm = this.formBuilder.nonNullable.group({
    input: ['1', Validators.required],
  });


  get input() {
    return this.inputForm.get('input') as FormControl;
  }

  ngOnInit() {
    this.onClose = new Subject();
  }

  modalConfirm(): void {
    this.onClose.next(this.input.value);
    this.modalRef.hide();
  }

  modalDecline(): void {
    this.onClose.next(-1);
    this.modalRef.hide();
  }

}
