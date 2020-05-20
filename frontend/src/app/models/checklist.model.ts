import { Task } from './task.model';

export class Checklist {
    id: string;
    title: string;
    date: Date;
    tasks: Task[];
    deleted: boolean;

    constructor(id: string, title: string, date: Date, tasks: Task[], deleted: boolean) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.tasks = tasks;
        this.deleted = deleted;
    }
}