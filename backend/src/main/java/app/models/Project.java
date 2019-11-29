package app.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Column;
import app.utils.View.ShowProject;
import javax.persistence.CascadeType;
import javax.persistence.ManyToOne;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonView;
import javax.persistence.OneToMany;
import app.utils.View.ShowProjectTeamProject;


@Entity
public class Project {

	@Column(length=128, nullable = false)
	private String name;

	@JsonView(ShowProjectTeamProject.class)
	@OneToMany(mappedBy="project")
	private Set<ProjectTeamProject> projectTeams;

	@JsonView(ShowProject.class)
	@OneToMany(mappedBy="subProjects")
	private Set<Project> subProjects;

	@ManyToOne(cascade=CascadeType.ALL)
	private SDLC SDLC;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;

	public Project() {}

	public Project(Set<ProjectTeamProject> projectTeams, Set<Project> subProjects, SDLC SDLC, Long id){
		this.projectTeams = projectTeams;
		this.subProjects = subProjects;
		this.SDLC = SDLC;
		this.id = id;
	}

	public String getName(){
		return name;
	}

	public void setName(String name){
		this.name = name;
	}
	
	public Set<ProjectTeamProject> getProjectTeams(){
		return projectTeams;
	}

	public void setProjectTeams(Set<ProjectTeamProject> projectTeams){
		this.projectTeams = projectTeams;
	}
	
	public Set<Project> getSubProjects(){
		return subProjects;
	}

	public void setSubProjects(Set<Project> subProjects){
		this.subProjects = subProjects;
	}
	
	public SDLC getSDLC(){
		return SDLC;
	}

	public void setSDLC(SDLC SDLC){
		this.SDLC = SDLC;
	}
	
	public Long getId(){
		return id;
	}

	public void setId(Long id){
		this.id = id;
	}
	
}