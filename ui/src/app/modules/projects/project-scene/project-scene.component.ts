import {Component, OnInit} from '@angular/core';
import {CurrentProject} from "../projects.component";
import {Project, ProjectsApiService} from "../../@common/api/projects-api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog, MatSnackBar} from "@angular/material";
import {Scene, ScenesApiService} from "../../@common/api/scenes-api.service";

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
    private projectsApi: ProjectsApiService,
    private snackBar: MatSnackBar
  ) {
    if(CurrentProject.project) {
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
    this.scenesApi.page({
      _q: JSON.stringify({
        projectId: this.project._id
      })
    }).subscribe(response => {
      this.scenes = response.data.list
    })
  }

  addScene() {
    this.router.navigateByUrl("/modules/projects/" + this.project._id + "/scene/add");
  }

  delScene() {

  }

  editScene(scene: Scene) {
    this.router.navigateByUrl("/modules/projects/" + this.project._id + "/scene/edit/"+scene._id);
  }
}
