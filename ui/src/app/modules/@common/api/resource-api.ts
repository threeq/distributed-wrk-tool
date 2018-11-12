import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import * as _ from 'lodash';

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
  protected http: HttpClient;
  protected resourceUrl: string;

  constructor(http: HttpClient,
              resourceUrl: string) {
    this.http = http;
    this.resourceUrl = resourceUrl;
  }

  page(params = null): Observable<ResponseEntity> {
    return this.http.get<ResponseEntity<E>>(this.resourceUrl, {params: params})
      .pipe(map(obj => _.extend(new ResponseEntity<E>(), obj)))
  }

  add(entity: E): Observable<ResponseEntity> {
    return this.http.post<ResponseEntity<E>>(this.resourceUrl, entity)
      .pipe(map(obj => _.extend(new ResponseEntity<E>(), obj)))
  }

  detail(_id: string): Observable<ResponseEntity> {
    return this.http.get<ResponseEntity<E>>(this.resourceUrl + '/' + _id)
      .pipe(map(obj => _.extend(new ResponseEntity<E>(), obj)))
  }

  delete(_id: string): Observable<ResponseEntity> {
    return this.http.delete<ResponseEntity<E>>(this.resourceUrl + '/' + _id)
      .pipe(map(obj => _.extend(new ResponseEntity<E>(), obj)))
  }

  update(entity: E): Observable<ResponseEntity> {
    return this.http.put<ResponseEntity<E>>(this.resourceUrl + '/' + entity._id, entity)
      .pipe(map(obj => _.extend(new ResponseEntity<E>(), obj)))
  }
}

