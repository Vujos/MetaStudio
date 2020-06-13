import { Board } from './board.model';
import { Team } from './team.model';
import { Activity } from './activity.model';
import { Skill } from './skill.model';
import { Role } from './role.model';

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
    roles: Role[];
    deleted: boolean;

    constructor() {
        this.date = new Date();
        this.boards = [];
        this.teams = [];
        this.templates = [];
        this.activities = [];
        this.skills = [];
        this.roles = [];
        this.deleted = false;
    }
}