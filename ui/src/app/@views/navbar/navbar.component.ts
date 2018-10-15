import { Component, OnInit } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {AppConfig} from "../../app.config";
import {User} from "../../modules/@common/api/system-api.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  appName: string;
  user: User;
  translateService: TranslateService;
  msgCount = 8;

  constructor(
    translateService: TranslateService,
    private router: Router) {
    this.translateService = translateService;
  }

  changeLang(lang) {
    console.log("Using language: " + lang);
    this.translateService.use(lang);
  }

  ngOnInit() {
    this.appName = AppConfig.appName;
    this.user = AppConfig.getUser();
  }

  doLogout() {
    AppConfig.clearUser();
    this.router.navigateByUrl("/")
  }
}
