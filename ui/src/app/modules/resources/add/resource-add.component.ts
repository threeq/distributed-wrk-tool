import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from "@angular/material";
import {Machine, MachinesApiService, MachineType} from "../../@common/api/machines-api.service";
import * as _ from "lodash";

@Component({
  selector: 'app-project-resource-add',
  templateUrl: './resource-add.component.html',
  styleUrls: ['./resource-add.component.scss']
})
export class ResourceAddComponent {
  machineList: Machine[];

  constructor(
    private dialogRef: MatDialogRef<ResourceAddComponent>,
    private machinesApi: MachinesApiService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public machine: Machine
  ) {
    if(!this.machine) {
      this.machine = new Machine();
    }

    this.machinesApi.page().subscribe(response=>{
      this.machineList = _.filter(response.data.list, (it: Machine) => {
        return it.type === MachineType.MONITOR_ROOT || it.type === MachineType.MONITOR_MACHINE;
      });
    })
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
