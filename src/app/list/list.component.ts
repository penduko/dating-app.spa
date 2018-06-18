import { Component, OnInit } from '@angular/core';
import { User } from '../_models/User';
import { Pagination, PaginatedResult } from '../_models/pagination';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  users: User[];
  pagination: Pagination;
  likesParam: string;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {
    // use list resolver
    this.route.data.subscribe(data => {
      // get the paginated results
      this.users = data['users'].result;
      // get the pagination from header
      this.pagination = data['users'].pagination;
    });

    // initialize default value
    this.likesParam = 'likers';
  }

  loadUsers() {
    this.userService
      .getUsers(
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        null,
        this.likesParam
      )
      .subscribe(
        (res: PaginatedResult<User[]>) => {
          // get the paginated result and headers
          this.users = res.result;
          this.pagination = res.pagination;
        },
        error => {
          this.alertify.error(error);
        }
      );
  }

  pageChanged(event: any): void {
    // set the curret page
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }
}
