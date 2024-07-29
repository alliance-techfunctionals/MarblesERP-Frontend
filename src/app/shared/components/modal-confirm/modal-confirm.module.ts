import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalConfirmComponent } from './modal-confirm.component';
import { ModalConfirmRoutingModule } from './modal-confirm-routing.module';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [
    ModalConfirmComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ModalConfirmRoutingModule
  ],
  exports: [
    ModalConfirmComponent
  ]
})
export class ModalConfirmModule { }
