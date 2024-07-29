// Angular Import
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// project import
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { CardComponent } from './components/card/card.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

// third party
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgClickOutsideDirective } from 'ng-click-outside2';
import 'hammerjs';
import 'mousetrap';

// bootstrap import
import { NgbDropdownModule, NgbNavModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    BreadcrumbComponent,
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
    NgClickOutsideDirective
  ],
  declarations: [ SpinnerComponent]
})
export class SharedModule {}
