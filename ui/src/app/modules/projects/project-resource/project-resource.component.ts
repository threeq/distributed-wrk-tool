import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CurrentProject} from "../projects.component";
import {Project, ProjectsApiService} from "../../@common/api/projects-api.service";
import {MatDialog, MatSnackBar} from "@angular/material";
import {Machine, MachinesApiService} from "../../@common/api/machines-api.service";
import {ProjectResourceAddComponent} from "../project-resource-add/project-resource-add.component";
import * as _ from 'lodash'
import {ConfirmComponent} from "../../../plugins/confirm/confirm.component";
import {filter, map} from "rxjs/operators";

@Component({
  selector: 'app-project-resource',
  templateUrl: './project-resource.component.html',
  styleUrls: ['./project-resource.component.scss']
})
export class ProjectResourceComponent implements OnInit {

  project: Project = new Project();
  machines: Machine[];
  private hasMachineIds: {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private projectsApi: ProjectsApiService,
    private machinesApi: MachinesApiService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    if (CurrentProject.project) {
      this.project = CurrentProject.project;
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.project._id = params['id'];
      this.projectsApi.detail(this.project._id).subscribe(resp => {
        this.project = resp.data;
        this.refreshData();
      }, error => {
        this.snackBar.open(error.error.msg, "OK", {
          duration: 2000,
        });
        this.router.navigateByUrl("/modules/projects");
      })
    });
  }

  refreshData() {
    this.projectsApi.resource(this.project._id).subscribe(response => {
      this.machines = response.data;
      this.hasMachineIds = _.keyBy(this.machines, '_id')
    });
  }

  _enableSelectMachines() {
    return this.machinesApi.page()
      .pipe(map(it => _.filter(it.data.list, i => !this.hasMachineIds.hasOwnProperty(i._id))));
  }

  resourceAdd() {
    this._enableSelectMachines().subscribe(list => {
      // 过滤已经存在的资源
      const dialogRef = this.dialog.open(ProjectResourceAddComponent, {
        data: {
          machines: list,
          projectId: this.project._id
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.refreshData();
        }
      });
    });
  }

  resourceDetail(resource) {
    this._enableSelectMachines().subscribe(list => {
      const dialogRef = this.dialog.open(ProjectResourceAddComponent, {
        data: {
          machines: list,
          machine: _.cloneDeep(resource)
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.refreshData();
        }
      });
    })
  }

  onDelete(resource) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '450px',
      data: {
        title: "Delete Resource",
        content: `Are you sure you want to delete [${resource.name}] ?<br>
                  <em>This resource is not being monitored !</em>`,
      }
    });
    dialogRef.afterClosed().subscribe(ok => {
      if (ok) {
        this.projectsApi.delResource(this.project._id, resource._id).subscribe(ok => {
          this.snackBar.open(ok.msg, "OK", {
            duration: 2000,
          });
          this.refreshData();
        }, err => {
          this.snackBar.open(err.error.msg, "OK", {
            duration: 2000,
          });
        });
      }
    });
  }
}
