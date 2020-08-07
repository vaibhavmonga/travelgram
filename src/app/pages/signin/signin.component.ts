import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../../sevices/auth.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {error} from "@angular/compiler/src/util";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) { }
// here we create f object of ng form type
  ngOnInit(): void {
  }
  onSubmit(f:NgForm){
      const {email,password}=f.form.value;   // in f object there is form , from form find value which transfer in email and password
//  when we put email pass then there are two choice success or failure
    // if true then it will generate response
    // router is used to change url and move to new page
    // close button true is predefined function to show error message
      this.auth.signin(email,password).then((res)=>{
        this.toastr.success("sign in success");
        this.router.navigateByUrl("");
      }).catch((error)=>{
        this.toastr.error(error.message,"error",{
          closeButton:true
        })
      })

  }



}
