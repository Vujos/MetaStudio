export class Task {
    id: string;
    title: string;
    done: boolean;
    date: Date;
    doneDate: Date;
    deleted: boolean;

    constructor(id: string, title: string, done: boolean, date: Date, doneDate: Date, deleted: boolean) {
        this.id = id;
        this.title = title;
        this.done = done;
        this.date = date;
        this.doneDate = doneDate;
        this.deleted = deleted;
    }
}