package app.project_manager.models;

import java.util.ArrayList;
import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "checklists")
public class Checklist {

    @Id
    private String id;

    private String title;
    private Date date;

    @DBRef
    private ArrayList<Task> tasks;

    public Checklist() {
    }

    public Checklist(String id, String title, Date date, ArrayList<Task> tasks) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.tasks = tasks;
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

    public ArrayList<Task> getTasks() {
        return tasks;
    }

    public void setTasks(ArrayList<Task> tasks) {
        this.tasks = tasks;
    }

}