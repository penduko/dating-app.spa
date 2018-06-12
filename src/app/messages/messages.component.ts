import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination, PaginatedResult } from '../_models/pagination';
import { AlertifyService } from '../_services/alertify.service';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'underscore';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  // default param
  messageContainer = 'Unread';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // use message resolver
    this.route.data.subscribe(data => {
      // get the paginated results
      this.messages = data['messages'].result;
      // get the pagination from header
      this.pagination = data['messages'].pagination;
    });
  }

  loadMessages() {
    this.userService
      .getMessages(
        this.authService.decodedToken.nameid,
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        this.messageContainer
      )
      .subscribe(
        (res: PaginatedResult<Message[]>) => {
          // get the paginated result and headers
          this.messages = res.result;
          this.pagination = res.pagination;
        },
        error => {
          this.alertify.error(error);
        }
      );
  }

  deleteMessage(id: number) {
    // alertify confirm message
    this.alertify.confirm('Are you sure you want to delete the message?', () => {
      // ok callback
      this.userService.deleteMessage(this.authService.decodedToken.nameid, id)
        .subscribe(() => {
          // remove the message from array of messages
          // use undercore to find the index
          this.messages.splice(_.findIndex(this.messages, {id: id}), 1);
          this.alertify.success('Messages has been deleted');
        }, error => {
          this.alertify.error(error);
        });
    });
  }

  pageChanged(event: any): void {
    // set the curret page
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }

}
