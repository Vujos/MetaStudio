package app.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.CascadeType;
import javax.persistence.ManyToOne;


@Entity
public class ProjectTeamProject {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(cascade=CascadeType.ALL)
	private Project project;

	@ManyToOne(cascade=CascadeType.ALL)
	private ProjectTeam projectTeam;

	public ProjectTeamProject() {}

	public ProjectTeamProject(Project project, ProjectTeam projectTeam){
		this.project = project;
		this.projectTeam = projectTeam;
	}

	public Long getId(){
		return id;
	}

	public void setId(Long id){
		this.id = id;
	}
	
	public Project getProject(){
		return project;
	}

	public void setProject(Project project){
		this.project = project;
	}
	
	public ProjectTeam getProjectTeam(){
		return projectTeam;
	}

	public void setProjectTeam(ProjectTeam projectTeam){
		this.projectTeam = projectTeam;
	}
	
}