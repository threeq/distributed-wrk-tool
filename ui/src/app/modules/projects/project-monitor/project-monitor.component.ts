import { Component, OnInit } from '@angular/core';
import {Project} from "../../@common/api/projects-api.service";
import {Router} from "@angular/router";
import {CurrentProject} from "../projects.component";

@Component({
  selector: 'app-project-monitor',
  templateUrl: './project-monitor.component.html',
  styleUrls: ['./project-monitor.component.scss']
})
export class ProjectMonitorComponent implements OnInit {

  project: Project;

  constructor(
    private router: Router
  ) {
    if(!CurrentProject.project) {
      this.router.navigateByUrl("/modules/projects");
      return
    } else {
      this.project = CurrentProject.project
    }
  }

  ngOnInit() {
  }

}
