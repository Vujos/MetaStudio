import { Board } from './board.model';
import { Team } from './team.model';
import { Activity } from './activity.model';

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
    activities: Activity[];
    deleted: boolean;

    constructor() {
        this.date = new Date();
        this.boards = [];
        this.teams = [];
        this.templates = [];
        this.activities = [];
        this.deleted = false;
    }
}