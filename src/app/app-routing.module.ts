import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import {SigninComponent} from "./pages/signin/signin.component";
import {SignupComponent} from "./pages/signup/signup.component";
import {AddpageComponent} from "./pages/addpage/addpage.component";
import {HomeComponent} from "./pages/home/home.component";

import {AngularFireAuthGuard,redirectUnauthorizedTo,redirectLoggedInTo} from "@angular/fire/auth-guard";

const redirectUnauthorizedToLogin =()=> redirectUnauthorizedTo(['signin']);
const redirectLoggedInToHome = ()=>redirectLoggedInTo(['home']);

const routes: Routes = [
  {
  path:'home',
  component:HomeComponent,
    canActivate:[AngularFireAuthGuard],
    data : {authGuardPipe: redirectUnauthorizedToLogin}
},
  {
    path:'signin',
    component:SigninComponent,
    canActivate:[AngularFireAuthGuard],
    data : {authGuardPipe: redirectLoggedInToHome}
  },
  {
    path:'signup',
    component: SignupComponent,
    canActivate:[AngularFireAuthGuard],
    data : {authGuardPipe: redirectLoggedInToHome}
  },
  {
    path: 'addpage',
    component: AddpageComponent,
    canActivate:[AngularFireAuthGuard],
    data : {authGuardPipe: redirectUnauthorizedToLogin}
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
