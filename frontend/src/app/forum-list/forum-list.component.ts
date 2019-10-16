import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatSnackBar, MatSort, MatTable, MatTableDataSource} from '@angular/material';
import {Forum} from '../forum';
import {FormControl} from '@angular/forms';
import {DataService} from '../data.service';
import {map, startWith} from 'rxjs/operators';
import {User} from '../user';
import {Observable} from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Component({
  selector: 'app-forum-list',
  templateUrl: './forum-list.component.html',
  styleUrls: ['./forum-list.component.scss']
})
export class ForumListComponent implements OnInit, OnDestroy {
  forumUserChipCtrl = new FormControl();
  dataService: DataService = null;
  snackBar = null;
  forums$: Observable<Forum[]>;
  forumsDataSource = null;
  forumsSubscription = null;
  forumsTableColumnsToDisplay = ['date', 'users', 'budget', 'notes', 'remove'];
  users: User[] = [];
  currentUser$ = null;
  filteredUsers: Observable<User[]>;
  environment = environment;
  @ViewChild(MatTable, {static: false}) forumsTable: MatTable<Forum>;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(dataService: DataService, snackBar: MatSnackBar) {
    this.dataService = dataService;
    this.snackBar = snackBar;
    this.filteredUsers = this.forumUserChipCtrl.valueChanges.pipe(
      startWith(null),
      map((user: string | null) => user ? this._filterUsers(user) : this.users.slice()));
  }

  ngOnInit() {
    this.forums$ = this.dataService.forums;
    this.currentUser$ = this.dataService.currentUser;
    this.forumsSubscription = this.forums$.subscribe((forums) => {
      this.forumsDataSource = new MatTableDataSource(forums);
      this.forumsDataSource.sort = this.sort;
    });
  }

  ngOnDestroy() {
    this.forumsSubscription.unsubscribe();
  }

  addForum() {
    // Dates in JS are not the top of their class
    this.dataService.addForum(
    ).subscribe(() => {
      this.snackBar.open('Added forum', null, {
        duration: environment.toastDelay,
      });
    }, (err) => {
      this.snackBar.open('Error on adding forum', null, {
        duration: environment.toastDelay,
      });
    });
  }

  updateForum(ev, forum) {
    // Hacks for writing foreign key to drf
    // (https://stackoverflow.com/questions/29950956/drf-simple-foreign-key-assignment-with-nested-serializers)
    // (https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript)
    const cloneForum = JSON.parse(JSON.stringify(forum));
    delete cloneForum.users;
    cloneForum.users_id = [];
    for (const user of forum.users) {
      cloneForum.users_id.push(user.id);
    }
    this.dataService.updateForum(cloneForum).subscribe(() => {
      this.snackBar.open('Updated forum', null, {
        duration: environment.toastDelay,
      });
    }, (err) => {
      this.snackBar.open('Error on updated forum', null, {
        duration: environment.toastDelay,
      });
    });
  }

  removeForum(ev, forum) {
    this.dataService.removeForum(forum).subscribe(() => {
      this.snackBar.open('Removed forum', null, {
        duration: environment.toastDelay,
      });
    }, (err) => {
      this.snackBar.open('Error on remove forum', null, {
        duration: environment.toastDelay,
      });
    });
  }

  removeUserFromForum(user, forum) {
    return;
  }

  addUserToForum($event, forum) {
    return;
  }

  private _filterUsers(value: string): User[] {
    const filterValue = value.toLowerCase();

    return this.users.filter(
      user => user.username.toLowerCase().indexOf(filterValue) === 0 || user.name.toLowerCase().indexOf(filterValue) === 0
    );
  }
}
