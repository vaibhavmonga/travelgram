import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

import {AuthService} from "../../sevices/auth.service";
import {finalize} from "rxjs/operators";

//firebase
import {AngularFireStorage} from "@angular/fire/storage";
import {AngularFireDatabase} from "@angular/fire/database";

import { readAndCompressImage } from 'browser-image-resizer';
import {v4 as uuidv4 } from "uuid";
import {error} from "@angular/compiler/src/util";


const config = {
  quality: 0.5,
  maxWidth: 800,
  maxHeight: 600,
  autoRotate: true,
  debug: true
};


@Component({
  selector: 'app-addpage',
  templateUrl: './addpage.component.html',
  styleUrls: ['./addpage.component.css']
})
export class AddpageComponent implements OnInit {


  picture : string = null;
  uploadPercent : number = null;
  user=null;

//
  constructor(
    private auth : AuthService,
    private router : Router,
    private db : AngularFireDatabase,
    private storage : AngularFireStorage,
    private toastr : ToastrService
  ) {
    // from auth we call getuser() bec all user information is in getuser, after subscribe it generate response(user ,we can use any name)

    auth.getuser().subscribe((user)=>{
      this.db.object(`/users/${user.uid}`).valueChanges().subscribe((userDetails)=>{  // here we get response(userdetail which we transferred in user variable)
        this.user=userDetails;
      })
    })
  }

  ngOnInit(): void {
  }
  onSubmit(f:NgForm){

    // from html page data comes in f and here we get data which is present in f there is form , in form there is value,
    // from value we transfer data in const ie location name and description
    const {locationName,description} = f.form.value;
    // and uuid is transfer in new const uid
    const uid=uuidv4();
     // here we are  fixing or set  the onsumit method data in database by transferring into an object
      // left side names are from database(where we are fixing or storing data) ie id, locationName, instaId
    this.db.object(`/posts/${uid}`).set({
      id:uid,
      locationName: locationName,
      description:description,
      picture:this.picture,
      by : this.user.username,
      instaId: this.user.username,
      date: Date.now()
    }).then(()=>{
      this.toastr.success("post add successfully")
      this.router.navigateByUrl("");
    }).catch((error)=>{
      this.toastr.error("error while process")
    })
  }

  // When an async function is called, it returns a Promise.
  // When the async function returns a value,the Promise will be resolved with the returned value.
  // When the async function throws an exception or some value,the Promise will be rejected with the thrown value.

  // An async function can contain an await expression, that pauses the execution of the async function and waits for the passed Promise's resolution,
  // and then resumes the async function's execution and returns the resolved value.

  // sometimes lower code execute without waiting the above code, so to protect this mis arranement we use async
  async uploadFile(event) {
    console.log(event);
    const file = event.target.files[0];

    let resizedImage = await readAndCompressImage(file, config);

    const filePath = file.name;
    const fileRef = this.storage.ref(filePath);

    const task = this.storage.upload(filePath, resizedImage);

    // percentchange is predefined method for display percentage upload data
    task.percentageChanges().subscribe((percentage) => {
      this.uploadPercent = percentage;
    });


    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          this.picture = url;
          this.toastr.success("image upload successfully...");
        })
      })
    ).subscribe();
  }
}
