import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from "@angular/material";
import {ProjectAddDialogComponent} from "./project-add-dialog/project-add-dialog.component";
import {ProjectsApiService} from "../@common/api/projects-api.service";

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
    private snackBar: MatSnackBar
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
      if(result) {
        this.refreshData();
      }
    });
  }
}
