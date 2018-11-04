import {Component, OnInit} from '@angular/core';
import {CurrentProject} from "../projects.component";
import {Project} from "../../@common/api/projects-api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material";
import {ScenesApiService} from "../../@common/api/scenes-api.service";

@Component({
  selector: 'app-project-scene',
  templateUrl: './project-scene.component.html',
  styleUrls: ['./project-scene.component.scss']
})
export class ProjectSceneComponent implements OnInit {

  project: Project = new Project();
  scenes = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private scenesApi: ScenesApiService,
  ) {

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.project._id = params['id']
    });
    this.refreshData();
  }

  refreshData() {
    this.scenesApi.page({
      projectId: this.project._id
    }).subscribe(response => {
      this.scenes = response.data.list
    })
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
