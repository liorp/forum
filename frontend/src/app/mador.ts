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

    constructor() {
    }
}
