import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../shared.module';
import {  ModalDeleteInventoryModule } from './modal-delete-inventory.module';
import { ModalDeleteInventoryComponent } from './modal-delete-inventory.component';

describe('ModalDeleteInventoryComponent', () => {
    let component: ModalDeleteInventoryComponent;
    let fixture: ComponentFixture<ModalDeleteInventoryComponent>;
    let bsModalRef: Partial<BsModalRef>

    beforeEach(waitForAsync(() => {
        bsModalRef = {};
        TestBed.configureTestingModule({
            declarations: [ModalDeleteInventoryComponent],
            providers: [
                { provide: BsModalRef, useValue: bsModalRef }
            ],
            imports: [SharedModule]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalDeleteInventoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("Modal Delete Inventory Component should be generated ", () => {
        component.ngOnInit();
        expect(component).toBeTruthy();
    });

    it("Breadcrumb Component Methods Existance Test", () => {
        expect(component.modalConfirm).toBeDefined();
        expect(component.modalDecline).toBeDefined();
    });


});
