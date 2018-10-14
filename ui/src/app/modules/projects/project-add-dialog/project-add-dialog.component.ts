import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-project-add-dialog',
  templateUrl: './project-add-dialog.component.html',
  styleUrls: ['./project-add-dialog.component.scss']
})
export class ProjectAddDialogComponent {

  projectNameCtrl = new FormControl('', [
    Validators.required]);
  projectName: string;

  constructor(
    public dialogRef: MatDialogRef<ProjectAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}


export interface DialogData {
  animal: string;
  name: string;
}
