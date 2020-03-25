import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {ImageService} from "../../services/image.service";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  token: string;
  image: any = '';
  name: string = '';
  color: string = '';
  file : File;
  colorChoice: any;

  constructor(private router: Router, private userService: UserService,
              private imageService: ImageService, private toastr: ToastrService) { }

  onImage(event: any){
    this.file = event.target.files[0];
    this.toastr.info("Image Attached");
  }

  upload() {
    if (!this.file || !this.color || !this.name){
      this.toastr.error('Error, please enter all fields correctly', 'Error');
    }else {
      const data = new FormData();
      data.append("name", this.name);
      data.append("color", this.color);
      data.append("image", this.file, this.file.name);
      this.imageService.postImage(data);
      this.clearFields()
    }
  }

  ngOnInit(): void {
    this.userService.sharedToken.subscribe(data => this.token= data);
    if(this.token){
      this.imageService.sharedColorChoices.subscribe(data => this.colorChoice = data);
    }
    else {
      this.router.navigate(['login']);
    }
  }

  clearFields(){
     this.name = null;
     this.color = null;
     this.file = null;
  }

}
