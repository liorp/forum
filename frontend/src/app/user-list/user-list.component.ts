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
