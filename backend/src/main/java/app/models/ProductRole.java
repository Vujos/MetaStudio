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
	private ProjectTeam ProjectTeam;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;

	public ProductRole() {}

	public ProductRole(ProjectTeam ProjectTeam, Long id){
		this.ProjectTeam = ProjectTeam;
		this.id = id;
	}

	public Set<Product> getProducts(){
		return products;
	}

	public void setProducts(Set<Product> products){
		this.products = products;
	}
	
	public ProjectTeam getProjectTeam(){
		return ProjectTeam;
	}

	public void setProjectTeam(ProjectTeam ProjectTeam){
		this.ProjectTeam = ProjectTeam;
	}
	
	public Long getId(){
		return id;
	}

	public void setId(Long id){
		this.id = id;
	}
	
}