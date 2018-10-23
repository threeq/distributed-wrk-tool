import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {CurrentProject} from "../../projects.component";
import {Router} from "@angular/router";
import {Project} from "../../../@common/api/projects-api.service";

@Component({
  selector: 'app-scene-add',
  templateUrl: './scene-add.component.html',
  styleUrls: ['./scene-add.component.scss']
})
export class SceneAddComponent implements OnInit {

  sceneNameCtrl = new FormControl('', [
    Validators.required]);

  sceneName: string;
  url: string;
  threads: number;
  connections: number;
  durations: number;
  timeout: number;
  script: string;
  private project: Project;

  constructor(
    private router: Router
  ) {
    if (!CurrentProject.project) {
      this.router.navigateByUrl("/modules/projects");
      return
    }

    this.project = CurrentProject.project;
  }

  ngOnInit() {
  }

  previewImage($event) {
    console.log($event)
  }
}
