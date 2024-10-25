import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../../shared.module";
import { ModalCancelConfirmRoutingModule } from "./modal-cancel-confirm-routing.module";
import { ModalCancelConfirmComponent } from "./modal-cancel-confirm.component";

@NgModule({
  declarations: [ModalCancelConfirmComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ModalCancelConfirmRoutingModule 
  ],
  exports: [ModalCancelConfirmComponent],
})
export class ModalCancelConfirmModule {}
