import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppConfig} from "../../../app.config";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {BaseApi, Entity, ResponseEntity} from "./base-api";

export class Project extends Entity {
  name: string;

  constructor(name=null) {
    super();
    this.name = name;
  }

}

@Injectable({
  providedIn: 'root'
})
export class ProjectsApiService extends BaseApi {

  private apiVersion: string = AppConfig.apiHost + "/v1";
  private projectsUrl: string = this.apiVersion + '/projects';

  constructor(private http: HttpClient) {
    super()
  }

  page(): Observable<ResponseEntity> {
    return this.http.get(this.projectsUrl).pipe(map(obj => <ResponseEntity> obj))
  }

  add(project: Project): Observable<ResponseEntity> {
    return this.http.post(this.projectsUrl, project).pipe(map(obj => <ResponseEntity> obj))
  }

  delete(_id: string): Observable<Object> {
    return this.http.delete(this.projectsUrl + '/' + _id)
  }

  update(project: Project): Observable<Object> {
    return this.http.put(this.projectsUrl + '/' + project._id, project)
  }
}
