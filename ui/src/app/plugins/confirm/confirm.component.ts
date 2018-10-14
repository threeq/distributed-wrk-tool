import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Data} from "@angular/router";

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    if (!this.data) {
      this.data = new class implements DialogData {
        title: string = "Confirm";
        content: string = "Confirm Process ?";
        ok: string = "OK";
        cancel: string = "Cancel";
      }
    } else {
      data.title = data.title ? data.title : "Confirm";
      data.content = data.content ? data.content : "Confirm Process ?";
      data.ok = data.ok ? data.ok : "OK";
      data.cancel = data.cancel ? data.cancel : "Cancel";
    }
  }

  ngOnInit() {
  }

}

export interface DialogData {
  title: string;
  content: string;
  cancel: string;
  ok: string;
}
