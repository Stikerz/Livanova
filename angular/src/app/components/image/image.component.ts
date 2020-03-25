import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {Router, ActivatedRoute} from "@angular/router";
import {ImageService} from "../../services/image.service";

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {
  token: string;
  image: any;
  idParam: string = "";
  name: string;
  color: string;
  colorChoice: any;

  constructor(private userService: UserService, private router: Router,
              private imageService: ImageService,
              private activateRoute: ActivatedRoute) {}

  delete() {
    this.imageService.deleteImage(this.idParam);
  }

  update(){
    this.imageService.updateImage(this.idParam,{"name": this.name, "color": this.color});
  }

  ngOnInit(): void {
    this.userService.sharedToken.subscribe(data => this.token = data);
    if (this.token) {
      this.imageService.sharedColorChoices.subscribe(data => this.colorChoice = data);
      this.activateRoute.params.subscribe(params => {
      this.idParam = params['id'];
    });
      this.imageService.getImage(this.idParam);
      this.imageService.sharedImage.subscribe(data => {
        this.image= data;
        this.name = data.name;
        this.color = data.color;
      });

    } else {
      console.log("Not Logged in");
      this.router.navigate(['login']);
    }
  }

}
