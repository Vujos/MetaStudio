package app.models;

import java.util.ArrayList;
import java.util.Date;

import javax.validation.constraints.NotNull;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "lists")
public class List {

    @Id
    private String id;

    private String title;

    @DBRef
    private ArrayList<Card> cards;

    private Integer priority;
    private Date date;

    @NotNull
	private Boolean deleted = false;

    public List() {
    }

    public List(String id, String title, ArrayList<Card> cards, Integer priority, Date date, @NotNull Boolean deleted) {
        this.id = id;
        this.title = title;
        this.cards = cards;
        this.priority = priority;
        this.date = date;
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

    public ArrayList<Card> getCards() {
        return cards;
    }

    public void setCards(ArrayList<Card> cards) {
        this.cards = cards;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
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