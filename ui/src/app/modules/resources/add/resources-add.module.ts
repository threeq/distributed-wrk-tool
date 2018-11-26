import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatGridListModule, MatIconModule, MatInputModule,
  MatSelectModule,
  MatSnackBarModule
} from "@angular/material";
import {ApiModule} from "../../@common/api/api.module";
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";
import {ResourceAddComponent} from "./resource-add.component";

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

    ApiModule
  ],
  declarations: [ResourceAddComponent],
  entryComponents: [ResourceAddComponent],
  exports:[ResourceAddComponent]
})
export class ResourcesAddModule {
}
