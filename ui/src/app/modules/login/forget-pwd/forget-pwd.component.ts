import { Component, OnInit } from '@angular/core';
import {AppConfig} from "../../../app.config";
import {FormControl, Validators} from "@angular/forms";
import {EmailOnlyValidator, EqualValidator} from "../../../plugins/validators";

@Component({
  selector: 'app-forget-pwd',
  templateUrl: './forget-pwd.component.html',
  styleUrls: ['./forget-pwd.component.scss']
})
export class ForgetPwdComponent implements OnInit {

  codeFromCtrl = new FormControl('', [
    Validators.required,
    Validators.minLength(4),
    Validators.maxLength(6)
  ]);
  emailFromCtrl = new FormControl('', [
    Validators.required,
    Validators.email,
    EmailOnlyValidator.builder(AppConfig.validatorUrls.email)
  ]);
  passwordFromCtrl = new FormControl('', [
    Validators.required,
    Validators.minLength(6)]);
  confirmPwdFromCtrl = new FormControl('', [
    Validators.required,
    EqualValidator.builder('password', this.passwordFromCtrl)
  ]);

  constructor() { }

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

  doSendCode() {

  }
}
