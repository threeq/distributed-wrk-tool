import { Component, OnInit } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {AppConfig} from "../../../app.config";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public appConfig: AppConfig = new AppConfig();

  constructor(private translate: TranslateService) {
    this.appConfig = new AppConfig()
  }

  changeLang(lang) {
    console.log("Using language: " + lang);
    this.translate.use(lang);
  }
  toggleLang() {
    console.log(this.translate.getBrowserLang());
    //获取语言风格，相当于更详细的语言类型，比如zh-CN、zh-TW、en-US
    console.log(this.translate.getBrowserCultureLang());
  }

  ngOnInit() {
  }

}
