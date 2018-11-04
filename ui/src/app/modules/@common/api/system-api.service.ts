import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ResourceApi} from "./resource-api";
import {AppConfig} from "../../../app.config";


export class User {
  name: String;
  email: String;
  pwd: String;
}

@Injectable({
  providedIn: 'root',
})
export class SystemApiService {

  private baseUrl: string = AppConfig.apiHost + "/v1";
  private loginUrl: string = this.baseUrl + '/sys/login';
  private registerUrl: string = this.baseUrl + '/users';

  constructor(private http: HttpClient) {
  }


  login(email: string, pwd: string) {
    return this.http.post(this.loginUrl, {
      email: email,
      pwd: pwd
    })
  }

  register(user: User) {
    return this.http.post(this.registerUrl, user)
  }
}
