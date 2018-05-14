import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from '../../_models/Photo.ts';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../_services/auth.service';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  // reference to current main photo
  currentMainPhoto: Photo;
  // property to use in parent component
  // of type string to pass the url
  @Output() getMemberPhotoChange = new EventEmitter<string>();

  constructor(private authService: AuthService,
      private userService: UserService,
      private alertify: AlertifyService) {}

  ngOnInit() {
    this.initializeUploader();
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url:
        this.baseUrl +
        'users/' +
        this.authService.decodedToken.nameid +
        '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024 // 10 MB
    });

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          url: res.url,
          description: res.description,
          dateAdded: res.dateAdded,
          isMain: res.isMain
        };

        // push to the newly uploaded photo
        // in our array of photo
        this.photos.push(photo);
      }
    };
  }

  setMainPhoto(photo: Photo) {
    this.userService.setMainPhoto(this.authService.decodedToken.nameid, photo.id)
      .subscribe(() => {
        // because where using the type declaration files
        // we get access all the methods inside underscore
        // then we can find the main photo in our array of photos
        this.currentMainPhoto = _.findWhere(this.photos, {isMain: true});
        // set current main photo to false
        this.currentMainPhoto.isMain = false;

        // then we can set the photo to main
        photo.isMain = true;

        // set currentPhotoUrl to photoUrl contained in current user object
        this.authService.changeMemberPhoto(photo.url);

        // update the current user
        this.authService.currentUser.photoUrl = photo.url;

        // update the user in local storage
        localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
      }, error => {
        this.alertify.error(error);
      });
  }

  deletePhoto(id: number) {
    this.alertify.confirm('Are you sure you want to delete this photo?', () => {
      // after user confirm
      // delete the photo
      this.userService.deletePhoto(this.authService.decodedToken.nameid, id).subscribe(() => {
        // delete the photo in our arrays of photos
        this.photos.splice(_.findIndex(this.photos, {id: id}), 1);
        this.alertify.success('Photo has been deleted');
      }, error => {
        this.alertify.error('Failed to delete the photo');
      });
    });
  }
}
