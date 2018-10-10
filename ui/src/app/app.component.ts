import {Component} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Title} from "@angular/platform-browser";
import {AppConfig} from "./app.config";

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  private appConfig: AppConfig = new AppConfig();

  constructor(private translate: TranslateService, private titleService: Title) {
    //添加语言支持
    translate.addLangs(['zh-CN', 'en']);
    //设置默认语言，一般在无法匹配的时候使用
    translate.setDefaultLang('en');

    let prevValue = null;
    translate.onLangChange.subscribe(() => {
      if (prevValue == null || prevValue == this.titleService.getTitle()) {
        translate.get(this.appConfig.appName).subscribe(value => {
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
