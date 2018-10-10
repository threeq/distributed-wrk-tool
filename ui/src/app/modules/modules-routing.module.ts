import {ExtraOptions, RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {TableComponent} from "./table/table.component";
import {FuncViewComponent} from "../@views/func/func-view.component";


const routes: Routes = [
  {
    path: '',
    component: FuncViewComponent,
    children: [{
      path: 'dashboard',
      component: DashboardComponent,
    }, {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    }, {
      path: 'table',
      component: TableComponent
    }],
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModulesRoutingModule {
}
