package app.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Column;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonView;
import javax.persistence.OneToMany;
import app.utils.View.ShowUserProjectTeam;


@Entity
public class User {

	@Column(length=128, nullable = false, unique = true)
	private String username;

	@Column(length=128, nullable = false)
	private String password;

	@JsonView(ShowUserProjectTeam.class)
	@OneToMany(mappedBy="user")
	private Set<UserProjectTeam> teams;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;

	public User() {}

	public User(String password, Set<UserProjectTeam> teams, Long id){
		this.password = password;
		this.teams = teams;
		this.id = id;
	}

	public String getUsername(){
		return username;
	}

	public void setUsername(String username){
		this.username = username;
	}
	
	public String getPassword(){
		return password;
	}

	public void setPassword(String password){
		this.password = password;
	}
	
	public Set<UserProjectTeam> getTeams(){
		return teams;
	}

	public void setTeams(Set<UserProjectTeam> teams){
		this.teams = teams;
	}
	
	public Long getId(){
		return id;
	}

	public void setId(Long id){
		this.id = id;
	}
	
}