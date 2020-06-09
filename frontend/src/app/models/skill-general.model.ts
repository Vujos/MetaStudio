export class SkillGeneral {
    id: string;
    name: string;
    deleted: boolean;

    constructor(id: string, name: string, deleted: boolean) {
        this.id = id;
        this.name = name;
        this.deleted = deleted;
    }
}