import {Component} from '@angular/core';
import {ApiService} from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  apiService = null;
  title = 'forums';
  result = null;
  dayOfForum = null;
  days = [
    {
      name: 'Sunday',
      value: 0
    }, {
      name: 'Monday',
      value: 1
    }, {
      name: 'Tuesday',
      value: 2
    }, {
      name: 'Wednesday',
      value: 3
    }, {
      name: 'Thursday',
      value: 4
    }
  ];
  forums = [];
  users = [];
  forumsTableColumnsToDisplay = ['day', 'username', 'notes'];
  usersTableColumnsToDisplay = ['day', 'username', 'notes'];

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  getResult() {
    this.result = '1';
    const now = new Date(Date.now());
    const month = now.getMonth();
    const year = now.getFullYear();
    const daysOfForum = this.getDaysOfForumInMonth(this.dayOfForum, month, year);
  }

  getDaysOfForumInMonth(dayOfForum, month, year) {
    const date = new Date(Date.UTC(year, month, 1));
    const days = [];
    while (date.getMonth() === month) {
      if (date.getDay() === dayOfForum) {
        days.push(new Date(date));
      }
      date.setDate(date.getDate() + 1);
    }
    return days;
  }
}
