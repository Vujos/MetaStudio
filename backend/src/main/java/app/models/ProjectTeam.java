package app.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import app.utils.View.ShowTeamRole;
import app.utils.View.ShowProductRole;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonView;
import app.utils.View.ShowProjectTeam;
import javax.persistence.OneToMany;
import app.utils.View.ShowUserProjectTeam;
import app.utils.View.ShowProjectTeamProject;


@Entity
public class ProjectTeam {

	@JsonView(ShowProductRole.class)
	@OneToMany(mappedBy="projectTeam")
	private Set<ProductRole> productRoles;

	@JsonView(ShowTeamRole.class)
	@OneToMany(mappedBy="team")
	private Set<TeamRole> teamRoles;

	@JsonView(ShowProjectTeam.class)
	@OneToMany(mappedBy="subTeams")
	private Set<ProjectTeam> subTeams;

	@JsonView(ShowUserProjectTeam.class)
	@OneToMany(mappedBy="projectTeam")
	private Set<UserProjectTeam> users;

	@JsonView(ShowProjectTeamProject.class)
	@OneToMany(mappedBy="projectTeam")
	private Set<ProjectTeamProject> projects;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;

	public ProjectTeam() {}

	public ProjectTeam(Set<TeamRole> teamRoles, Set<ProjectTeam> subTeams, Set<UserProjectTeam> users, Set<ProjectTeamProject> projects, Long id){
		this.teamRoles = teamRoles;
		this.subTeams = subTeams;
		this.users = users;
		this.projects = projects;
		this.id = id;
	}

	public Set<ProductRole> getProductRoles(){
		return productRoles;
	}

	public void setProductRoles(Set<ProductRole> productRoles){
		this.productRoles = productRoles;
	}
	
	public Set<TeamRole> getTeamRoles(){
		return teamRoles;
	}

	public void setTeamRoles(Set<TeamRole> teamRoles){
		this.teamRoles = teamRoles;
	}
	
	public Set<ProjectTeam> getSubTeams(){
		return subTeams;
	}

	public void setSubTeams(Set<ProjectTeam> subTeams){
		this.subTeams = subTeams;
	}
	
	public Set<UserProjectTeam> getUsers(){
		return users;
	}

	public void setUsers(Set<UserProjectTeam> users){
		this.users = users;
	}
	
	public Set<ProjectTeamProject> getProjects(){
		return projects;
	}

	public void setProjects(Set<ProjectTeamProject> projects){
		this.projects = projects;
	}
	
	public Long getId(){
		return id;
	}

	public void setId(Long id){
		this.id = id;
	}
	
}