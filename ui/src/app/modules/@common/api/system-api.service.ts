import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseApi} from "./base-api";


@Injectable({
  providedIn: 'root',
})
export class SystemApiService extends BaseApi {

  baseUrl: string = "http://127.0.0.1:8080/sys/v1/login";
  loginUrl: string = this.baseUrl + '';

  constructor(private http: HttpClient) {
    super()
  }


  login(loginName:string, pwd:string) {
    return this.http.post(this.loginUrl,{
      name: loginName,
      pwd: pwd
    }, {
      withCredentials: true
    })
  }
}
