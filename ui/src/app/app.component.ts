import {Component} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Title} from "@angular/platform-browser";
import {AppConfig} from "./app.config";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./modules/@common/styles/common.scss']
})
export class AppComponent {
  private appName: string = AppConfig.appName;

  constructor(
    private translate: TranslateService,
    private titleService: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute) {

    //添加语言支持
    translate.addLangs(['zh-CN', 'en']);
    //设置默认语言，一般在无法匹配的时候使用
    translate.setDefaultLang('en');

    let prevValue = null;
    translate.onLangChange.subscribe(() => {
      if (prevValue == null || prevValue == this.titleService.getTitle()) {
        translate.get(this.appName).subscribe(value => {
          titleService.setTitle(value);
          prevValue = value;
        });
      }

      return true;
    });

    //获取当前浏览器环境的语言比如en、 zh
    let broswerLang = translate.getBrowserLang();
    translate.use(broswerLang.match(/en|zh-CN/) ? broswerLang : 'zh-CN');

  }

}
