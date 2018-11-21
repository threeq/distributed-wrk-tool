import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IndexComponent} from './index/index.component';
import {RouterModule} from "@angular/router";
import {MatButtonModule, MatCardModule, MatDialogModule, MatGridListModule, MatSnackBarModule} from "@angular/material";
import {ApiModule} from "../@common/api/api.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,

    MatGridListModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,

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
})
export class ResourcesModule {
}
