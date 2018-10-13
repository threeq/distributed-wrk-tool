import {ExtraOptions, RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {PermGuard} from "./plugins/permission";
import {ROLES} from "./app.config";


const routes: Routes = [
  {
    path: 'modules',
    canActivate: [PermGuard],
    data: {
      permission: {
        rule: {only: [ROLES.login]},
        redirectTo: ['/login']
      }
    },
    loadChildren: './modules/modules.module#ModulesModule'
  },
  {
    path: 'login',
    canActivate: [PermGuard],
    data: {
      permission: {
        rule: {only: [ROLES.logout]},
        redirectTo: ['/modules/projects']
      }
    },
    loadChildren: './modules/login/login.module#LoginModule'
  },
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  // { entityOutputPath: '**', redirectTo: 'modules' },
];

const config: ExtraOptions = {
  // useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
