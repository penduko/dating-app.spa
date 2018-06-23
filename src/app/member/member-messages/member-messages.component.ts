import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../../_models/message';
import { AuthService } from '../../_services/auth.service';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { tap } from 'rxjs/operators';
import * as _ from 'underscore';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() userId: number;
  messages: Message[];
  newMessage: any = {};

  constructor(
    private authSerivice: AuthService,
    private userService: UserService,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    const currentUserId = +this.authSerivice.decodedToken.nameid;

    this.userService
      .getMessageThread(this.authSerivice.decodedToken.nameid, this.userId)
      // do something with obeservable array that being returned
      .pipe(
        tap(messages => {
          // iterates messages
          _.each(messages, (message: Message) => {
            // mark unread messages as read
            if (
              message.isRead === false &&
              message.recipientId === currentUserId
            ) {
              this.userService.markAsread(currentUserId, message.id);
            }
          });
        })
      )
      .subscribe(
        messages => {
          this.messages = messages;
        },
        error => {
          this.alertify.error(error);
        }
      );
  }

  sendMessage() {
    this.newMessage.recipientId = this.userId;

    this.userService
      .sendMessage(this.authSerivice.decodedToken.nameid, this.newMessage)
      .subscribe(
        message => {
          // insert the new message at
          // the start of our messages array
          this.messages.unshift(message);

          //// uncomment to run debugger
          // debugger;

          // reset the message form
          this.newMessage.content = '';
        },
        error => {
          this.alertify.error(error);
        }
      );
  }
}
