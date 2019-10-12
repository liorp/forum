import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Restangular} from 'ngx-restangular';
import {Forum} from './forum';
import {Mador} from './mador';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  currentUser = null;

  constructor(private restangular: Restangular) {
    this.login();
  }

  login() {
    const login = this.restangular.all('auth').login();
    login.subscribe((user) => {
      this.currentUser = user;
      this.restangular.provider.setDefaultHeaders({Authorization: 'Token ' + user.token});
    });
    return login;
  }

  getUsers() {
    return this.restangular.all('user').getList();
  }

  addForum() {
    return this.restangular.all('forum').customPOST(
    );
  }

  getForums() {
    return this.restangular.all('forum').getList();
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

  updateMador(mador: Mador) {
    return this.restangular.one('mador', mador.id).customPATCH(
      mador
    );
  }
}
