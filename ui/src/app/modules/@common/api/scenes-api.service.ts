import {Injectable} from '@angular/core';
import {Entity, ResourceApi} from "./resource-api";
import {AppConfig} from "../../../app.config";
import {HttpClient} from "@angular/common/http";

export class Scene extends Entity {
  name: string;
  projectId: string;
  threads: number;
  connections: number;
  durations: number;
  timeout: number;
  script: string;

  testUrls: UrlConf[] = [];
  testModels: ModelConf[] = [];
}

export class ModelConf {
  sort: number = 0;
  name: string = "";
  url: string = "";
  loadRate: number = 0;
}

export class UrlConf {
  method: string = 'GET';
  url: string;
  headers: object = {};
  body: any = "";
  checkPoints: any = [];
  thresholds: object = {};
}

@Injectable({
  providedIn: 'root'
})
export class ScenesApiService extends ResourceApi<Scene> {

  private static apiVersion: string = AppConfig.apiHost + "/v1";
  private static scenesUrl: string = ScenesApiService.apiVersion + '/scenes';

  constructor(
    private http: HttpClient
  ) {
    super(http, ScenesApiService.scenesUrl)
  }
}
