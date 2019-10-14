import {Component, OnInit, ViewChild} from '@angular/core';
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
export class ForumListComponent implements OnInit {
  forumUserChipCtrl = new FormControl();
  dataService: DataService = null;
  snackBar = null;
  forums: Forum[] = [];
  forumsTableColumnsToDisplay = ['date', 'users', 'budget', 'notes', 'remove'];
  forumsDataSource: MatTableDataSource<Forum>;
  users: User[] = [];
  currentUser = null;
  filteredUsers: Observable<User[]>;
  environment = environment;
  @ViewChild(MatTable, {static: false}) forumsTable: MatTable<Forum>;
  @ViewChild(MatSort, {static: false}) set matSort(sort: MatSort) {
    if (this.forumsDataSource) {
      this.forumsDataSource.sort = sort;
    }
  }

  constructor(dataService: DataService, snackBar: MatSnackBar) {
    this.dataService = dataService;
    this.snackBar = snackBar;
    this.filteredUsers = this.forumUserChipCtrl.valueChanges.pipe(
      startWith(null),
      map((user: string | null) => user ? this._filterUsers(user) : this.users.slice()));
  }

  ngOnInit() {
    this.dataService.getCurrentUser().subscribe((currentUser) => {
      this.currentUser = currentUser;
    });
  }


  getForums() {
    return this.dataService.getForums().subscribe((forums) => {
      this.forums.splice(0);
      for (const forum of forums) {
        this.forums.push(forum);
      }
      this.forumsDataSource = new MatTableDataSource<Forum>(this.forums);
      this.forumsDataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'date':
            return new Date(item.date);
          default:
            return item[property];
        }
      };
      this.snackBar.open('Fetched forums', null, {
        duration: environment.toastDelay,
      });
    }, (err) => {
      this.snackBar.open('Error on getting forums', null, {
        duration: environment.toastDelay,
      });
    });
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

  // TODO: FIX THIS NO GOOD
  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  debounce(func, wait, immediate) {
    // 'private' variable for instance
    // The returned function will be able to reference this due to closure.
    // Each call to the returned function will share this common timer.
    var timeout;
    // Calling debounce returns a new anonymous function
    return (...args) => {
      // reference the context and args for the setTimeout function
      const context = this;

      // Should the function be called now? If immediate is true
      //   and not already in a timeout then the answer is: Yes
      const callNow = immediate && !timeout;

      // This is the basic debounce behaviour where you can call this
      //   function several times, but it will only execute once
      //   [before or after imposing a delay].
      //   Each time the returned function is called, the timer starts over.
      clearTimeout(timeout);

      // Set the new timeout
      timeout = setTimeout(() => {

        // Inside the timeout function, clear the timeout variable
        // which will let the next execution run when in 'immediate' mode
        timeout = null;

        // Check if the function already ran with the immediate flag
        if (!immediate) {
          // Call the original function with apply
          // apply lets you define the 'this' object as well as the arguments
          //    (both captured before setTimeout)
          func.apply(context, args);
        }
      }, wait);

      // Immediate mode and no wait timer? Execute the function...
      if (callNow) {
        func.apply(context, args);
      }
    };
  }
}
