export class ParentBoard {
    id: string;
    boardId: string;
    title: string;
    date: Date;
    deleted: boolean;

    constructor(id: string, boardId: string, title: string, date: Date, deleted: boolean) {
        this.id = id;
        this.boardId = boardId;
        this.title = title;
        this.date = date;
        this.deleted = deleted;
    }
}