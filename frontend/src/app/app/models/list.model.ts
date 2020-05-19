import { Card } from './card.model';

export class List {
    id: string;
    title: string;
    cards: Card[];
    priority: number;
    date: Date;
    deleted: boolean;

    constructor(id: string, title: string, cards: Card[], priority: number, date: Date, deleted: boolean) {
        this.id = id;
        this.title = title;
        this.cards = cards;
        this.priority = priority;
        this.date = date;
        this.deleted = deleted;
    }
}