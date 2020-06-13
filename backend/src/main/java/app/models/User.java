package app.models;

import java.util.ArrayList;
import java.util.Date;

import javax.validation.constraints.NotNull;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String fullName;
    private String username;
    private String email;
    private String password;
    private Date date;

    @DBRef(lazy = true)
    private ArrayList<Board> boards;

    @DBRef(lazy = true)
    private ArrayList<Team> teams;

    @DBRef(lazy = true)
    private ArrayList<Board> templates;

    @DBRef(lazy = true)
    private ArrayList<Activity> activities;

    @DBRef
    private ArrayList<Skill> skills;

    @DBRef
    private ArrayList<Role> roles;

    @NotNull
    private Boolean deleted = false;

    public User() {
    }

    public User(String id, String fullName, String username, String email, String password, Date date,
            ArrayList<Board> boards, ArrayList<Team> teams, ArrayList<Board> templates, ArrayList<Activity> activities,
            ArrayList<Skill> skills, ArrayList<Role> roles, @NotNull Boolean deleted) {
        this.id = id;
        this.fullName = fullName;
        this.username = username;
        this.email = email;
        this.password = password;
        this.date = date;
        this.boards = boards;
        this.teams = teams;
        this.templates = templates;
        this.activities = activities;
        this.skills = skills;
        this.roles = roles;
        this.deleted = deleted;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public ArrayList<Board> getBoards() {
        return boards;
    }

    public void setBoards(ArrayList<Board> boards) {
        this.boards = boards;
    }

    public ArrayList<Team> getTeams() {
        return teams;
    }

    public void setTeams(ArrayList<Team> teams) {
        this.teams = teams;
    }

    public ArrayList<Board> getTemplates() {
        return templates;
    }

    public void setTemplates(ArrayList<Board> templates) {
        this.templates = templates;
    }

    public ArrayList<Activity> getActivities() {
        return activities;
    }

    public void setActivities(ArrayList<Activity> activities) {
        this.activities = activities;
    }

    public ArrayList<Skill> getSkills() {
        return skills;
    }

    public void setSkills(ArrayList<Skill> skills) {
        this.skills = skills;
    }

    public ArrayList<Role> getRoles() {
        return roles;
    }

    public void setRoles(ArrayList<Role> roles) {
        this.roles = roles;
    }

    public Boolean getDeleted() {
        return deleted;
    }

    public void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }

}