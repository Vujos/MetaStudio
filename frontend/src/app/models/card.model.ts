import { Checklist } from './checklist.model';
import { User } from './user.model';

export class Card {
    id: string;
    title: string;
    date: Date;
    description: string;
    members: User[];
    startDate: Date;
    endDate: Date;
    attachments: [];
    labels: string[];
    checklists: Checklist[];
    deleted: boolean;

    constructor(id: string, title: string, date: Date, description: string, members: User[], startDate: Date, endDate: Date, attachments: [], labels: string[], checklists: Checklist[], deleted: boolean) {
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
        this.deleted = deleted;
    }
}