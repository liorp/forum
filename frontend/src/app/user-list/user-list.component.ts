import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
export class UserListComponent implements OnInit, OnDestroy {
  dataService: DataService = null;
  users$: Observable<User[]>;
  usersDataSource = null;
  usersSubscription = null;
  usersTableColumnsToDisplay = ['username', 'forumCount', 'latestForum'];
  environment = environment;
  snackBar = null;
  @ViewChild(MatTable, {static: false}) usersTable: MatTable<User>;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(dataService: DataService, snackBar: MatSnackBar) {
    this.dataService = dataService;
    this.snackBar = snackBar;
  }

  ngOnInit() {
    this.users$ = this.dataService.users;
    this.usersSubscription = this.users$.subscribe((users) => {
      const topThreeUsers = users.sort((a, b) => b.forum_count - a.forum_count).slice(0, 3);
      if (topThreeUsers.length) {
        topThreeUsers[0].firstPlace = true;
        topThreeUsers[1].secondPlace = true;
        topThreeUsers[2].thirdPlace = true;
      }
      this.usersDataSource = new MatTableDataSource(users);
      this.usersDataSource.sort = this.sort;
      this.usersDataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
           case 'latestForumDate': return new Date(item.latest_forum.date);
           default: return item[property];
        }
      };
    });
  }

  ngOnDestroy() {
    this.usersSubscription.unsubscribe();
  }
}
