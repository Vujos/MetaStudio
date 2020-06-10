package app.models;

import java.util.ArrayList;
import java.util.Date;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import app.utils.CustomUsersSerializer;

@Document(collection = "cards")
public class Card {

    @Id
    private String id;

    private String title;
    private Date date;
    private String description;

    @DBRef(lazy = true)
    @JsonSerialize(using = CustomUsersSerializer.class)
    private ArrayList<User> members;

    private Date startDate;
    private Date endDate;

    private ArrayList<String> attachments;

    private ArrayList<String> labels;

    @DBRef
    private ArrayList<Checklist> checklists;

    private Boolean done;
    private Date doneDate;

    @DBRef
    private ArrayList<Activity> activities;

    @DBRef
    private ArrayList<Skill> skills;

    @NotNull
    private Boolean deleted = false;

    public Card() {
    }

    public Card(String id, String title, Date date, String description, ArrayList<User> members, Date startDate,
            Date endDate, ArrayList<String> attachments, ArrayList<String> labels, ArrayList<Checklist> checklists,
            Boolean done, Date doneDate, ArrayList<Activity> activities, ArrayList<Skill> skills,
            @NotNull Boolean deleted) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.description = description;
        this.members = members;
        this.startDate = startDate;
        this.endDate = endDate;
        this.attachments = attachments;
        this.labels = labels;
        this.checklists = checklists;
        this.done = done;
        this.doneDate = doneDate;
        this.activities = activities;
        this.skills = skills;
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

    public ArrayList<User> getMembers() {
        return members;
    }

    public void setMembers(ArrayList<User> members) {
        this.members = members;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public ArrayList<String> getAttachments() {
        return attachments;
    }

    public void setAttachments(ArrayList<String> attachments) {
        this.attachments = attachments;
    }

    public ArrayList<String> getLabels() {
        return labels;
    }

    public void setLabels(ArrayList<String> labels) {
        this.labels = labels;
    }

    public ArrayList<Checklist> getChecklists() {
        return checklists;
    }

    public void setChecklists(ArrayList<Checklist> checklists) {
        this.checklists = checklists;
    }

    public Boolean getDone() {
        return done;
    }

    public void setDone(Boolean done) {
        this.done = done;
    }

    public Date getDoneDate() {
        return doneDate;
    }

    public void setDoneDate(Date doneDate) {
        this.doneDate = doneDate;
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

    public Boolean getDeleted() {
        return deleted;
    }

    public void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }

}