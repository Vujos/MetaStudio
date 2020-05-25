import { User } from './user.model';
import { Board } from './board.model';

export class Team {
    id: string;
    name: string;
    description: string;
    background: string;
    members: User[];
    boards: Board[];
    date: Date;
    deleted: boolean;

    constructor(id: string, name: string, description: string, background: string, members: User[], boards: Board[], date: Date, deleted: boolean) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.background = background;
        this.members = members;
        this.boards = boards;
        this.date = date;
        this.deleted = deleted;
    }
}