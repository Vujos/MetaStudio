import { Task } from './task.model';

export class Checklist {
    id: string;
    title: string;
    date: Date;
    tasks: Task[];

    constructor(id: string, title: string, date: Date, tasks: Task[]) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.tasks = tasks;
    }
}