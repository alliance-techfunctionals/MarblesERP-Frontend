import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditShapeSizeComponent } from './edit-shape-size.component';

describe('EditShapeSizeComponent', () => {
  let component: EditShapeSizeComponent;
  let fixture: ComponentFixture<EditShapeSizeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditShapeSizeComponent]
    });
    fixture = TestBed.createComponent(EditShapeSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
