import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/User';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from '../../_models/pagination';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: User[];
  user: User = JSON.parse(localStorage.getItem('user'));
  genderList = [
    { value: 'male', display: 'Males' },
    { value: 'female', display: 'Females' }
  ];
  userParams: any = {};
  pagination: Pagination;

  constructor(
    private userService: UserService,
    private altertify: AlertifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // use memberlist resolver
    this.route.data.subscribe(data => {
      // get the paginated results
      this.users = data['users'].result;
      // get the pagination from header
      this.pagination = data['users'].pagination;
    });

    // set the gender params opposite of the
    // current user gender
    this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'lastActive';
  }

  loadUsers() {
    this.userService
      .getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
      .subscribe(
        (res: PaginatedResult<User[]>) => {
          // get the paginated result and
          // headers
          this.users = res.result;
          this.pagination = res.pagination;
        },
        error => {
          this.altertify.error(error);
        }
      );
  }

  resetFilters() {
    // set the gende params opposite of the
    // current user gender
    this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;

    // reload the users
    this.loadUsers();
  }

  pageChanged(event: any): void {
    // set the curret page
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }
}
