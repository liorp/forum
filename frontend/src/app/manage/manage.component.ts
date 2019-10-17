import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../data.service';
import {MatAutocomplete, MatSnackBar} from '@angular/material';
import {environment} from '../../environments/environment.prod';
import {Mador} from '../mador';
import {User} from '../user';
import {map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {renderConstantPool} from '@angular/compiler-cli/ngcc/src/rendering/renderer';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit, OnDestroy {
  madorUsersChipCtrl = new FormControl();
  madorAdminUsersChipCtrl = new FormControl();
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
  users = null;
  currentMadorUsers = null;
  madorToUpdate: Mador = new Mador();
  currentMadorSubscription = null;
  currentMadorUsersSubscription = null;
  usersSubscription = null;
  filteredMadorUsers = null;
  filteredAdminMadorUsers = null;
  selectedUser = null;
  @Input() currentMador$: Observable<Mador>;
  @Input() currentUser$: Observable<User>;
  @Input() users$: Observable<User[]>;
  @Input() currentMadorUsers$: Observable<User[]>;
  @ViewChild('madorUsersAutocomplete', {static: false}) matAutocompleteUsers: MatAutocomplete;
  @ViewChild('madorAdminAutocomplete', {static: false}) matAutocompleteAdmin: MatAutocomplete;

  constructor(dataService: DataService, snackBar: MatSnackBar) {
    this.dataService = dataService;
    this.snackBar = snackBar;
    // TODO: FIX AUTOCOMPLETE AND USERS AND ADMINS OF MADORTOUPDATE
    this.filteredMadorUsers = this.madorUsersChipCtrl.valueChanges.pipe(
      startWith(null),
      map((user: string | null) => {
        if (user && typeof user === 'string') {
          return this._filterUsers(user, this.difference(this.users, this.currentMadorUsers));
        } else {
          return this.difference(this.users, this.currentMadorUsers);
        }
      }));
    this.filteredAdminMadorUsers = this.madorAdminUsersChipCtrl.valueChanges.pipe(
      startWith(null),
      map((user: string | null) => {
        if (user && typeof user === 'string') {
          return this._filterUsers(user, this.currentMadorUsers);
        } else {
          return this.users.slice();
        }
      }));
  }

  ngOnInit() {
    this.usersSubscription = this.users$.subscribe((users) => {
      if (users) {
        this.users = users;
      }
    });
    this.currentMadorUsersSubscription = this.users$.subscribe((currentMadorUsers) => {
      if (currentMadorUsers) {
        this.currentMadorUsers = currentMadorUsers;
      }
    });
    this.currentMadorSubscription = this.currentMador$.subscribe((currentMador) => {
      if (currentMador) {
        this.madorToUpdate = JSON.parse(JSON.stringify(currentMador));
      }
    });
  }

  ngOnDestroy(): void {
    this.currentMadorSubscription.unsubscribe();
    this.currentMadorUsersSubscription.unsubscribe();
    this.usersSubscription.unsubscribe();
  }

  calculateForums() {
    // Dates in JS are not the top of their class
    this.dataService.calculateForums(
      parseInt(this.dateToCalculate.slice(5, 7), 10),
      parseInt(this.dateToCalculate.slice(0, 4), 10),
      this.madorToUpdate.id
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

  // TODO: Solve doubleupdate
  updateMador() {
    // Hacks for writing foreign key to drf
    // (https://stackoverflow.com/questions/29950956/drf-simple-foreign-key-assignment-with-nested-serializers)
    // (https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript)
    /*const cloneMador = JSON.parse(JSON.stringify(mador));
    delete cloneMador.users;
    cloneMador.users_id = [];
    for (const user of mador.users) {
      cloneMador.users_id.push(user.id);
    }
    cloneMador.admin = cloneMador.admin.id;*/
    this.dataService.updateMador(this.madorToUpdate).subscribe(() => {
      this.snackBar.open('Updated mador', null, {
        duration: environment.toastDelay,
      });
    }, (err) => {
      this.snackBar.open('Error on updated mador', null, {
        duration: environment.toastDelay,
      });
    });
  }

  private _filterUsers(value: string, users: User[]): User[] {
    const filterValue = value.toLowerCase();

    return users.filter(
      user => user.username.toLowerCase().indexOf(filterValue) === 0 || user.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  onSelectedUser($event) {
    this.selectedUser = $event.option.value;
  }

  removeUserFromMador(user) {
    function remove(tempUser) {
      return tempUser.id !== user.id;
    }

    this.madorToUpdate.users = this.madorToUpdate.users.filter(remove);
    this.updateMador();
  }

  // TODO: Bug when adding a second user
  addUserToMador() {
    if (!this.matAutocompleteUsers.isOpen) {
      if (this.selectedUser && this.selectedUser.id) {
        this.madorToUpdate.users.push(this.selectedUser);
        this.updateMador();
      }
    }
  }

  removeAdminUserFromMador(user) {
    function remove(tempUser) {
      return tempUser.id !== user.id;
    }

    this.madorToUpdate.admins = this.madorToUpdate.admins.filter(remove);
    this.updateMador();
  }

  // TODO: Bug when adding a second user
  addAdminUserToMador() {
    if (!this.matAutocompleteAdmin.isOpen) {
      if (this.selectedUser && this.selectedUser.id) {
        this.madorToUpdate.admins.push(this.selectedUser);
        this.updateMador();
      }
    }
  }

  // Does difference between arrayOne and arrayTwo using id of the objects
  difference(arrayOne: any[], arrayTwo: any[]) {
    const arrayOneCopy = [...arrayOne];

    for (let obj of arrayTwo) {
      // Need i for splice
      for (let i = 0; i < arrayOneCopy.length; i++) {
        if (obj.id === arrayOneCopy[i].id) {
          arrayOneCopy.splice(i, 1);
        }
      }
    }
    return arrayOneCopy;
  }
}
