package app.models;

import javax.validation.constraints.NotNull;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "skills")
public class Skill {

    @Id
    private String id;

    @DBRef
    private SkillGeneral name;
    
    private Integer level;

    @NotNull
    private Boolean deleted = false;

    public Skill() {
    }

    public Skill(String id, SkillGeneral name, Integer level, @NotNull Boolean deleted) {
        this.id = id;
        this.name = name;
        this.level = level;
        this.deleted = deleted;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public SkillGeneral getName() {
        return name;
    }

    public void setName(SkillGeneral name) {
        this.name = name;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public Boolean getDeleted() {
        return deleted;
    }

    public void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }

}