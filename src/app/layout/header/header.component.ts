import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../sevices/auth.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

// @ts-ignore
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

email=null;

  constructor(
    private  auth: AuthService,
    private  toastr : ToastrService,
    private router : Router
  ) {
    // on loading this page if there is value present in email then it will subscribe user otherwise it will not show any error
    // due to questionmark
    this.auth.getuser().subscribe((user)=>{
      this.email=user?.email;
    })
}

  ngOnInit(): void {
  }
// try this otherwise catch this message (there is two condition)
  async handleSignOut(){
    try {
      await this.auth.signout();
      this.toastr.info("logout successfully");
      this.router.navigateByUrl("signin");
    } catch (e) {
      this.toastr.error("error while signout")

    }
  }

}
