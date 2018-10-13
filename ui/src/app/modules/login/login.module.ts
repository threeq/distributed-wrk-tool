import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import {RouterModule} from "@angular/router";
import {
  MatButtonModule,
  MatCardModule,
  MatGridListModule,
  MatIconModule, MatInputModule,
  MatMenuModule, MatSnackBarModule,
  MatToolbarModule
} from "@angular/material";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {ApiModule} from "../@common/api/api.module";
import { ForgetPwdComponent } from './forget-pwd/forget-pwd.component';
import { LoginHeaderComponent } from './login-header/login-header.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ApiModule,
    RouterModule.forChild([
      {
        path: '',
        component: LoginComponent,
      },{
        path: 'forget-pwd',
        component: ForgetPwdComponent,
      },{
        path: 'register',
        component: RegisterComponent,
      }]),

    ApiModule
  ],
  exports: [RouterModule],
  declarations: [LoginComponent, ForgetPwdComponent, LoginHeaderComponent, RegisterComponent]
})
export class LoginModule { }
