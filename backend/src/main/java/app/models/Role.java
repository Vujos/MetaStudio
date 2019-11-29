package app.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.util.Set;
import javax.persistence.OneToMany;
import com.fasterxml.jackson.annotation.JsonView;
import app.utils.View.ShowPermission;


@Entity
public class Role {

	@JsonView(ShowPermission.class)
	@OneToMany(mappedBy="role")
	private Set<Permission> permissions;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;

	public Role() {}

	public Role(Long id){
		this.id = id;
	}

	public Set<Permission> getPermissions(){
		return permissions;
	}

	public void setPermissions(Set<Permission> permissions){
		this.permissions = permissions;
	}
	
	public Long getId(){
		return id;
	}

	public void setId(Long id){
		this.id = id;
	}
	
}