package app.project_manager.models;

import java.util.ArrayList;
import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "boards")
public class Board {

    @Id
    private String id;

    private String title;
    private Date date;
    private String description;
    private String background;

    private ArrayList<String> users;

    @DBRef
    private ArrayList<List> lists;
    
    private Integer priority;

    public Board() {
    }

    public Board(String id, String title, Date date, String description, String background, ArrayList<String> users,
    ArrayList<List> lists, Integer priority) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.description = description;
        this.background = background;
        this.users = users;
        this.lists = lists;
        this.priority = priority;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
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

    public ArrayList<String> getUsers() {
        return users;
    }

    public void setUsers(ArrayList<String> users) {
        this.users = users;
    }

    public ArrayList<List> getLists() {
        return lists;
    }

    public void setLists(ArrayList<List> lists) {
        this.lists = lists;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

}