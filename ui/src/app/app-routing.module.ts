import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';


const routes: Routes = [
  { path: 'modules', loadChildren: './modules/modules.module#ModulesModule' },
  { path: 'login', loadChildren: './modules/login/login.module#LoginModule' },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // { entityOutputPath: '**', redirectTo: 'modules' },
];

const config: ExtraOptions = {
  useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
