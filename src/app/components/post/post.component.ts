import { Component, OnInit,Input } from '@angular/core';

import {faThumbsUp,faThumbsDown,faShareSquare} from "@fortawesome/free-solid-svg-icons";

import {AuthService} from "../../sevices/auth.service";
import {AngularFireDatabase} from "@angular/fire/database";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {


@Input() post;

like=0;
dislike=0;
faThumbsUp=faThumbsUp;
  faThumbsDown=faThumbsDown;
  faShareSquare=faShareSquare;

  uid=null;

  constructor(private db : AngularFireDatabase,private auth : AuthService) {
    this.auth.getuser().subscribe((user)=>{
      this.uid = user?.uid;
    })
  }

  ngOnInit(): void {
  }
          // if there is vote in post then object value is updated with like or dislike by +1
  // ngOnChanges() is pre defined function for updating changes in post object (vote category)
  ngOnChanges(): void {
    if(this.post.vote){
      // we are converting it into array , for that put data in object.value(),, map is used for loop
      Object.values(this.post.vote).map((value : any)=>{
        if(value.like){
          this.like += 1;
        }
        if(value.dislike){
          this.dislike += 1;
        }
      })
    }
  }
        //   when we click like thumbsup then like function is called or updated
         // in that database , there is object in database, whose path is = posts/ ${this.post.id} and in this
  // vote/${this.uid}`).set({   when we click like then 1 like is added in recent value/  bec we have make object with uid,
  // so a person  can do only one thing ie like or dislike bec their object(which is uid) is same for both like and dislike,
  // so on again cliking on dislike, the old like value is replace by dislike
  likePost(){
    this.db.object(`/posts/${this.post.id}/vote/${this.uid}`).set({
      like : 1,
    })
  }

  dislikePost(){
    this.db.object(`/posts/${this.post.id}/vote/${this.uid}`).set({
      dislike : 1,
    })
  }
// this is for sharing in your profile
  getInstaUrl(){
    return `https://instagram.com/${this.post.instaId}`;
  }

}
