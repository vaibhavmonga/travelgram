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
    auth.getuser().subscribe((user)=>{
      this.db.object(`/user/$(user.uid)`).valueChanges().subscribe((userDetails)=>{
        this.user=userDetails;
      })
    })
  }

  ngOnInit(): void {
  }
  onSubmit(f:NgForm){
    const {locationName,description} = f.form.value;
    const uid=uuidv4();

    this.db.object(`/posts/$(uid)`).set({
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
  async uploadFile(event) {
    console.log(event);
    const file = event.target.files[0];

    let resizedImage = await readAndCompressImage(file, config);

    const filePath = file.name;
    const fileRef = this.storage.ref(filePath);

    const task = this.storage.upload(filePath, resizedImage);

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
