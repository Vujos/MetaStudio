package app.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.CascadeType;
import javax.persistence.ManyToOne;


@Entity
public class TeamRole {

	@ManyToOne(cascade=CascadeType.ALL)
	private User user;

	@ManyToOne(cascade=CascadeType.ALL)
	private ProjectTeam team;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;

	public TeamRole() {}

	public TeamRole(ProjectTeam team, Long id){
		this.team = team;
		this.id = id;
	}

	public User getUser(){
		return user;
	}

	public void setUser(User user){
		this.user = user;
	}
	
	public ProjectTeam getTeam(){
		return team;
	}

	public void setTeam(ProjectTeam team){
		this.team = team;
	}
	
	public Long getId(){
		return id;
	}

	public void setId(Long id){
		this.id = id;
	}
	
}