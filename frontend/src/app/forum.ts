import {User} from './user';

export class Forum {
  id: number;
  users: User[];
  date: Date;
  notes: string;
  budget: number;

  constructor(id: number, users: User[], date: Date, notes: string, budget: number) {
    this.id = id;
    this.users = users;
    this.date = date;
    this.notes = notes;
    this.budget = budget;
  }
}
