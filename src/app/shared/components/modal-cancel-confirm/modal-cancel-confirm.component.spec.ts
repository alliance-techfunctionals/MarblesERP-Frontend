import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { BsModalRef } from "ngx-bootstrap/modal";
import { SharedModule } from "../../shared.module";
import { ModalCancelConfirmComponent } from "./modal-cancel-confirm.component";

describe("ModalCancelConfirmComponent", () => {
  let component: ModalCancelConfirmComponent;
  let fixture: ComponentFixture<ModalCancelConfirmComponent>;
  let bsModalRef: Partial<BsModalRef>;

  beforeEach(waitForAsync(() => {
    bsModalRef = {};
    TestBed.configureTestingModule({
      declarations: [ModalCancelConfirmComponent],
      providers: [{ provide: BsModalRef, useValue: bsModalRef }],
      imports: [SharedModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCancelConfirmComponent);
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
