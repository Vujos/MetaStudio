package app.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import app.utils.View.ShowProduct;
import javax.persistence.CascadeType;
import javax.persistence.ManyToOne;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonView;
import javax.persistence.OneToMany;


@Entity
public class ProductRole {

	@JsonView(ShowProduct.class)
	@OneToMany(mappedBy="ProductRole")
	private Set<Product> products;

	@ManyToOne(cascade=CascadeType.ALL)
	private ProjectTeam projectTeam;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;

	public ProductRole() {}

	public ProductRole(ProjectTeam projectTeam, Long id){
		this.projectTeam = projectTeam;
		this.id = id;
	}

	public Set<Product> getProducts(){
		return products;
	}

	public void setProducts(Set<Product> products){
		this.products = products;
	}
	
	public ProjectTeam getProjectTeam(){
		return projectTeam;
	}

	public void setProjectTeam(ProjectTeam projectTeam){
		this.projectTeam = projectTeam;
	}
	
	public Long getId(){
		return id;
	}

	public void setId(Long id){
		this.id = id;
	}
	
}