import { Checklist } from './checklist.model';

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
    checklists: Checklist[];

    constructor(id: string, title: string, date: Date, description: string, members: [], startDate: Date, endDate: Date, attachments: [], labels: string[], checklists: Checklist[]) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.description = description;
        this.members = members;
        this.startDate = startDate;
        this.endDate = endDate;
        this.attachments = attachments;
        this.labels = labels;
        this.checklists = checklists;
    }
}