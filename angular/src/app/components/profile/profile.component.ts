import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  password: string = '';
  token : string;
  firstname: string;
  lastname: string;

  constructor(private userService: UserService, private toastr: ToastrService,  private router: Router) {}

  ngOnInit(): void {
        this.userService.sharedToken.subscribe(data => this.token = data);
    if (this.token) {
      this.userService.getUser();
      this.userService.sharedUser.subscribe(data =>
      {
        this.firstname = data.first_name;
        this.lastname = data.last_name;
      });
    } else {
      this.router.navigate(['login']);
    }
  }

  update() {
    const data : object = {};
    if(this.firstname){
      data["first_name"] = this.firstname;

    }
    if (this.lastname){
      data["last_name"] = this.lastname;

    }
    if (this.password){
      data["password"] = this.password;
    }
    this.userService.updateUser(data);
    }

    delete() {
    this.userService.deleteUser();
    }
}
