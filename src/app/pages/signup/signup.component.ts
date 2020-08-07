import { Component, OnInit } from '@angular/core';

import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {AuthService} from "../../sevices/auth.service";
import {NgForm} from "@angular/forms";
import {finalize} from "rxjs/operators";


//Firebase
import {AngularFireStorage} from "@angular/fire/storage";
import {AngularFireDatabase} from "@angular/fire/database";

import { readAndCompressImage } from 'browser-image-resizer';

const config = {
  quality: 0.5,
  maxWidth: 800,
  maxHeight: 600,
  autoRotate: true,
  debug: true
};

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  picture : string = "https://images.pexels.com/photos/2681319/pexels-photo-2681319.jpeg";

  uploadPercent : number = null;

  constructor(
    private auth:AuthService,
    private router: Router,
    private db: AngularFireDatabase,
    private storage:AngularFireStorage,
    private toastr:ToastrService
  ) { }

  ngOnInit(): void {
  }

  onSubmit(f : NgForm){
    const { name,email,username,bio,country,password } = f.form.value;


    this.auth.signup(email,password)
      .then((res)=>{
        console.log(res);
        const { uid } = res.user;

        this.db.object(`/users/${uid}`).set({
          id : uid,
          name : name,
          email : email,
          username : username,
          country : country,
          bio : bio,
          picture : this.picture
        })


      }).then(()=>{
      this.router.navigateByUrl("");
      this.toastr.success("Registered Successfully");
    }).catch((err)=>{
      console.log(err)
      this.toastr.error("Signup failed");
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
