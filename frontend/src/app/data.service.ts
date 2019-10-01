import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Restangular} from 'ngx-restangular';
import {Forum} from './forum';
import {Mador} from './mador';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private currentUser = null;

  constructor(private restangular: Restangular) {
    restangular.all('user').login().get().subscribe((user) => {
      this.currentUser = user;
      restangular.provider.setDefaultHeaders({Authorization: 'Token ' + user.token});
    });
  }

  getUsers() {
    return this.restangular.all('user').getList();
  }

  getForums() {
    return this.restangular.all('forum').getList();
  }

  getCurrentUser() {
    const currentUser = new BehaviorSubject<any>(this.currentUser);
    return currentUser.asObservable();
  }

  updateForum(forum: Forum) {
    return this.restangular.one('forum', forum.id).post(forum);
  }

  updateMador(mador: Mador) {
    return this.restangular.one('mador', mador.id).post(mador);
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
}
