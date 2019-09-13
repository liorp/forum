import {User} from './user';

export class Forum {
  id: number;
  users: User[];
  date: Date;
  notes: string;

  constructor(id: number, users: User[], date: Date, notes: string) {
    this.id = id;
    this.users = users;
    this.date = date;
    this.notes = notes;
  }
}
