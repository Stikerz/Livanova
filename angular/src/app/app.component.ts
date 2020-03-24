import { Component } from '@angular/core';
import {UserService} from "./services/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular';
  token : string;

  constructor(private userService: UserService) {
    this.userService.sharedToken.subscribe(data => this.token= data);
  }


}


