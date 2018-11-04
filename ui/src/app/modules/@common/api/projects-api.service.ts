import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppConfig} from "../../../app.config";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {ResourceApi, Entity, ResponseEntity} from "./resource-api";

export class Project extends Entity {
  name: string;

  constructor(name = null) {
    super();
    this.name = name;
  }

}

@Injectable({
  providedIn: 'root'
})
export class ProjectsApiService extends ResourceApi {

  private static apiVersion: string = AppConfig.apiHost + "/v1";
  private static projectsUrl: string = ProjectsApiService.apiVersion + '/projects';

  constructor(private http: HttpClient) {
    super(http, ProjectsApiService.projectsUrl)
  }

}
