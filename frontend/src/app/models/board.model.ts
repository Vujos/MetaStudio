import { List } from './list.model';
import { User } from './user.model';
import { Team } from './team.model';
import { Activity } from './activity.model';
import { ParentBoard } from './parent-board.model';
import { ChildBoard } from './child-board.model';

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
    activities: Activity[];
    parentBoard: ParentBoard;
    childBoards: ChildBoard[];
    deleted: boolean;

    constructor(id: string, title: string, date: Date, description: string, background: string, users: User[], teams: Team[], lists: List[], priority: number, activities: Activity[], parentBoard: ParentBoard, childBoards: ChildBoard[], deleted: boolean) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.description = description;
        this.background = background;
        this.users = users;
        this.teams = teams;
        this.lists = lists;
        this.priority = priority;
        this.activities = activities;
        this.parentBoard = parentBoard;
        this.childBoards = childBoards;
        this.deleted = deleted;
    }
}