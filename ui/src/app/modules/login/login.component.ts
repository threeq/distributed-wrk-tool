import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {SystemApiService} from "../@common/api/system-api.service";
import {ResponseEntity} from "../@common/api/base-api";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  loginName = new FormControl('', [
    Validators.required,
    Validators.minLength(3)]);
  passWord = new FormControl('', [
    Validators.required,
    Validators.minLength(6)]);

  private name: string;
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

  gotoHelp() {

  }

  doLogin() {
    this.systemApi.login(this.name, this.pwd).subscribe((data) => {
      console.log("login result: ", data);

      if (this.systemApi.checkOK(<ResponseEntity>data)) {
        this.route.navigateByUrl("/modules/dashboard");
      } else {
        this.snackBar.open("login error", "OK", {
          duration: 2000,
        });
        this.route.navigateByUrl("/modules/dashboard");
      }
    }, (error) => {
      console.log("接口错误", error);
      this.snackBar.open("接口错误", "OK", {
        duration: 2000,
      });
      this.route.navigateByUrl("/modules/dashboard");
    })
  }

  doRegister() {
    this.route.navigateByUrl("/login/register")
  }
}

