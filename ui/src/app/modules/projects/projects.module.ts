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
  MatDialogModule, MatExpansionModule,
  MatGridListModule, MatIconModule,
  MatInputModule, MatSelectModule, MatSnackBarModule, MatTableModule
} from "@angular/material";
import {TranslateModule} from "@ngx-translate/core";
import {ApiModule} from "../@common/api/api.module";
import {ProjectSceneComponent} from './project-scene/project-scene.component';
import {ProjectTaskComponent} from './project-task/project-task.component';
import {ProjectMonitorComponent} from './project-monitor/project-monitor.component';
import {ConfirmModule} from "../../plugins/confirm/confirm.module";
import {FuncViewModule} from "../../@views/func-view.module";
import {SceneDetailComponent} from './project-scene/scene-detail/scene-detail.component';
import {SceneAddComponent} from './project-scene/scene-add/scene-add.component';
import {CodemirrorModule} from "../../plugins/codemirror/codemirror.module";
import {EchartsNg2Module} from "echarts-ng2";
import {ProjectResourceComponent} from './project-resource/project-resource.component';
import {ProjectResourceAddComponent} from './project-resource-add/project-resource-add.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,

    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatBadgeModule,
    MatTableModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatExpansionModule,
    EchartsNg2Module,

    ApiModule,
    ConfirmModule,
    FuncViewModule,
    CodemirrorModule,

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
      }, {
        path: ':id/resource',
        component: ProjectResourceComponent,
      }, {
        path: ':projectId/scene/add',
        component: SceneAddComponent
      }, {
        path: ':projectId/scene/edit/:_id',
        component: SceneAddComponent
      }, {
        path: ':projectId/scene/detail',
        component: SceneDetailComponent,
      }]),
  ],
  exports: [RouterModule],
  declarations: [
    ProjectsComponent,
    ProjectAddDialogComponent,
    ProjectSceneComponent,
    ProjectTaskComponent,
    ProjectMonitorComponent,
    SceneDetailComponent,
    SceneAddComponent,
    ProjectResourceComponent,
    ProjectResourceAddComponent,
  ],
  entryComponents: [
    ProjectAddDialogComponent,
    ProjectResourceAddComponent,
  ]
})
export class ProjectsModule {
}
