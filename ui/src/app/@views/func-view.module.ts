import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {
  MatButtonModule,
  MatIconModule, MatListModule,
  MatMenuModule, MatSidenavModule, MatToolbarModule, MatTreeModule
} from "@angular/material";
import {FuncViewComponent} from "./func/func-view.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {SidenavComponent} from "./sidenav/sidenav.component";
import {RouterModule} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    MatListModule,
    MatMenuModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatTreeModule,
    TranslateModule
  ],
  declarations: [
    FuncViewComponent,
    NavbarComponent,
    SidenavComponent
  ],
  exports:[SidenavComponent]
})
export class FuncViewModule {
}
