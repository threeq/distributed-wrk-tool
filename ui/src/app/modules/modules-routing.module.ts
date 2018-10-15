import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {FuncViewComponent} from "../@views/func/func-view.component";

const routes: Routes = [
  {
    path: '',
    component: FuncViewComponent,
    children: [{
      path: '',
      redirectTo: 'projects',
      pathMatch: 'full',
    }, {
      path: 'projects',
      loadChildren: './projects/projects.module#ProjectsModule'
    }],
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModulesRoutingModule {
}
