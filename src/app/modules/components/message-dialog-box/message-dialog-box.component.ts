import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-message-dialog-box',
  standalone:true,
  templateUrl: './message-dialog-box.component.html',
  styleUrls: ['./message-dialog-box.component.scss']
})
export default class MessageDialogBoxComponent {
  static MessageDialogBoxComponent(MessageDialogBoxComponent: any): (target: import("../../User/user-detail/user-detail.component").default, propertyKey: "genericDialog") => void {
    throw new Error('Method not implemented.');
  }
  constructor(private modalService: BsModalService){}
  @Input('messageC') messageC!: string; //we will get this message from parent component(from where it is called)
  modalRef?: BsModalRef;
  resolve: any;

  //getting access to html template
  @ViewChild('template') modalTemplate!: TemplateRef<void>;

  //if yes is clicked, we get 'true'
  public confirm(){
    this.modalRef?.hide();
    this.resolve(true);
  }

  //if no is clicked, we get 'false'
  public decline(){
    this.modalRef?.hide();
    this.resolve(false);
  }

  public openModal(){
    this.modalRef = this.modalService.show(this.modalTemplate, { class: 'modal-sm' });

    //creating promise to wait for result, untill user clicks yes or no
    return new Promise((resolve) =>{
      this.resolve = resolve;
    })
  }
}
