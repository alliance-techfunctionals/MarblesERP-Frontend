import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-dialog-box',
  standalone:true,
  templateUrl: './input-dialog-box.component.html',
  styleUrls: ['./input-dialog-box.component.scss'],
  imports:[FormsModule]
})
export class InputDialogBoxComponent {
  static MessageDialogBoxComponent(MessageDialogBoxComponent: any): (target: import("../../User/user-detail/user-detail.component").default, propertyKey: "genericDialog") => void {
    throw new Error('Method not implemented.');
  }
  constructor(private modalService: BsModalService){}
  @Input('messageC') messageC!: string; //we will get this message from parent component(from where it is called)
  modalRef?: BsModalRef;
  resolve: any;
  userInput: string = '';

  //getting access to html template
  @ViewChild('template') modalTemplate!: TemplateRef<void>;

  //if yes is clicked, we get 'true' and userInput
  public confirm(){
    this.modalRef?.hide();
    this.resolve({ confirmed: true, userInput: this.userInput });
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
