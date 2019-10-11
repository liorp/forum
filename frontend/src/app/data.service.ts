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

  getForums() {
    return this.restangular.all('forum').getList();
  }

  updateForum(forum: Forum) {
    return this.restangular.one('forum', forum.id).customPATCH((
      this.pick(
        forum,
        ['date', 'notes']
      )
    ));
  }

  removeForum(forum: Forum) {
    return this.restangular.one('forum', forum.id).remove();
  }

  updateMador(mador: Mador) {
    return this.restangular.one('mador', mador.id).customPATCH(
      this.pick(
        mador,
        ['forum_day', 'forum_frequency', 'name', 'number_of_organizers']
      )
    );
  }

  calculateForums(month: number, year: number, mador: number) {
    return this.restangular.all('forum').post(
      {
        month,
        year,
        mador
      }
    );
  }

  pick(object, keys) {
    return keys.reduce((obj, key) => {
      if (object && object.hasOwnProperty(key)) {
        obj[key] = object[key];
      }
      return obj;
    }, {});
  }
}
