import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Ensure FormsModule is imported here
import { ModalSaleTypeConfirmComponent } from './modal-sale-type-confirm.component';

@NgModule({
  declarations: [
    ModalSaleTypeConfirmComponent // Declare the component here
  ],
  imports: [
    CommonModule,
    FormsModule, // Import FormsModule here
    ReactiveFormsModule
  ],
  exports: [
    ModalSaleTypeConfirmComponent // Export the component here
  ]
})
export class ModalSaleTypeConfirmModule {}
