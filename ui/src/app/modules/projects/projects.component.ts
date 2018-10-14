import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {ProjectAddDialogComponent} from "./project-add-dialog/project-add-dialog.component";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  projects = [
    {title: 'P 1', cols: 1, rows: 1},
    {title: 'P 2', cols: 1, rows: 1},
    {title: 'P 3', cols: 1, rows: 1},
    {title: 'P 4', cols: 1, rows: 1},
    {title: 'P 4', cols: 1, rows: 1},
    {title: 'P 4', cols: 1, rows: 1},
  ];

  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  addProject() {
    const dialogRef = this.dialog.open(ProjectAddDialogComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }
}
