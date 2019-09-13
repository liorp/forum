import {Injectable} from '@angular/core';
import {User} from './user';
import {BehaviorSubject} from 'rxjs';
import {Forum} from './forum';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _users = new BehaviorSubject<User[]>([]);
  private _forums = new BehaviorSubject<Forum[]>([]);
  private _currentUser = new BehaviorSubject<User>(null);
  private baseUrl = '';
  private dataStore: { users: User[], currentUser: User } = {users: [], currentUser: null};
  readonly users = this._users.asObservable();
  readonly forums = this._forums.asObservable();
  readonly currentUser = this._currentUser.asObservable();

  getUsers(user: User) {
    const users = [new User(0, 'liorpo', true, 3),
      new User(0, 'anotheruser', false, 3)];
    const _users = new BehaviorSubject<User[]>(users);
    return _users.asObservable();
  }

  getForums(user: User) {
    const forums = [new Forum(0, [new User(0, 'liorpo', true, 3)], new Date(Date.now()), 'Best forum ever')];
    const _forums = new BehaviorSubject<Forum[]>(forums);
    return _forums.asObservable();
  }

  getCurrentUser() {
    const currentUser = new User(0, 'liorpo', true, 3);
    const _currentUser = new BehaviorSubject<User>(currentUser);
    return _currentUser.asObservable();
  }

  getNumberOfOrganizers() {
    const _numberOfOrganizers = new BehaviorSubject<number>(2);
    return _numberOfOrganizers.asObservable();
  }

  getFrequency() {
    const _frequency = new BehaviorSubject<number>(1);
    return _frequency.asObservable();
  }

  constructor() {
  }
}
