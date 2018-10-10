import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {
  MatButtonModule,
  MatIconModule, MatListModule,
  MatMenuModule, MatSidenavModule, MatToolbarModule, MatTreeModule
} from "@angular/material";
import {FuncViewComponent} from "./func-view.component";
import {NavbarComponent} from "../../modules/@common/navbar/navbar.component";
import {SidenavComponent} from "../../modules/@common/sidenav/sidenav.component";
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
  ]
})
export class FuncViewModule {
}
