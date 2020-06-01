export class Activity {
    id: string;
    performerId: string;
    performerFullName: string
    action: string;
    objectLink: string
    objectName: string;
    location: string;
    locationObjectLink: string;
    locationObjectName: string;
    date: Date;
    boardId: string;
    boardName: string
    deleted: boolean;

    constructor(id: string, performerId: string, performerFullName: string, action: string, objectLink: string, objectName: string, boardId: string = null, boardName: string = null, date: Date = new Date(), location: string = null, locationObjectLink: string = null, locationObjectName: string = null, deleted: boolean = false) {
        this.id = id;
        this.performerId = performerId;
        this.performerFullName = performerFullName;
        this.action = action;
        this.objectLink = objectLink;
        this.objectName = objectName;
        this.location = location;
        this.locationObjectLink = locationObjectLink;
        this.locationObjectName = locationObjectName;
        this.date = date;
        this.boardId = boardId;
        this.boardName = boardName;
        this.deleted = deleted;
    }
}