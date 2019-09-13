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
    });
  }

  getResult() {
    const now = new Date(Date.now());
    const month = now.getMonth();
    const year = now.getFullYear();
    const daysOfForum = this.getDaysOfForumInMonth(this.dayOfForum.value, month, year, this.forumFrequency);
    let i = 0;
    for (const day of daysOfForum) {
      const users = this.getUsersForForum(this.numberOfOrganizers);
      for (const user of users) {
        user.forumCount += 1;
      }
      const forum = new Forum(i, users, day, 'Note');
      this.forums.push(forum);
      i += 1;
    }
    this.forumsTable.renderRows();
    this.usersTable.renderRows();
  }

  getUsersForForum(numberOfUsers) {
    this.users.sort((a, b) => (a.forumCount > b.forumCount) ? -1 : 1);
    return this.users.slice(0, numberOfUsers);
  }

  getDaysOfForumInMonth(dayOfForum, month, year, forumFrequency) {
    const date = new Date(Date.UTC(year, month, 1));
    const days = [];
    let increment = 1;
    while (date.getMonth() === month) {
      if (date.getDay() === dayOfForum) {
        days.push(new Date(date));
        if (increment === 1) {
          // Increase the increment in order to calculate faster
          increment = 7 * forumFrequency;
        }
      }
      date.setDate(date.getDate() + increment);
    }
    return days;
  }

  removeUserFromForum(user, forum) {
    return;
  }

  addUserToForum($event, forum) {
    return;
  }
}
