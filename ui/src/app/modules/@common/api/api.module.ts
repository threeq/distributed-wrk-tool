import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AdminApiService} from "./admin-api.service";
import {HttpClientModule} from "@angular/common/http";
import {SystemApiService} from "./system-api.service";
import {ProjectsApiService} from "./projects-api.service";
import {ScenesApiService} from "./scenes-api.service";
import {MachinesApiService} from "./machines-api.service";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    AdminApiService,
    SystemApiService,
    ProjectsApiService,
    ScenesApiService,
    MachinesApiService,
  ]
})
export class ApiModule { }
