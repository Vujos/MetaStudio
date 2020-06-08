package app.models;

import java.util.Date;

import javax.validation.constraints.NotNull;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "childBoards")
public class ChildBoard {

    @Id
    private String id;

    private String boardId;
    private String title;
    private Date date;

    @NotNull
    private Boolean deleted = false;

    public ChildBoard() {
    }

    public ChildBoard(String id, String boardId, String title, Date date, @NotNull Boolean deleted) {
        this.id = id;
        this.boardId = boardId;
        this.title = title;
        this.date = date;
        this.deleted = deleted;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getBoardId() {
        return boardId;
    }

    public void setBoardId(String boardId) {
        this.boardId = boardId;
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

    public Boolean getDeleted() {
        return deleted;
    }

    public void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }

}