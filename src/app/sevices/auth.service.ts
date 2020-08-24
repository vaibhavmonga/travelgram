import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth:AngularFireAuth
  ) { }

  signup(email:string,password:string){
return this.auth.createUserWithEmailAndPassword(email,password);
  }

  signin(email:string,password:string){
return this.auth.signInWithEmailAndPassword(email,password);
  }
// current user data is saved in authstate, after login, and user information will come by getuser()
// bec getuser function call authstate and all data of signup in out is saved in authstate

  signout(){
return this.auth.signOut();
  }


   getuser() {
    return this.auth.authState;
  }
}
