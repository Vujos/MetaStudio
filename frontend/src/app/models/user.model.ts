import { Board } from './board.model';
import { Team } from './team.model';
import { Activity } from './activity.model';
import { Skill } from './skill.model';

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
    skills: Skill[];
    deleted: boolean;

    constructor() {
        this.date = new Date();
        this.boards = [];
        this.teams = [];
        this.templates = [];
        this.activities = [];
        this.skills = [];
        this.deleted = false;
    }
}