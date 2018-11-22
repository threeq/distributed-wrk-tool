import {Injectable} from '@angular/core';
import {Entity, ResourceApi} from "./resource-api";
import {AppConfig} from "../../../app.config";
import {HttpClient} from "@angular/common/http";

export class Machine extends Entity {
  name: string;
  type: number;
  ip: string;
  parent: string='';

  constructor() {
    super();
  }

}

export enum MachineType {
  MONITOR_ROOT = 0,
  MONITOR_MACHINE = 1,
  SERVER_MACHINE = 2,
  TEST_MACHINE = 3,
}

@Injectable({
  providedIn: 'root'
})
export class MachinesApiService extends ResourceApi<Machine> {

  private static apiVersion: string = AppConfig.apiHost + "/v1";
  private static projectsUrl: string = MachinesApiService.apiVersion + '/machines';

  constructor(http: HttpClient) {
    super(http, MachinesApiService.projectsUrl)
  }

}
