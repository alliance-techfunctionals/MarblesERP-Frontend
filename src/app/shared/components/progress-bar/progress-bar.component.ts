import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit{
  constructor(public modalRef: BsModalRef){}

  ngOnInit(): void {
    
  }

  modalConfirm(): void {
    this.modalRef.hide();
  }
}
