import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {EmailOnlyValidator, EqualValidator} from "../../../plugins/validators";
import {AppConfig} from "../../../app.config";
import {SystemApiService, User} from "../../@common/api/system-api.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  nameFromCtrl = new FormControl('', [
    Validators.required,
    Validators.minLength(3)]);
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


  constructor(private systemApi:SystemApiService) {
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
    let user = new User();
    user.email = this.emailFromCtrl.value;
    user.name = this.nameFromCtrl.value;
    user.pwd = this.passwordFromCtrl.value;
    this.systemApi.register(user).subscribe((data)=>{
      console.log(data)
    }, errorData => {
      console.log(errorData.error)
    })
  }

}
