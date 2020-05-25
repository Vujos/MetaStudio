import { Board } from './board.model';
import { Team } from './team.model';

export class User {
    id: string;
    fullName: string;
    username: string;
    email: string;
    password: string;
    date: Date;
    boards: Board[];
    teams: Team[];
    templates: Board[];
    deleted: boolean;

    constructor() {
        this.date = new Date();
        this.boards = [];
        this.teams = [];
        this.templates = [];
        this.deleted = false;
    }
}