import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-ag-custom-button',
  templateUrl: './ag-custom-button.component.html',
  styleUrls: ['./ag-custom-button.component.scss']
})
export class AgCustomButtonComponent  implements ICellRendererAngularComp {
  params: any;

  agInit(params: ICellRendererParams): void {
    // console.log(params);
    this.params = params
  }

  refresh(_params: ICellRendererParams): boolean {
    return true;
  }

  onViewClick($event: any): void {
    if (this.params?.onViewClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data
      }

      this.params.onViewClick(params);
    }
  }

  onEditClick($event: any): void {
    if (this.params?.onEditClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data
      }

      this.params.onEditClick(params);
    }
  }

  onDeleteClick($event: any): void {
    if (this.params?.onDeleteClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data
      }
      this.params.onDeleteClick(params);
    }
  }

  onPrintClick($event: any): void {
    if (this.params?.onPrintClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data
      }
      this.params.onPrintClick(params);
    }
  }

  onImageClick($event: any): void {
    if (this.params?.onImageClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data
      }
      this.params.onImageClick(params);
    }
  }

  onCheckClick($event: any): void {
    if (this.params?.onCheckClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data
      }
      this.params.onCheckClick(params);
    }
  }

  onShipClick($event: any): void {
    if (this.params?.onShipClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data
      }
      this.params.onShipClick(params);
    }
  }

  onDeliveredClick($event: any): void {
    if (this.params?.onDeliveredClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data
      }
      this.params.onDeliveredClick(params);
    }
  }

}
