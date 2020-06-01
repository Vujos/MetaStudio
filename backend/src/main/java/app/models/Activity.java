package app.models;

import java.util.Date;

import javax.validation.constraints.NotNull;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "activities")
public class Activity {

    @Id
    private String id;

    private String performer;
    private String performerId;
    private String performerFullName;
    private String action;
    private String objectLink;
    private String objectName;
    private String location;
    private String locationObjectLink;
    private String locationObjectName;
    private Date date;
    private String boardId;
    private String boardName;

    @NotNull
    private Boolean deleted = false;

    public Activity() {
    }

    public Activity(String id, String performer, String performerId, String performerFullName, String action,
            String objectLink, String objectName, String location, String locationObjectLink, String locationObjectName,
            Date date, String boardId, String boardName, @NotNull Boolean deleted) {
        this.id = id;
        this.performer = performer;
        this.performerId = performerId;
        this.performerFullName = performerFullName;
        this.action = action;
        this.objectLink = objectLink;
        this.objectName = objectName;
        this.location = location;
        this.locationObjectLink = locationObjectLink;
        this.locationObjectName = locationObjectName;
        this.date = date;
        this.boardId = boardId;
        this.boardName = boardName;
        this.deleted = deleted;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPerformer() {
        return performer;
    }

    public void setPerformer(String performer) {
        this.performer = performer;
    }

    public String getPerformerId() {
        return performerId;
    }

    public void setPerformerId(String performerId) {
        this.performerId = performerId;
    }

    public String getPerformerFullName() {
        return performerFullName;
    }

    public void setPerformerFullName(String performerFullName) {
        this.performerFullName = performerFullName;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getObjectLink() {
        return objectLink;
    }

    public void setObjectLink(String objectLink) {
        this.objectLink = objectLink;
    }

    public String getObjectName() {
        return objectName;
    }

    public void setObjectName(String objectName) {
        this.objectName = objectName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getLocationObjectLink() {
        return locationObjectLink;
    }

    public void setLocationObjectLink(String locationObjectLink) {
        this.locationObjectLink = locationObjectLink;
    }

    public String getLocationObjectName() {
        return locationObjectName;
    }

    public void setLocationObjectName(String locationObjectName) {
        this.locationObjectName = locationObjectName;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getBoardId() {
        return boardId;
    }

    public void setBoardId(String boardId) {
        this.boardId = boardId;
    }

    public String getBoardName() {
        return boardName;
    }

    public void setBoardName(String boardName) {
        this.boardName = boardName;
    }

    public Boolean getDeleted() {
        return deleted;
    }

    public void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }

}