import { List } from './list.model';

export class Board {
    id: string;
    title: string;
    date: Date;
    description: string;
    background: string;
    users: [];
    lists: List[];
    priority: number;

    constructor(id: string, title: string, date: Date, description: string, background: string, users: [], lists: List[], priority: number) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.description = description;
        this.background = background;
        this.users = users;
        this.lists = lists;
        this.priority = priority;
    }
}