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
import {FormsModule} from "@angular/forms";
import {ResourcesAddModule} from "./add/resources-add.module";

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

    ResourcesAddModule,
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
  declarations: [IndexComponent],
  entryComponents: []
})
export class ResourcesModule {
}
