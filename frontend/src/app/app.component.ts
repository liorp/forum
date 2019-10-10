import {Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from './data.service';
import {User} from './user';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Forum} from './forum';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  userChipCtrl = new FormControl();
  currentUser = null;
  currentMador = null;
  dateToCalculate = new Date().toISOString().slice(0, 7);
  dataService: DataService = null;
  snackBar = null;
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

  @ViewChild(MatSort, {static: false}) set content(sort: MatSort) {
    this.usersDataSource.sort = sort;
  }

  constructor(dataService: DataService, snackBar: MatSnackBar) {
    this.dataService = dataService;
    this.snackBar = snackBar;
  }

  ngOnInit() {
    this.dataService.login().subscribe((currentUser) => {
      this.currentUser = currentUser;
      this.currentMador = this.currentUser.mador;
      this.getForums();
      this.getUsers();
    });
  }

  getForums() {
    this.dataService.getForums().subscribe((forums) => {
      this.forums.splice(0);
      for (const forum of forums) {
        this.forums.push(forum);
      }
      this.forumsDataSource = new MatTableDataSource<Forum>(this.forums);
      this.snackBar.open('Fetched forums', null, {
        duration: 700,
      });
    }, (err) => {
      this.snackBar.open('Error on getting forums', null, {
        duration: 700,
      });
    });
  }

  getUsers() {
    this.dataService.getUsers().subscribe((users) => {
      this.users.splice(0);
      for (const user of users) {
        this.users.push(user);
      }
      this.usersDataSource = new MatTableDataSource<User>(this.users);
      this.snackBar.open('Fetched users', null, {
        duration: 700,
      });
    }, (err) => {
      this.snackBar.open('Error on get users', null, {
        duration: 700,
      });
    });
  }

  addForums() {
    // Dates in JS are not the top of their class
    this.dataService.calculateForums(
      parseInt(this.dateToCalculate.slice(5, 7), 10),
      parseInt(this.dateToCalculate.slice(0, 4), 10),
      this.currentMador.id
    ).subscribe(() => {
      this.getForums();
      this.getUsers();
      this.snackBar.open('Calculated forums', null, {
        duration: 700,
      });
    }, (err) => {
      this.snackBar.open('Error on calculating forums', null, {
        duration: 700,
      });
    });
  }

  updateMador(ev) {
    this.dataService.updateMador(this.currentMador).subscribe(() => {
      this.getForums();
      this.getUsers();
      this.snackBar.open('Updated mador', null, {
        duration: 700,
      });
    }, (err) => {
      this.snackBar.open('Error on updated mador', null, {
        duration: 700,
      });
    });
  }

  updateForum(ev) {
    this.dataService.updateForum(ev).subscribe(() => {
      this.getForums();
      this.getUsers();
      this.snackBar.open('Updated forum', null, {
        duration: 700,
      });
    }, (err) => {
      this.snackBar.open('Error on updated forum', null, {
        duration: 700,
      });
    });
  }

  removeUserFromForum(user, forum) {
    return;
  }

  addUserToForum($event, forum) {
    return;
  }
}
