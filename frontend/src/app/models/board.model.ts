import { List } from './list.model';
import { User } from './user.model';
import { Team } from './team.model';

export class Board {
    id: string;
    title: string;
    date: Date;
    description: string;
    background: string;
    users: User[];
    teams: Team[];
    lists: List[];
    priority: number;
    deleted: boolean;

    constructor(id: string, title: string, date: Date, description: string, background: string, users: User[], teams: Team[], lists: List[], priority: number, deleted: boolean) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.description = description;
        this.background = background;
        this.users = users;
        this.teams = teams;
        this.lists = lists;
        this.priority = priority;
        this.deleted = deleted;
    }
}