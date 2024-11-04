import { Component, Input, OnInit } from '@angular/core';
import { values } from 'lodash';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

export enum ModalType {
  Confirmation,
  Delete
}

interface InventoryItem {
  guid: string;
  name: string;
  selected: boolean;
}

@Component({
  selector: 'app-modal-delete',
  templateUrl: './modal-delete-inventory.component.html',
  styleUrls: ['./modal-delete-inventory.component.scss']
})




export class ModalDeleteInventoryComponent implements OnInit {

  checkbox = false;

  @Input() inventoryList: InventoryItem[] = []; // List of items for deletion
  public onClose: Subject<any> = new Subject<any>();
  public message: string = '';
  public modalType: ModalType = ModalType.Delete;
  ModalType = ModalType;
  public icon: string = 'feather icon-trash-2';

  constructor(public modalRef: BsModalRef) { }

  ngOnInit() {
    this.onClose = new Subject();
  }

  onCheckboxClick(event: any): void {
    if(event.target.checked){
        this.checkbox = true;
    }else{
        this.checkbox = false;
    }
    console.log(this.checkbox)
  }

  onCheckboxChange(guid: string): void {

    console.log(this.checkbox)
    const allSelected = this.inventoryList.every(item => item.selected);
    if (allSelected) {
      this.message = 'delete all selected items';
    } else {
      this.message = 'delete selected items';
    }
  }

  modalConfirm(): void {
    const result = {value:this.checkbox}
    this.onClose.next(result);
    this.modalRef.hide();
  }

  modalDecline(): void {
    this.onClose.next("");
    this.modalRef.hide();
  }
}
