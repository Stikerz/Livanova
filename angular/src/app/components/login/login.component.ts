import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {ImageService} from "../../services/image.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  // providers: [UserService]
})
export class LoginComponent implements OnInit {

  username: string = '';
  password: string = '';
  token: string;


  constructor(private userService: UserService, private toastr: ToastrService, private router: Router) {
  }

  login() {
    if (!this.username || !this.password){
      this.toastr.error('Error, please enter all fields', 'Error');
    }else {
      this.userService.login({
        'username': this.username,
        'password': this.password
      });
      this.clearFields();
    }
  }

  clearFields(){
     this.username = null;
     this.password = null;
  }
  register(){
    this.router.navigate(['register'])
  }

  ngOnInit(): void {
    this.userService.sharedToken.subscribe(data => {
      this.token = data;
    })
  }

}
