import { Component, OnInit } from '@angular/core';
import {DataService} from '../data.service';
import {MatSnackBar} from '@angular/material';
import { environment } from '../../environments/environment.prod';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  currentUser = null;
  dateToCalculate = new Date().toISOString().slice(0, 7);
  dataService: DataService = null;
  snackBar = null;
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
  environment = environment;
  currentMador = null;

  constructor(dataService: DataService, snackBar: MatSnackBar) {
    this.dataService = dataService;
    this.snackBar = snackBar;
  }

  ngOnInit() {
    this.dataService.getCurrentUser().subscribe((currentUser) => {
      this.currentUser = currentUser;
      this.currentMador = this.currentUser.mador;
    });
  }

  calculateForums() {
    // Dates in JS are not the top of their class
    this.dataService.calculateForums(
      parseInt(this.dateToCalculate.slice(5, 7), 10),
      parseInt(this.dateToCalculate.slice(0, 4), 10),
      this.currentMador.id
    ).subscribe(() => {
      this.snackBar.open('Calculated forums', null, {
        duration: environment.toastDelay,
      });
    }, (err) => {
      this.snackBar.open('Error on calculating forums', null, {
        duration: environment.toastDelay,
      });
    });
  }

  getCurrentMador() {
    return this.dataService.getMador(this.currentMador).subscribe((mador) => {
      this.currentMador = mador;
      this.snackBar.open('Fetched mador', null, {
        duration: environment.toastDelay,
      });
    }, (err) => {
      this.snackBar.open('Error on get mador', null, {
        duration: environment.toastDelay,
      });
    });
  }

  updateMador(ev, mador) {
    // Hacks for writing foreign key to drf
    // (https://stackoverflow.com/questions/29950956/drf-simple-foreign-key-assignment-with-nested-serializers)
    // (https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript)
    const cloneMador = JSON.parse(JSON.stringify(mador));
    delete cloneMador.users;
    cloneMador.users_id = [];
    for (const user of mador.users) {
      cloneMador.users_id.push(user.id);
    }
    cloneMador.admin = cloneMador.admin.id;
    this.dataService.updateMador(cloneMador).subscribe(() => {
      this.snackBar.open('Updated mador', null, {
        duration: environment.toastDelay,
      });
    }, (err) => {
      this.snackBar.open('Error on updated mador', null, {
        duration: environment.toastDelay,
      });
    });
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
