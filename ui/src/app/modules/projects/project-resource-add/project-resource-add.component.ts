import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from "@angular/material";
import {Machine, MachinesApiService} from "../../@common/api/machines-api.service";

@Component({
  selector: 'app-project-resource-add',
  templateUrl: './project-resource-add.component.html',
  styleUrls: ['./project-resource-add.component.scss']
})
export class ProjectResourceAddComponent {
  constructor(
    private dialogRef: MatDialogRef<ProjectResourceAddComponent>,
    private machinesApi: MachinesApiService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public machine: Machine
  ) {
    console.log(this.machine);
    if(!this.machine) {
      this.machine = new Machine();
    }
  }

  onSaveClick(): void {
    this.machinesApi.add(this.machine).subscribe(ok => {
      this.dialogRef.close(true);
    }, err => {
      this.snackBar.open(err.error.msg, "OK", {
        duration: 2000,
      })
    })
  }

}
