import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { BsModalRef } from "ngx-bootstrap/modal";
import { Subject } from "rxjs";

export enum ModalType {
  Confirmation,
  Delete,
}

@Component({
  selector: "app-modal--cancel-confirm",
  templateUrl: "./modal-cancel-confirm.component.html",
  styleUrls: ["./modal-cancel-confirm.component.scss"],
})
export class ModalCancelConfirmComponent implements OnInit {
  public onClose: Subject<string> = new Subject<string>();
  public message: string = "";
  public modalType: ModalType = ModalType.Delete;
  ModalType = ModalType;
  public icon: string = "feather icon-x-circle fs-1 text-danger";

  comment = new FormControl("");

  constructor(
    public modalRef: BsModalRef,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.onClose = new Subject();
  }

  modalConfirm(): void {
    // console.log("this.comment.value",this.comment.value)
    this.onClose.next(this.comment.value ?? '');
    this.modalRef.hide();
  }

  modalDecline(): void {
    this.onClose.next("");
    this.modalRef.hide();
  }
}
