import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSnackBar, MatSort, MatTable, MatTableDataSource} from '@angular/material';
import {User} from '../user';
import {DataService} from '../data.service';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment.prod';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  dataService: DataService = null;
  users: Observable<User[]>;
  usersTableColumnsToDisplay = ['username', 'forumCount', 'latestForum'];
  environment = environment;
  snackBar = null;
  @ViewChild(MatTable, {static: false}) usersTable: MatTable<User>;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(dataService: DataService, snackBar: MatSnackBar) {
    this.dataService = dataService;
    this.snackBar = snackBar;
  }

  ngOnInit() {
    this.users = this.dataService.users;
  }

  /*getUsers() {
    return this.dataService.getUsers().subscribe((users) => {
      this.users.splice(0);
      for (const user of users) {
        this.users.push(user);
      }
      const topThreeUsers = this.users.sort((a, b) => b.forum_count - a.forum_count).slice(0, 3);
      topThreeUsers[0].firstPlace = true;
      topThreeUsers[1].secondPlace = true;
      topThreeUsers[2].thirdPlace = true;
      this.usersDataSource = new MatTableDataSource<User>(this.users);
      this.usersDataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'latestForumDate':
            return new Date(item.latest_forum.date);
          default:
            return item[property];
        }
      };
      // this.usersDataSource.sort = this.usersDataSort;
      this.snackBar.open('Fetched users', null, {
        duration: environment.toastDelay,
      });
    }, (err) => {
      this.snackBar.open('Error on get users', null, {
        duration: environment.toastDelay,
      });
    });
  }*/
}
