import {User} from './user';

export class Forum {
  users: User[];
  date: Date;
  notes: string;

  constructor(users: User[], date: Date, notes: string) {
    this.users = users;
    this.date = date;
    this.notes = notes;
  }
}
