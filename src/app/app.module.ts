
// Angular Import
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// project import
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { TabsModule } from 'ngx-bootstrap/tabs';
// import MessageDialogBoxComponent from './demo/components/message-dialog-box/message-dialog-box.component';
// import {  Actions } from '@ngneat/effects-ng';


//Service Import
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material.module';
// import { StoreModule } from '@ngrx/store';
// import { rootReducer } from './reducers';
import { devTools } from '@ngneat/elf-devtools';
import { enableElfProdMode } from '@ngneat/elf';
import { environment } from 'src/environments/environment';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { ConfigurationComponent } from './theme/layout/admin/configuration/configuration.component';
import { NavBarComponent } from './theme/layout/admin/nav-bar/nav-bar.component';
import { NavigationComponent } from './theme/layout/admin/navigation/navigation.component';
import { NavLeftComponent } from './theme/layout/admin/nav-bar/nav-left/nav-left.component';
import { NavRightComponent } from './theme/layout/admin/nav-bar/nav-right/nav-right.component';
import { NavSearchComponent } from './theme/layout/admin/nav-bar/nav-left/nav-search/nav-search.component';
import { ChatMsgComponent } from './theme/layout/admin/nav-bar/nav-right/chat-msg/chat-msg.component';
import { ChatUserListComponent } from './theme/layout/admin/nav-bar/nav-right/chat-user-list/chat-user-list.component';
import { FriendComponent } from './theme/layout/admin/nav-bar/nav-right/chat-user-list/friend/friend.component';
import { NavContentComponent } from './theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavItemComponent } from './theme/layout/admin/navigation/nav-content/nav-item/nav-item.component';
import { NavCollapseComponent } from './theme/layout/admin/navigation/nav-content/nav-collapse/nav-collapse.component';
import { NavGroupComponent } from './theme/layout/admin/navigation/nav-content/nav-group/nav-group.component';
import { ModalConfirmRoutingModule } from './shared/components/modal-confirm/modal-confirm-routing.module';
import { NgbAccordionDirective, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';
// import { environment } from 'src/environments/environment';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
import { ModalInputRoutingModule } from './shared/components/modal-input/modal-input.routing.module';

import { ModalProgressBarRoutingModule } from './shared/components/progress-bar/progress-bar.routing.module';
// ngx chips or tags import
import { TagInputModule } from 'ngx-chips';
import { ModalDeliveryPartnerInputModule } from './shared/components/modal-delivery-partner-input/modal-delivery-partner-input.module';
import { AgCustomButtonComponent } from './shared/components/Button/ag-custom-button/ag-custom-button.component';

export function initElfDevTools() {
  return () => {
    devTools({
      name: 'carpet'
    })
  };
}

if (environment.production) {
  enableElfProdMode()
}

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    GuestComponent,
    ConfigurationComponent,
    NavBarComponent,
    NavigationComponent,
    NavLeftComponent,
    NavRightComponent,
    NavSearchComponent,
    ChatMsgComponent,
    ChatUserListComponent,
    FriendComponent,
    NavContentComponent,
    NavItemComponent,
    NavCollapseComponent,
    NavGroupComponent,
    AgCustomButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    ModalConfirmRoutingModule,
    ModalInputRoutingModule,
    ModalDeliveryPartnerInputModule,
    ModalProgressBarRoutingModule,
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    TypeaheadModule.forRoot(),
    TabsModule.forRoot(),
    NgbAccordionModule,
    CommonModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    }),
    CdkStepperModule,
    NgStepperModule,
    TagInputModule,
  ],
  providers: [{
    provide: [APP_INITIALIZER, LocationStrategy],
    multi: true,
    useFactory: initElfDevTools,
    useClass: PathLocationStrategy
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
