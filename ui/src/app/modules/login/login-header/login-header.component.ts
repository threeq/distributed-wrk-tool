import { Component, OnInit } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {AppConfig} from "../../../app.config";

@Component({
  selector: 'app-login-header',
  templateUrl: './login-header.component.html',
  styleUrls: ['./login-header.component.scss']
})
export class LoginHeaderComponent implements OnInit {
  public appName = AppConfig.appName;

  constructor(private translate: TranslateService) { }

  ngOnInit() {
  }

  changeLang(lang) {
    console.log("Using language: " + lang);
    this.translate.use(lang);
  }
}
