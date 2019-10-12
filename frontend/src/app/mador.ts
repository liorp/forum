import {User} from './user';

export class Mador {
    id: number;
    forum_day: number;
    name: string;
    forum_frequency: number;
    number_of_organizers: number;
    admin: User;
    total_budget: number;
    default_budget_per_forum: number;
    auto_track_forum_budget: boolean;

    constructor(id: number, forum_day: number, name: string,
                forum_frequency: number, number_of_organizers: number,
                admin: User, total_budget: number, default_budget_per_forum: number, auto_track_forum_budget: boolean) {
        this.id = id;
        this.forum_day = forum_day;
        this.name = name;
        this.forum_frequency = forum_frequency;
        this.number_of_organizers = number_of_organizers;
        this.admin = admin;
        this.total_budget = total_budget;
        this.default_budget_per_forum = default_budget_per_forum;
        this.auto_track_forum_budget = auto_track_forum_budget;
    }
}
