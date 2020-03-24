import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from "rxjs";
import {Router} from '@angular/router';
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl: string = 'http://127.0.0.1:8000';
  tokenURL: string = '/api-token-auth/';

  // http options used for making API calls
  private httpOptions: any;
  private httpOptionsToken: any;

  // the actual token
  private token = new BehaviorSubject('');
  sharedToken = this.token.asObservable();

  // User Id
  private userID = new BehaviorSubject('');
  shareduserID = this.userID.asObservable();

  // User
  private user: any = new BehaviorSubject({});
  sharedUser = this.user.asObservable();

  // error messages received from the login attempt
  public errors: any = [];

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    this.httpOptionsToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.token.value
      })
    };
  }

  // Uses http.post() to get an auth token from djangorestframework endpoint
  public login(user) {
    this.http.post(this.baseUrl + this.tokenURL, JSON.stringify(user), this.httpOptions).subscribe(
      data => {
        this.token.next(data['token']);
        this.userID.next(data['user_id']);
        console.log(this.userID.getValue());
        this.router.navigate(['']);
      },
      err => {
        this.toastr.error("Error Authorizing User Login", "Error");
        this.errors = err['error'];
        console.log(this.errors);
      }
    );
  }

  public register(user) {
    this.http.post(this.baseUrl + '/api/users/', JSON.stringify(user), this.httpOptions).subscribe(
      data => {
        const tmpUser = user.username;
        const tmpPassword = user.password;
        this.login({'username': tmpUser, 'password': tmpPassword});
      },
      err => {
        this.toastr.error("Error User Registration", "Error");
        this.errors = err['error'];
      }
    );
  }

    public updateUser(data) {
        this.updateheader();
    this.http.put(this.baseUrl + '/api/users/'+ this.userID.value + '/', JSON.stringify(data), this.httpOptionsToken).subscribe(
      data => {
        console.log(this.token.value);
        this.toastr.success("User Updated");
        this.router.navigate(['']);
      },
      err => {
        console.log(this.httpOptionsToken);
        this.toastr.error("Error Updating User", "Error");
        this.errors = err['error'];
      }
    );
  }

      public getUser() {
        this.updateheader();
    this.http.get(this.baseUrl + '/api/users/'+ this.userID.value + '/', this.httpOptionsToken).subscribe(
      data => {
        console.log(data);
        this.user.next(data)

      },
      err => {
        console.log(this.httpOptionsToken);
        this.toastr.error("Error Retrieving User", "Error");
        this.errors = err['error'];
      }
    );
  }
      public deleteUser() {
        this.updateheader();
    this.http.delete(this.baseUrl + '/api/users/'+ this.userID.value + '/', this.httpOptionsToken).subscribe(
      data => {
        this.toastr.success("User Deleted");
        this.user.next(null);
        this.logout()

      },
      err => {
        this.toastr.error("Error Deleting User", "Error");
        this.errors = err['error'];
      }
    );
  }

  private updateheader(){
            this.httpOptionsToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.token.value
      })
    };
  }

  public logout() {
    this.token.next(null);
    this.user.next(null);
    this.userID.next(null);
    this.router.navigate(['']);
  }
}




