import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {AppConfig} from "../../../app.config";

export class ResponseEntity<T = any> {
  code: number;
  msg: string;
  timestamp: number;
  data: T;

  ok() {
    return this.code == 10000;
  }
}

export class Entity {
  _id: string;
  created: number;
  updated: number;
  active: number;
}

export class ResourceApi<E extends Entity> {

  constructor(private http: HttpClient,
              private resourceUrl: string) {
  }

  page(params): Observable<ResponseEntity> {
    return this.http.get(this.resourceUrl, {params: params}).pipe(map(obj => <ResponseEntity> obj))
  }

  add(entity: E): Observable<ResponseEntity> {
    return this.http.post(this.resourceUrl, entity).pipe(map(obj => <ResponseEntity> obj))
  }

  detail(_id: string): Observable<ResponseEntity> {
    return this.http.get(this.resourceUrl + '/' + _id).pipe(map(obj => <ResponseEntity> obj))
  }

  delete(_id: string): Observable<ResponseEntity> {
    return this.http.delete(this.resourceUrl + '/' + _id).pipe(map(obj => <ResponseEntity> obj))
  }

  update(entity: E): Observable<ResponseEntity> {
    return this.http.put(this.resourceUrl + '/' + entity._id, entity).pipe(map(obj => <ResponseEntity> obj))
  }
}

