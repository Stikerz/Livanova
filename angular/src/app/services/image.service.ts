import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {UserService} from "./user.service";
import {BehaviorSubject} from "rxjs";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  baseUrl: string = 'http://127.0.0.1:8000';
  token: string;
  images: any = new BehaviorSubject([]);
  sharedImages = this.images.asObservable();
  image: any = new BehaviorSubject({});
  sharedImage = this.image.asObservable();
  errors: any = [];

  private httpOptionsToken: any;
  private httpOptionsMulti: any;

  constructor(private http: HttpClient, private router: Router, private userService: UserService, private toastr: ToastrService) {
    this.userService.sharedToken.subscribe(data => this.token = data);
    this.httpOptionsToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.token
      })
    };

    this.httpOptionsMulti = {
      headers: new HttpHeaders({
        'Authorization': 'Token ' + this.token
      })
    };
  }

  updateHeader() {
    this.httpOptionsToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.token
      })
    };
    this.httpOptionsMulti = {
      headers: new HttpHeaders({
        'Authorization': 'Token ' + this.token
      })
    };
  }

  public getImages() {
    this.updateHeader();
    this.http.get(this.baseUrl + '/api/images?ordering=color', this.httpOptionsToken).subscribe(
      data => {
        this.images.next(data);
      },
      err => {
        console.log(this.httpOptionsToken);
        this.toastr.error("Error Retrieving Image", "Error");
        this.errors = err['error'];
      }
    );
  }

  public getImage(id) {
    this.updateHeader();
    this.http.get(this.baseUrl + '/api/images/' + id, this.httpOptionsToken).subscribe(
      data => {
        this.image.next(data);
      },
      err => {
        this.toastr.error("Error Retrieving Images", "Error");
        this.errors = err['error'];
      }
    );
  }

  public updateImage(id, data) {
    this.updateHeader();
    this.http.put(this.baseUrl + '/api/images/' + id + '/', JSON.stringify(data), this.httpOptionsToken).subscribe(
      data => {
        this.image.next(data);
        this.toastr.success("Image Updated");
        this.router.navigate(['myimages']);
      },
      err => {
        this.toastr.error("Error Updating Image", "Error");
        console.log(this.errors = err['error']);
      }
    );
  }

  public deleteImage(id) {
    this.updateHeader();
    this.http.delete(this.baseUrl + '/api/images/' + id + '/', this.httpOptionsToken).subscribe(
      data => {
        this.toastr.success("Image Deleted");
        this.image.next([]);
        this.router.navigate(['myimages']);

      },
      err => {
        this.toastr.error("Error Deleting Image", "Error");
        this.errors = err['error'];
      }
    );
  }

  public postImage(data) {
    this.updateHeader();
    this.http.post(this.baseUrl + '/api/images/', data, this.httpOptionsMulti).subscribe(
      data => {
        this.toastr.success("Image Created");
      },
      err => {
        this.toastr.error("Error Creating Image", "Error");
        console.log(err['error']);
        this.errors = err['error'];
      }
    );
  }
}
