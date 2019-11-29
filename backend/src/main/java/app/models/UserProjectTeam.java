package app.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.CascadeType;
import javax.persistence.ManyToOne;


@Entity
public class UserProjectTeam {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(cascade=CascadeType.ALL)
	private User user;

	@ManyToOne(cascade=CascadeType.ALL)
	private ProjectTeam projectTeam;

	public UserProjectTeam() {}

	public UserProjectTeam(User user, ProjectTeam projectTeam){
		this.user = user;
		this.projectTeam = projectTeam;
	}

	public Long getId(){
		return id;
	}

	public void setId(Long id){
		this.id = id;
	}
	
	public User getUser(){
		return user;
	}

	public void setUser(User user){
		this.user = user;
	}
	
	public ProjectTeam getProjectTeam(){
		return projectTeam;
	}

	public void setProjectTeam(ProjectTeam projectTeam){
		this.projectTeam = projectTeam;
	}
	
}