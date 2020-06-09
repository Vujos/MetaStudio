package app.models;

import javax.validation.constraints.NotNull;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "skillsGeneral")
public class SkillGeneral {

    @Id
    private String id;

    private String name;

    @NotNull
    private Boolean deleted = false;

    public SkillGeneral() {
    }

    public SkillGeneral(String id, String name, @NotNull Boolean deleted) {
        this.id = id;
        this.name = name;
        this.deleted = deleted;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getDeleted() {
        return deleted;
    }

    public void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }

}