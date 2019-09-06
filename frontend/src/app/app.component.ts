import {Component, OnInit} from '@angular/core';
import {ApiService} from './api.service';
import {DataService} from './data.service';
import {User} from './user';
import {MatTableDataSource} from '@angular/material/table';
import {Forum} from './forum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentUser = null;
  apiService = null;
  dataService = null;
  title = 'forums';
  result = null;
  dayOfForum = null;
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
  forums = [];
  users: User[] = [];
  forumsTableColumnsToDisplay = ['date', 'users', 'notes'];
  usersTableColumnsToDisplay = ['username', 'forumCount'];
  forumsDataSource: MatTableDataSource<Forum>;
  usersDataSource: MatTableDataSource<User>;

  constructor(apiService: ApiService, dataService: DataService) {
    this.apiService = apiService;
    this.dataService = dataService;
    this.currentUser = this.dataService.currentUser;
    this.dataService.getCurrentUser().subscribe((CurrentUser) => {
      this.currentUser = CurrentUser;
    });
    this.dataService.getForums(this.dataService.currentUser).subscribe((Forums) => {
      for (const forum of Forums) {
        this.forums.push(forum);
      }
      this.forumsDataSource = new MatTableDataSource<Forum>(this.forums);
    });
    this.dataService.getUsers(this.dataService.currentUser).subscribe((Users) => {
      for (const user of Users) {
        this.users.push(user);
      }
      this.usersDataSource = new MatTableDataSource<User>(this.users);
    });
  }

  getResult() {
    this.result = '1';
    const now = new Date(Date.now());
    const month = now.getMonth();
    const year = now.getFullYear();
    const daysOfForum = this.getDaysOfForumInMonth(this.dayOfForum, month, year);
  }

  getDaysOfForumInMonth(dayOfForum, month, year) {
    const date = new Date(Date.UTC(year, month, 1));
    const days = [];
    while (date.getMonth() === month) {
      if (date.getDay() === dayOfForum) {
        days.push(new Date(date));
      }
      date.setDate(date.getDate() + 1);
    }
    return days;
  }
}
