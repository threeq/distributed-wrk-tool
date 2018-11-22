import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from "@angular/material";
import {Machine, MachinesApiService} from "../../@common/api/machines-api.service";

@Component({
  selector: 'app-project-resource-add',
  templateUrl: './resource-add.component.html',
  styleUrls: ['./resource-add.component.scss']
})
export class ResourceAddComponent {
  constructor(
    private dialogRef: MatDialogRef<ResourceAddComponent>,
    private machinesApi: MachinesApiService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public machine: Machine
  ) {
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
