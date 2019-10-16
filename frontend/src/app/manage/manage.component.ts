import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from '../data.service';
import {MatSnackBar} from '@angular/material';
import { environment } from '../../environments/environment.prod';
import {Mador} from '../mador';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit, OnDestroy {
  currentUser$ = null;
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
  currentMador$ = null;
  users$ = null;
  madorToUpdate: Mador = new Mador();
  currentMadorSubscription = null;

  constructor(dataService: DataService, snackBar: MatSnackBar) {
    this.dataService = dataService;
    this.snackBar = snackBar;
  }

  ngOnInit() {
    this.currentUser$ = this.dataService.currentUser;
    this.currentMador$ = this.dataService.currentMador;
    this.users$ = this.dataService.users;
    this.currentMadorSubscription = this.currentMador$.subscribe((currentMador) => {
      if (currentMador) {
        this.madorToUpdate.id = currentMador.id;
      }
    });
  }

  ngOnDestroy(): void {
    this.currentMadorSubscription.unsubscribe();
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
}
