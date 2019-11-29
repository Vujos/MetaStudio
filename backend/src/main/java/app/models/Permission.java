package app.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.CascadeType;
import javax.persistence.ManyToOne;


@Entity
public class Permission {

	@ManyToOne(cascade=CascadeType.ALL)
	private Role role;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;

	public Permission() {}

	public Permission(Long id){
		this.id = id;
	}

	public Role getRole(){
		return role;
	}

	public void setRole(Role role){
		this.role = role;
	}
	
	public Long getId(){
		return id;
	}

	public void setId(Long id){
		this.id = id;
	}
	
}