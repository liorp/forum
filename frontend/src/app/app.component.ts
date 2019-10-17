import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataService} from './data.service';
import {User} from './user';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Forum} from './forum';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatSort} from '@angular/material/sort';
import {map, startWith, switchMap, mergeMap} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../environments/environment.prod';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentUser$ = null;
  currentMador$ = null;
  currentMadorSubscription = null;
  currentMadorUsers$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  forums$ = null;
  users$: Observable<User[]>;
  dataService: DataService = null;
  snackBar = null;

  constructor(dataService: DataService, snackBar: MatSnackBar) {
    this.dataService = dataService;
    this.snackBar = snackBar;
  }

  ngOnInit() {
    this.currentUser$ = this.dataService.currentUser;
    this.currentMador$ = this.dataService.currentMador;
    this.forums$ = this.dataService.forums;
    this.currentMadorSubscription = this.currentMador$.subscribe((mador) => {
      if (mador) {
        this.currentMadorUsers$.next(mador.users);
      }
    });
    this.users$ = this.dataService.users;
  }

  refresh() {
    this.dataService.refresh().subscribe(() => {
      this.snackBar.open('Refreshed', null, {
        duration: environment.toastDelay,
      });
    }, (err) => {
      this.snackBar.open('Error on refresh', null, {
        duration: environment.toastDelay,
      });
    });
  }
}
