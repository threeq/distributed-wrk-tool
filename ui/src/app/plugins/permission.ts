import {
  Injectable, NgModule,
} from '@angular/core';

import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot
} from '@angular/router';
import {combineLatest, from, observable, Observable} from "rxjs";
import {map, take} from "rxjs/operators";
import {reject} from "q";


@Injectable({
  providedIn: 'root',
})
export class Permission {
  private _store: Object = {};

  define(name: any, validation) {
    this._store[name.toString()] = validation;
  }

  authorize(authObj) {
    if (authObj.only && authObj.except) {
      throw new Error('Authorization object cannot contain both [only] and [except]');
    }

    if (authObj.only) {
      return this._checkAuthorization(authObj.only, 'only');
    }

    if (authObj.except) {
      return this._checkAuthorization(authObj.except, 'except');
    }

  }

  private _checkAuthorization(names, type) {
    const mergeObsrArr: Array<Observable<boolean>> = [];

    names.forEach((res) => {
      if (this._store[res]) {
        mergeObsrArr.push(Observable.create(observer => {
          observer.next(this._store[res].call());
          return {
            unsubscribe() {
            }
          };
        }));

      } else {
        console.warn(`Permission: No defined validation for ${res}`);
      }
    });

    return combineLatest(mergeObsrArr).pipe(map((res: boolean[]) => {
      let r = res.some((x) => x === true);
      if (type === 'only') {
        return !!r;
      }
      if (type === 'except') {
        return !r;
      }
    }));
  }
}

@Injectable({
  providedIn: 'root',
})
export class PermGuard implements CanActivate {
  constructor(private _permission: Permission, private _router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot) {

    let act = this._permission
      .authorize(route.data['permission'].rule)
      .pipe(
        take(1),
        map((res) => {
          if (res) {
            return true;
          } else {
            this._router.navigate(route.data['permission'].redirectTo);
            return false;
          }
        }));
    return act;
  }
}

export function createRule(
  rule: { 'only': string[] } | { 'except': string[] },
  redirectTo: any[]) {
  return {
    rule,
    redirectTo
  };
}

@NgModule({
  providers: [
    PermGuard,
    Permission
  ]
})
export class PermissionModule {

}
