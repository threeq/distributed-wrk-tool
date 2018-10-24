import {Component, OnInit} from '@angular/core';
import {CurrentProject} from "../projects.component";
import {Project} from "../../@common/api/projects-api.service";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material";

@Component({
  selector: 'app-project-scene',
  templateUrl: './project-scene.component.html',
  styleUrls: ['./project-scene.component.scss']
})
export class ProjectSceneComponent implements OnInit {

  project: Project;
  scenes = [{
    _id: '111',
    name: ' 22222s'
  }, {
    _id: '111',
    name: ' 22222sdf'
  }, {
    _id: '111',
    name: ' 22222s '
  }, {
    _id: '111',
    name: ' 22222sd'
  }, {
    _id: '111',
    name: ' 22222sdf'
  }, {
    _id: '111',
    name: ' 22222sd'
  }, {
    _id: '111',
    name: ' 22222sdf '
  }, {
    _id: '111',
    name: ' 22222s'
  }];

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {
    if (!CurrentProject.project) {
      this.router.navigateByUrl("/modules/projects");
      return
    }

    this.project = CurrentProject.project;
    this.refreshData();
  }

  ngOnInit() {
  }

  refreshData() {

  }

  addScene() {
    this.router.navigateByUrl("/modules/projects/" + this.project._id + "/scene/add");
    return
    //
    // const dialogRef = this.dialog.open(SceneAddDialogComponent, {
    //   width: '800px',
    // });
    //
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.refreshData();
    //   }
    // });
  }

  delScene() {

  }
}
