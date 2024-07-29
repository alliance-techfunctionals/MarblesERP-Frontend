import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared.module';
import { ProgressBarComponent } from './progress-bar.component';
import { ModalProgressBarRoutingModule } from './progress-bar.routing.module';

@NgModule({
  declarations: [
    ProgressBarComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ModalProgressBarRoutingModule  
  ],
  exports: [
    ProgressBarComponent
  ]
})
export class ModalConfirmModule { }
