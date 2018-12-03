import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppConfig} from "../../../app.config";
import {ResourceApi, Entity, ResponseEntity} from "./resource-api";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import * as _ from "lodash";

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
export class ProjectsApiService extends ResourceApi<Project> {

  private static apiVersion: string = AppConfig.apiHost + "/v1";
  private static projectsUrl: string = ProjectsApiService.apiVersion + '/projects';

  constructor(http: HttpClient) {
    super(http, ProjectsApiService.projectsUrl)
  }

  resource(projectId): Observable<ResponseEntity> {
    return this.http.get<ResponseEntity<any>>(this.resourceUrl + '/' + projectId + '/resource',)
      .pipe(map(obj => _.extend(new ResponseEntity<any>(), obj)))
  }

  addResource(projectId, machineId: string): Observable<ResponseEntity> {
    return this.http.post<ResponseEntity<any>>(this.resourceUrl + '/' + projectId + '/resource',
      {machineId: machineId})
      .pipe(map(obj => _.extend(new ResponseEntity<any>(), obj)))
  }


  delResource(projectId, machineId: string): Observable<ResponseEntity> {
    return this.http.delete<ResponseEntity<any>>(this.resourceUrl + '/' + projectId + '/resource' + machineId)
      .pipe(map(obj => _.extend(new ResponseEntity<any>(), obj)))
  }

}
