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
public class Product {

	@JsonView(ShowProduct.class)
	@OneToMany(mappedBy="subProducts")
	private Set<Product> subProducts;

	@ManyToOne(cascade=CascadeType.ALL)
	private Process process;

	@ManyToOne(cascade=CascadeType.ALL)
	private ProductRole ProductRole;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;

	public Product() {}

	public Product(Process process, ProductRole ProductRole, Long id){
		this.process = process;
		this.ProductRole = ProductRole;
		this.id = id;
	}

	public Set<Product> getSubProducts(){
		return subProducts;
	}

	public void setSubProducts(Set<Product> subProducts){
		this.subProducts = subProducts;
	}
	
	public Process getProcess(){
		return process;
	}

	public void setProcess(Process process){
		this.process = process;
	}
	
	public ProductRole getProductRole(){
		return ProductRole;
	}

	public void setProductRole(ProductRole ProductRole){
		this.ProductRole = ProductRole;
	}
	
	public Long getId(){
		return id;
	}

	public void setId(Long id){
		this.id = id;
	}
	
}