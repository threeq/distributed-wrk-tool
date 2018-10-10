import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class AdminApiService {
  baseUrl: string = "http://127.0.0.8:8080/administrator/v1";

  constructor(private http: HttpClient) { }

}
