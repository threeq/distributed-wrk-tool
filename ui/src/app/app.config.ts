import {LocalStorage} from "./utils/local.storage";

let storage = new LocalStorage();
let USER_STORAGE_KEY = 'user_storage_Key';

export class AppConfig {
  static appName = "Load Test Manage";

  static apiHost = "http://127.0.0.1:5000/api";
  static expiredTime = 10000; // 分钟

  static setUser(user) {
    AppConfig.loginStatus.hasLogin = true;
    AppConfig.loginStatus.loginTime = new Date().getTime();
    AppConfig.loginStatus.data = user;
    storage.setObject(USER_STORAGE_KEY, AppConfig.loginStatus)
  }

  static getUser() {
    let user = AppConfig.loginStatus.data;
    if (!user) {
      let storageLoginStatus = storage.getObject(USER_STORAGE_KEY);
      if (!storageLoginStatus.hasOwnProperty("hasLogin")) {
        return null;
      }

      AppConfig.loginStatus.loginTime = storageLoginStatus.loginTime;
      AppConfig.loginStatus.data = storageLoginStatus.data;
    }

    // check login expire
    let now = new Date().getTime();
    let loginDuration = now - AppConfig.loginStatus.loginTime;
    if (loginDuration > AppConfig.expiredTime * 60 * 1000) {
      storage.remove(USER_STORAGE_KEY);
      return null
    }

    AppConfig.loginStatus.hasLogin = true;
    AppConfig.loginStatus.loginTime = new Date().getTime();
    storage.setObject(USER_STORAGE_KEY, AppConfig.loginStatus);
    return AppConfig.loginStatus.data || storage.getObject(USER_STORAGE_KEY).data;
  }

  static clearUser() {
    // clear memory and localStorage
    storage.remove(USER_STORAGE_KEY);
    AppConfig.loginStatus = {
      hasLogin: false,
      loginTime: 0,
      data: null
    }
  }


  static loginStatus = {
    hasLogin: false,
    loginTime: 0,
    data: null
  };

  static validatorUrls = {
    email: ''
  };

}


export enum ROLES {
  login,
  logout,
}
