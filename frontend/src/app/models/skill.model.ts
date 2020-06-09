import { SkillGeneral } from './skill-general.model';

export class Skill {
    id: string;
    name: SkillGeneral;
    level: number;
    deleted: boolean;

    constructor(id: string, name: SkillGeneral, level: number, deleted: boolean) {
        this.id = id;
        this.name = name;
        this.level = level;
        this.deleted = deleted;
    }
}