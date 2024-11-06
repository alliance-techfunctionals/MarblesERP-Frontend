import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../shared.module';
import { ModalConfirmComponent } from './modal-confirm.component';

describe('ModalConfirmComponent', () => {
    let component: ModalConfirmComponent;
    let fixture: ComponentFixture<ModalConfirmComponent>;
    let bsModalRef: Partial<BsModalRef>

    beforeEach(waitForAsync(() => {
        bsModalRef = {};
        TestBed.configureTestingModule({
            declarations: [ModalConfirmComponent],
            providers: [
                { provide: BsModalRef, useValue: bsModalRef }
            ],
            imports: [SharedModule]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalConfirmComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("Modal Confirm Component should be generated ", () => {
        component.ngOnInit();
        expect(component).toBeTruthy();
    });

    it("Breadcrumb Component Methods Existance Test", () => {
        expect(component.modalConfirm).toBeDefined();
        expect(component.modalDecline).toBeDefined();
    });


});
