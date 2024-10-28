// Angular Import
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// project import
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { CardComponent } from './components/card/card.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

// third party
import 'hammerjs';
import 'mousetrap';
import { NgClickOutsideDirective } from 'ng-click-outside2';
import { NgScrollbarModule } from 'ngx-scrollbar';

// bootstrap import
import { NgbDropdownModule, NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDropdownConfig, BsDropdownModule } from "ngx-bootstrap/dropdown";
import { AgCustomDropdownComponent } from "./components/Button/ag-custom-dropdown/ag-custom-dropdown.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    BreadcrumbComponent,
    BsDropdownModule.forRoot(),
    NgbDropdownModule,
    NgbNavModule,
    NgbModule,
    NgScrollbarModule,
    NgClickOutsideDirective
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    BreadcrumbComponent,
    SpinnerComponent,
    NgbModule,
    NgbDropdownModule,
    NgbNavModule,
    NgScrollbarModule,
    NgClickOutsideDirective,
    AgCustomDropdownComponent,
    
  ],

  declarations: [ SpinnerComponent, AgCustomDropdownComponent],
  providers: [
    {
      provide: BsDropdownConfig,
      useValue: { isAnimated: true, autoClose: true },
    },
  ],
})
export class SharedModule {}
