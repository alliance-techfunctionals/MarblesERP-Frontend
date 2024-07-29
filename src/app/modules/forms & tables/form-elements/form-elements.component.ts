import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ColorPickerModule } from 'ngx-color-picker';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-form-elements',
  standalone: true,
  imports: [CommonModule, SharedModule, NgbDropdownModule, ColorPickerModule],
  templateUrl: './form-elements.component.html',
  styleUrls: ['./form-elements.component.scss']
})
export default class FormElementsComponent {}
