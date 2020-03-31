import { Task } from './task.model';

export class Card {
    id: string;
    title: string;
    date: Date;
    description: string;
    members: [];
    startDate: Date;
    endDate: Date;
    attachments: [];
    labels: string[];
    checklist: Task[];

    constructor(id: string, title: string, date: Date, description: string, members: [], startDate: Date, endDate: Date, attachments: [], labels: string[], checklist: Task[]) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.description = description;
        this.members = members;
        this.startDate = startDate;
        this.endDate = endDate;
        this.attachments = attachments;
        this.labels = labels;
        this.checklist = checklist;
    }
}