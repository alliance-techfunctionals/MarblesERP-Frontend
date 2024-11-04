import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Ensure FormsModule is imported here
import { ModalDeleteInventoryComponent } from './modal-delete-inventory.component';

@NgModule({
  declarations: [
    ModalDeleteInventoryComponent // Declare the component here
  ],
  imports: [
    CommonModule,
    FormsModule // Import FormsModule here
  ],
  exports: [
    ModalDeleteInventoryComponent
  ]
})
export class ModalDeleteInventoryModule {}
