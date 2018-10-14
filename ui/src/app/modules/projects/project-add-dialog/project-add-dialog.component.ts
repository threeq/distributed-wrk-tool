import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from "@angular/material";
import {FormControl, Validators} from "@angular/forms";
import {Project, ProjectsApiService} from "../../@common/api/projects-api.service";

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
    private dialogRef: MatDialogRef<ProjectAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private projectsApi: ProjectsApiService,
    private snackBar: MatSnackBar
  ) {
  }

  onSaveClick(): void {
    this.projectsApi.add(new Project(this.projectName)).subscribe(ok => {
      this.dialogRef.close(true);
    }, err => {
      this.snackBar.open(err.error.msg, "OK", {
          duration: 2000,
        })
    })
  }
}


export interface DialogData {
  animal: string;
  name: string;
}
