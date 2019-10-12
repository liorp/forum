import {User} from './user';

export class Mador {
    id: number;
    forum_day: number;
    name: string;
    forum_frequency: number;
    number_of_organizers: number;
    admin: User;
    budget: number;

    constructor(id: number, forum_day: number, name: string,
                forum_frequency: number, number_of_organizers: number,
                admin: User, budget: number) {
        this.id = id;
        this.forum_day = forum_day;
        this.name = name;
        this.forum_frequency = forum_frequency;
        this.number_of_organizers = number_of_organizers;
        this.admin = admin;
        this.budget = budget;
    }
}
