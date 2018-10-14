import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {ProjectsComponent} from "./projects.component";
import {ProjectAddDialogComponent} from "./project-add-dialog/project-add-dialog.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  MatBadgeModule,
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatGridListModule,
  MatInputModule, MatSnackBarModule
} from "@angular/material";
import {TranslateModule} from "@ngx-translate/core";
import {ApiModule} from "../@common/api/api.module";
import {ProjectSceneComponent} from './project-scene/project-scene.component';
import {ProjectTaskComponent} from './project-task/project-task.component';
import {ProjectMonitorComponent} from './project-monitor/project-monitor.component';
import {ConfirmModule} from "../../plugins/confirm/confirm.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,

    MatDialogModule,
    MatInputModule,
    MatBadgeModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,

    ApiModule,
    ConfirmModule,

    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: ProjectsComponent,
      }, {
        path: ':id',
        pathMatch: 'full',
        component: ProjectSceneComponent
      }, {
        path: ':id/task',
        component: ProjectTaskComponent
      }, {
        path: ':id/monitor',
        component: ProjectMonitorComponent
      }]),
  ],
  exports: [RouterModule],
  declarations: [
    ProjectsComponent,
    ProjectAddDialogComponent,
    ProjectSceneComponent,
    ProjectTaskComponent,
    ProjectMonitorComponent
  ],
  entryComponents: [
    ProjectAddDialogComponent
  ]
})
export class ProjectsModule {
}
