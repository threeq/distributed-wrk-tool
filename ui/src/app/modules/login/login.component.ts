import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {SystemApiService, User} from "../@common/api/system-api.service";
import {ResponseEntity} from "../@common/api/base-api";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  emailCtrl = new FormControl('', [
    Validators.required,
    Validators.email]);
  passWord = new FormControl('', [
    Validators.required,
    Validators.minLength(6)]);

  private email: string;
  private pwd: string;

  constructor(private systemApi: SystemApiService,
              private snackBar: MatSnackBar,
              private route: Router) {
  }

  ngOnInit() {
  }

  getErrorMessage(field) {
    return field.hasError('required') ? 'error-required' :
      field.hasError('email') ? 'error-email' :
        field.hasError('minlength') ? 'error-length' :
          '';
  }

  doLogin() {
    this.systemApi.login(this.email, this.pwd).subscribe((res: ResponseEntity<User>) => {
      Object.setPrototypeOf(res, ResponseEntity.prototype);

      if (res.ok()) {
        // TODO 登录处理
        this.route.navigateByUrl("/modules/dashboard");
      } else {
        this.snackBar.open(res.msg, "OK", {
          duration: 2000,
        });
      }
    }, (res) => {
      console.log("接口错误", res);

      let error = <ResponseEntity<User>>res.error;
      this.snackBar.open(error.msg, "OK", {
        duration: 2000,
      });
    })
  }

  doRegister() {
    this.route.navigateByUrl("/login/register")
  }
}

