package app.models;

import java.util.ArrayList;
import java.util.Date;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import app.utils.CustomUsersSerializer;

@Document(collection = "teams")
public class Team {

    @Id
    private String id;

    private String name;
    private String description;
    private String background;

    @DBRef(lazy = true)
    @JsonSerialize(using = CustomUsersSerializer.class)
    private ArrayList<User> members;

    @DBRef(lazy = true)
    private ArrayList<Board> boards;

    private Date date;

    @NotNull
    private Boolean deleted = false;

    public Team() {
    }

    public Team(String id, String name, String description, String background, ArrayList<User> members,
            ArrayList<Board> boards, Date date, @NotNull Boolean deleted) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.background = background;
        this.members = members;
        this.boards = boards;
        this.date = date;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getBackground() {
        return background;
    }

    public void setBackground(String background) {
        this.background = background;
    }

    public ArrayList<User> getMembers() {
        return members;
    }

    public void setMembers(ArrayList<User> members) {
        this.members = members;
    }

    public ArrayList<Board> getBoards() {
        return boards;
    }

    public void setBoards(ArrayList<Board> boards) {
        this.boards = boards;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Boolean getDeleted() {
        return deleted;
    }

    public void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }

}