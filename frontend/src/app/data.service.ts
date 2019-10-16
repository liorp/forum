import {Injectable} from '@angular/core';
import {BehaviorSubject, forkJoin, Observable, of} from 'rxjs';
import {Restangular} from 'ngx-restangular';
import {Forum} from './forum';
import {Mador} from './mador';
import {User} from './user';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _users: BehaviorSubject<User[]> = new BehaviorSubject([]);
  private _currentUser: BehaviorSubject<User> = new BehaviorSubject(null);
  private _currentMador: BehaviorSubject<Mador> = new BehaviorSubject(null);
  private _forums: BehaviorSubject<Forum[]> = new BehaviorSubject([]);

  private dataStore: { users: User[], forums: User[], currentUser: User, currentMador: Mador } = {
    users: [], currentUser: null, currentMador: null, forums: []
  };

  public readonly users = this._users.asObservable();
  public readonly currentUser = this._currentUser.asObservable();
  public readonly currentMador = this._currentMador.asObservable();
  public readonly forums = this._forums.asObservable();

  constructor(private restangular: Restangular) {
    this.login();
  }

  login() {
    this.restangular.all('auth').login().subscribe((data) => {
      this.restangular.provider.setDefaultHeaders({Authorization: 'Token ' + data.token});
      this.dataStore.currentUser = data.user;
      this.dataStore.currentMador = data.mador;
      this._currentUser.next(JSON.parse(JSON.stringify(this.dataStore)).currentUser);
      this._currentMador.next(JSON.parse(JSON.stringify(this.dataStore)).currentMador);
      this.refresh();
    });
  }

  refresh() {
    this.getCurrentUser();
    this.getCurrentMador();
    this.getUsers(null, null, null, null, null);
    this.getForums(null, null, null, null, null);
  }

  getCurrentUser() {
    this.restangular.one('user', this._currentUser.getValue().id).get().subscribe((data) => {
      this.dataStore.currentUser = data;
      this._currentUser.next(JSON.parse(JSON.stringify(this.dataStore)).currentUser);
    });
  }

  // TODO: IMPLEMENT WITH madorId, filter, sortDirection, pageIndex, pageSize
  getUsers(madorId, filter, sortDirection, pageIndex, pageSize) {
    const users$ = this.restangular.all('user').getList();
    users$.subscribe((data) => {
      this.dataStore.users = data;
      this._users.next(JSON.parse(JSON.stringify(this.dataStore)).users);
    });
    return users$;
  }

  addForum() {
    return this.restangular.all('forum').customPOST();
  }

  // TODO: IMPLEMENT WITH madorId, filter, sortDirection, pageIndex, pageSize
  getForums(madorId, filter, sortDirection, pageIndex, pageSize) {
    const forums$ = this.restangular.all('forum').getList();
    forums$.subscribe((data) => {
      this.dataStore.forums = data;
      this._forums.next(JSON.parse(JSON.stringify(this.dataStore)).forums);
    });
    return forums$;
  }

  updateForum(forum: Forum) {
    return this.restangular.one('forum', forum.id).customPATCH(
      forum
    );
  }

  calculateForums(month: number, year: number, mador: number) {
    return this.restangular.all('forum').customPOST(
      {
        month,
        year,
        mador
      },
      'calculate'
    );
  }

  removeForum(forum: Forum) {
    return this.restangular.one('forum', forum.id).remove();
  }

  getCurrentMador() {
    this.restangular.one('mador', this._currentUser.getValue().mador.id).get().subscribe((data) => {
      this.dataStore.currentMador = data;
      this._currentMador.next(JSON.parse(JSON.stringify(this.dataStore)).currentMador);
    });
  }

  updateMador(mador: Mador) {
    return this.restangular.one('mador', mador.id).customPATCH(
      mador
    );
  }
}
