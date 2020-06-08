package app.models;

import java.util.ArrayList;
import java.util.Date;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import app.utils.CustomTeamsSerializer;
import app.utils.CustomUsersSerializer;

@Document(collection = "boards")
public class Board {

    @Id
    private String id;

    private String title;
    private Date date;
    private String description;
    private String background;

    @DBRef(lazy = true)
    @JsonSerialize(using = CustomUsersSerializer.class)
    private ArrayList<User> users;

    @DBRef(lazy = true)
    @JsonSerialize(using = CustomTeamsSerializer.class)
    private ArrayList<Team> teams;

    @DBRef
    private ArrayList<List> lists;

    private Integer priority;

    @DBRef
    private ArrayList<Activity> activities;

    private ParentBoard parentBoard;

    @DBRef
    private ArrayList<ChildBoard> childBoards;

    @NotNull
    private Boolean deleted = false;

    public Board() {
    }

    public Board(String id, String title, Date date, String description, String background, ArrayList<User> users,
            ArrayList<Team> teams, ArrayList<List> lists, Integer priority, ArrayList<Activity> activities,
            ParentBoard parentBoard, ArrayList<ChildBoard> childBoards, @NotNull Boolean deleted) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.description = description;
        this.background = background;
        this.users = users;
        this.teams = teams;
        this.lists = lists;
        this.priority = priority;
        this.activities = activities;
        this.parentBoard = parentBoard;
        this.childBoards = childBoards;
        this.deleted = deleted;
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

    public ArrayList<User> getUsers() {
        return users;
    }

    public void setUsers(ArrayList<User> users) {
        this.users = users;
    }

    public ArrayList<Team> getTeams() {
        return teams;
    }

    public void setTeams(ArrayList<Team> teams) {
        this.teams = teams;
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

    public ArrayList<Activity> getActivities() {
        return activities;
    }

    public void setActivities(ArrayList<Activity> activities) {
        this.activities = activities;
    }

    public ParentBoard getParentBoard() {
        return parentBoard;
    }

    public void setParentBoard(ParentBoard parentBoard) {
        this.parentBoard = parentBoard;
    }

    public ArrayList<ChildBoard> getChildBoards() {
        return childBoards;
    }

    public void setChildBoards(ArrayList<ChildBoard> childBoards) {
        this.childBoards = childBoards;
    }

    public Boolean getDeleted() {
        return deleted;
    }

    public void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }

}