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
  currentMador = null;
  dateToCalculate = null;
  apiService = null;
  dataService = null;
  title = 'forums';
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

  @ViewChild(MatTable, {static: false}) forumsTable: MatTable<Forum>;
  @ViewChild(MatTable, {static: false}) usersTable: MatTable<User>;


  constructor(apiService: ApiService, dataService: DataService) {
    this.apiService = apiService;
    this.dataService = dataService;
    this.dataService.login().subscribe((currentUser) => {
      this.currentUser = currentUser;
      this.currentMador = this.currentUser.mador;
      this.getForums();
      this.getUsers();
    });
  }

  getForums() {
    this.dataService.getForums().subscribe((forums) => {
      for (const forum of forums) {
        this.forums.push(forum);
      }
      this.forumsDataSource = new MatTableDataSource<Forum>(this.forums);
    });
  }

  getUsers() {
    this.dataService.getUsers().subscribe((users) => {
      for (const user of users) {
        this.users.push(user);
      }
      this.usersDataSource = new MatTableDataSource<User>(this.users);
    });
  }

  addForums() {
    this.dataService.calculateForums(
      this.dateToCalculate.getMonth(),
      this.dateToCalculate.getYear(),
      this.currentMador.id
    ).subscribe(() => {
      this.getForums();
    });
  }

  removeUserFromForum(user, forum) {
    return;
  }

  addUserToForum($event, forum) {
    return;
  }
}
