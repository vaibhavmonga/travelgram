import { Component, OnInit } from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {AngularFireDatabase} from "@angular/fire/database";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  users = [];
  posts = [];

  constructor(
    private db : AngularFireDatabase,
    private toastr : ToastrService
  ) {
    // fetch user from database
    db.object("/users").valueChanges().subscribe((object)=>{
      if(object){
        this.users=Object.values(object);

      }else {
        toastr.error("no user found");
      }
    });
    // fetch posts from database
    db.object("/posts").valueChanges().subscribe((object)=>{
      if(object){
        this.posts=Object.values(object);
      }else{
        toastr.error("no post found");
      }
    })
  }

  ngOnInit(): void {
  }

}
