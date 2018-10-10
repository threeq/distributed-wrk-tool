import {AbstractControl, ValidationErrors, Validator} from "@angular/forms";
import {Observable} from "rxjs";

export class EqualValidator {

  static builder(name: string, equal: AbstractControl) {
    return function (p1: AbstractControl) {
      const myValue = p1.value;
      const compareValue = equal.value;
      return (myValue === compareValue) ? null : {equal: name};
    };
  }

}

export class EmailOnlyValidator {
  static builder(email: ((control: AbstractControl) => (ValidationErrors | null)) | boolean | string) {
    return function (p1: AbstractControl) {
      const email = p1.value;
      return new Promise(function (resolve, reject) {
        resolve(null)
      })
    }
  }
}
