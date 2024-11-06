import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import SaleAnalysisComponent from './sale-analysis/sale-analysis.component';


const routes: Routes = [
  {
    path: '',
    component: SaleAnalysisComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleAnalysisModule {}
