import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from './confirm.component';
import {TranslateModule} from "@ngx-translate/core";
import {MatButtonModule, MatDialogModule} from "@angular/material";

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule,
    MatButtonModule
  ],
  declarations: [ConfirmComponent],
  entryComponents: [ConfirmComponent]
})
export class ConfirmModule { }
