import {Injectable} from '@angular/core';
import {User} from './user';
import {BehaviorSubject} from 'rxjs';
import {Forum} from './forum';
import {Restangular} from 'ngx-restangular';
import {MatTableDataSource} from '@angular/material/table';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl = '';
  private dataStore: { users: User[], currentUser: User } = {users: [], currentUser: null};

  constructor(private restangular: Restangular) {
    restangular.all('users').login().get().subscribe((token) => {
      restangular.provider.setDefaultHeaders({Authorization: 'Token ' + token});
    });
  }

  getUsers(user: User) {
    return this.restangular.all('users').getList();
    const users = [new User(0, 'liorpo', true, 3),
      new User(0, 'anotheruser', false, 3)];
    const _users = new BehaviorSubject<User[]>(users);
    return _users.asObservable();
  }

  getForums(user: User) {
    return this.restangular.all('forums').getList();
    const forums = [new Forum(0, [new User(0, 'liorpo', true, 3)], new Date(Date.now()), 'Best forum ever')];
    const _forums = new BehaviorSubject<Forum[]>(forums);
    return _forums.asObservable();
  }

  getCurrentUser() {
    const currentUser = new User(0, 'liorpo', true, 3);
    const _currentUser = new BehaviorSubject<User>(currentUser);
    return _currentUser.asObservable();
  }
}
