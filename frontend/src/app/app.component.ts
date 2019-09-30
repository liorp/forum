import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from './api.service';
import {DataService} from './data.service';
import {User} from './user';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Forum} from './forum';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  userChipCtrl = new FormControl();
  currentUser = null;
  madorForumAdmin = null;
  apiService = null;
  dataService = null;
  title = 'forums';
  numberOfOrganizers = null;
  forumFrequency = null;
  days = [
    {
      name: 'Sunday',
      value: 0
    }, {
      name: 'Monday',
      value: 1
    }, {
      name: 'Tuesday',
      value: 2
    }, {
      name: 'Wednesday',
      value: 3
    }, {
      name: 'Thursday',
      value: 4
    }
  ];
  dayOfForum = this.days[4];
  forums = [];
  users: User[] = [];
  forumsTableColumnsToDisplay = ['date', 'users', 'notes'];
  usersTableColumnsToDisplay = ['username', 'forumCount'];
  forumsDataSource: MatTableDataSource<Forum>;
  usersDataSource: MatTableDataSource<User>;

  @ViewChild(MatTable, {static: false}) forumsTable: MatTable<Forum>;
  @ViewChild(MatTable, {static: false}) usersTable: MatTable<User>;


  constructor(apiService: ApiService, dataService: DataService) {
    this.apiService = apiService;
    this.dataService = dataService;
    this.dataService.getCurrentUser().subscribe((currentUser) => {
      this.currentUser = currentUser;
      this.dataService.getForums(this.currentUser).subscribe((forums) => {
        for (const forum of forums) {
          this.forums.push(forum);
        }
        this.forumsDataSource = new MatTableDataSource<Forum>(this.forums);
      });
      this.dataService.getUsers(this.currentUser).subscribe((users) => {
        for (const user of users) {
          this.users.push(user);
        }
        this.usersDataSource = new MatTableDataSource<User>(this.users);
      });
      this.dataService.getNumberOfOrganizers().subscribe((numberOfOrganizers) => {
        this.numberOfOrganizers = numberOfOrganizers;
      });
      this.dataService.getFrequency().subscribe((forumFrequency) => {
        this.forumFrequency = forumFrequency;
      });
      this.dataService.getMadorForumAdmin().subscribe((madorForumAdmin) => {
        this.madorForumAdmin = madorForumAdmin;
      });
    });
  }

  addForums() {
    return;
  }

  removeUserFromForum(user, forum) {
    return;
  }

  addUserToForum($event, forum) {
    return;
  }
}
