import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {EmailOnlyValidator, EqualValidator} from "../../../plugins/validators";
import {AppConfig} from "../../../app.config";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  private appConfig: AppConfig = new AppConfig();

  nameFromCtrl = new FormControl('', [
    Validators.required,
    Validators.minLength(3)]);
  emailFromCtrl = new FormControl('', [
    Validators.required,
    Validators.email,
    EmailOnlyValidator.builder(this.appConfig.validatorUrls.email)
  ]);
  passwordFromCtrl = new FormControl('', [
    Validators.required,
    Validators.minLength(6)]);
  confirmPwdFromCtrl = new FormControl('', [
    Validators.required,
    EqualValidator.builder('password', this.passwordFromCtrl)
  ]);


  constructor() {
  }

  getErrorMessage(fieldCtrl) {
    return fieldCtrl == null ? '' :
      fieldCtrl.hasError('required') ? 'error-required' :
        fieldCtrl.hasError('email') ? 'error-email' :
          fieldCtrl.hasError('minlength') ? 'error-length' :
          fieldCtrl.hasError('equal') ? 'Two passwords are inconsistent' :
            '';
  }

  ngOnInit() {

  }

  doSubmit() {

  }

}
