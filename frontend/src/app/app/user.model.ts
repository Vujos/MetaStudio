import { Board } from './board.model';

export class User {
    id: string;
    fullName: string;
    username: string;
    email: string;
    password: string;
    date: Date;
    boards: Board[];

    constructor() {
        this.date = new Date();
        this.boards = [];
    }
}