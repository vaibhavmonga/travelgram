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
@Component({
  selector: 'app-addpage',
  templateUrl: './addpage.component.html',
  styleUrls: ['./addpage.component.css']
})
export class AddpageComponent implements OnInit {

  constructor(
    private auth : AuthService,
    private router : Router,
    private db : AngularFireDatabase,
    private storage : AngularFireStorage,
    private toastr : ToastrService
  ) { }

  ngOnInit(): void {
  }
  onSubmit(){

  }
}
