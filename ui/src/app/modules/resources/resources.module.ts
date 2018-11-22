import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IndexComponent} from './index/index.component';
import {RouterModule} from "@angular/router";
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatGridListModule, MatIconModule, MatInputModule,
  MatSelectModule,
  MatSnackBarModule
} from "@angular/material";
import {ApiModule} from "../@common/api/api.module";
import {TranslateModule} from "@ngx-translate/core";
import {ResourceAddComponent} from "./add/resource-add.component";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,

    MatGridListModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,

    ApiModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: IndexComponent,
      },
    ])
  ],
  exports: [RouterModule],
  declarations: [IndexComponent, ResourceAddComponent],
  entryComponents: [ResourceAddComponent]
})
export class ResourcesModule {
}
