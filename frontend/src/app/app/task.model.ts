export class Task {
    id: string;
    title: string;
    done: boolean;
    date: Date;

    constructor(id: string, title: string, done: boolean, date: Date, ) {
        this.id = id;
        this.title = title;
        this.done = done;
        this.date = date;
    }
}