import { Card } from './card.model';

export class List {
    id: string;
    title: string;
    cards: Card[];
    priority: number;
    date: Date;

    constructor(id: string, title: string, cards: Card[], priority: number, date: Date) {
        this.id = id;
        this.title = title;
        this.cards = cards;
        this.priority = priority;
        this.date = date;
    }
}