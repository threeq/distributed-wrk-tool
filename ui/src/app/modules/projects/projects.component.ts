import {Component, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from "@angular/material";
import {ProjectAddDialogComponent} from "./project-add-dialog/project-add-dialog.component";
import {Project, ProjectsApiService} from "../@common/api/projects-api.service";
import {ConfirmComponent} from "../../plugins/confirm/confirm.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  projects = [];

  constructor(
    private dialog: MatDialog,
    private projectsApi: ProjectsApiService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.refreshData()
  }

  refreshData() {
    this.projectsApi.page().subscribe(res => {
      this.projects = res.data.list
    }, error => {
      this.snackBar.open(error.error.msg, "OK", {
        duration: 2000,
      })
    })
  }

  ngOnInit() {
  }

  addProject() {
    const dialogRef = this.dialog.open(ProjectAddDialogComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshData();
      }
    });
  }

  onGoProject(project: Project) {
    CurrentProject.project = project;
    this.router.navigateByUrl("/modules/projects/" + project._id)
  }

  onDelete(project: Project) {
    if (!project) {
      this.snackBar.open('Argument Error', "OK", {
        duration: 2000
      });
      return
    }

    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '450px',
      data: {
        title: "Delete Project",
        content: "Are you sure you want to delete [" + project.name + "] ?",
      }
    });
    dialogRef.afterClosed().subscribe(ok => {
      if (ok) {
        this.projectsApi.delete(project._id).subscribe(ok => {
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

export class CurrentProject {
  static project: Project = null
}
