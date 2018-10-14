import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DashboardComponent} from './dashboard/dashboard.component';
import {ModulesRoutingModule} from "./modules-routing.module";
import {
  MatButtonModule,
  MatCardModule,
  MatGridListModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatSidenavModule,
  MatToolbarModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatTreeModule,
  MatBadgeModule, MatDialogModule, MatInputModule
} from "@angular/material";
import { TableComponent } from './table/table.component';
import {FuncViewModule} from "../@views/func/func-view.module";
import {LoginModule} from "./login/login.module";
import { ProjectsComponent } from './projects/projects.component';
import { ProjectAddDialogComponent } from './projects/project-add-dialog/project-add-dialog.component';
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ProjectsModule} from "./projects/projects.module";


@NgModule({
  imports: [
    CommonModule,
    ModulesRoutingModule,
    TranslateModule,

    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTreeModule,
    MatBadgeModule,
    MatDialogModule,

    FuncViewModule,
  ],
  declarations: [
    DashboardComponent,
    TableComponent,
  ],
  entryComponents: [
  ]
})
export class ModulesModule {
}
