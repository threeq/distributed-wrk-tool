import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from "@angular/material";
import {Machine, MachinesApiService, MachineTypeDesc} from "../../@common/api/machines-api.service";
import {map, startWith} from "rxjs/operators";
import {Observable} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ResourceAddComponent} from "../../resources/add/resource-add.component";
import * as _ from "lodash";


export const _filter = (opt: Machine[], value: string): Machine[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.ip.indexOf(filterValue) === 0);
};


interface InputData {
  machine: Machine,
  machines: Machine[]
}

interface MachineGroup {
  type: string;
  machines: Machine[];
}

@Component({
  selector: 'app-project-resource-add',
  templateUrl: './project-resource-add.component.html',
  styleUrls: ['./project-resource-add.component.scss']
})
export class ProjectResourceAddComponent implements OnInit {

  machineGroups: MachineGroup[] = [];

  machine = new Machine();

  ipFrom: FormGroup = this.fb.group({
    ipFromCtrl: '',
  });
  machineGroupOptions: Observable<MachineGroup[]>;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProjectResourceAddComponent>,
    private dialog: MatDialog,
    private machinesApi: MachinesApiService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public inputData: InputData
  ) {
    if (inputData.machine) {
      this.machine = inputData.machine;
    }
    let tempGroup = {};
    inputData.machines.forEach(it => {
      let group = {
        type: MachineTypeDesc[it.type],
        machines: [],
      };
      if (tempGroup.hasOwnProperty(it.type)) {
        group = tempGroup[it.type];
      } else {
        tempGroup[it.type] = group;
        this.machineGroups.push(<MachineGroup>group)
      }
      group.machines.push(it);
    })
  }

  ngOnInit(): void {
    this.machineGroupOptions = this.ipFrom.get('ipFromCtrl')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterGroup(value))
      );
  }

  onSaveClick(): void {
    // TODO 将机器绑定到项目监控资源中
    // console.log('stateGroup', this.ipFrom.get('ipFromCtrl').value);
    // this.machinesApi.add(this.machine).subscribe(ok => {
    //   this.dialogRef.close(true);
    // }, err => {
    //   this.snackBar.open(err.error.msg, "OK", {
    //     duration: 2000,
    //   })
    // })
  }

  onAddNewMachine(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    const dialogRef = this.dialog.open(ResourceAddComponent, {
      data: new Machine()
    });
    dialogRef.afterClosed().subscribe(result => {
      this.machine = result;
      this.ipFrom.get('ipFromCtrl')!.setValue(this.machine.ip);
    });
  }

  private _filterGroup(value: any): MachineGroup[] {
    if (_.isObject(value)) {
      this.machine = <Machine>value;
      value = this.machine.ip;
      this.ipFrom.get('ipFromCtrl')!.setValue(value);
    }
    if (value) {
      return this.machineGroups
        .map(group => ({type: group.type, machines: _filter(group.machines, value)}))
        .filter(group => group.machines.length > 0);
    }

    return this.machineGroups;
  }


}
