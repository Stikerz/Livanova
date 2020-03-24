import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {ImageService} from "../../services/image.service";

@Component({
  selector: 'app-my-images',
  templateUrl: './my-images.component.html',
  styleUrls: ['./my-images.component.css']
})
export class MyImagesComponent implements OnInit {
  token: string;
  images: any;

  constructor(private userService: UserService, private router: Router,
              private imageService: ImageService) {
  }

  ngOnInit(): void {
    this.userService.sharedToken.subscribe(data => this.token = data);
    if (this.token) {
      this.imageService.getImages();
      this.imageService.sharedImages.subscribe(data => this.images = data);
    } else {
      this.router.navigate(['login']);
    }

  }

}
