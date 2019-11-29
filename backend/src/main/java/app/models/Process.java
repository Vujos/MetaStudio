package app.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Column;
import app.utils.View.ShowProcess;
import app.utils.View.ShowProduct;
import javax.persistence.CascadeType;
import javax.persistence.ManyToOne;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonView;
import javax.persistence.OneToMany;


@Entity
public class Process {

	@Column(nullable = false)
	private Integer deadline;

	@Column(nullable = false)
	private Boolean finished;

	@JsonView(ShowProduct.class)
	@OneToMany(mappedBy="process")
	private Set<Product> products;

	@JsonView(ShowProcess.class)
	@OneToMany(mappedBy="subPocesses")
	private Set<Process> subPocesses;

	@ManyToOne(cascade=CascadeType.ALL)
	private SDLC SDLC;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;

	public Process() {}

	public Process(Boolean finished, Set<Product> products, Set<Process> subPocesses, SDLC SDLC, Long id){
		this.finished = finished;
		this.products = products;
		this.subPocesses = subPocesses;
		this.SDLC = SDLC;
		this.id = id;
	}

	public Integer getDeadline(){
		return deadline;
	}

	public void setDeadline(Integer deadline){
		this.deadline = deadline;
	}
	
	public Boolean getFinished(){
		return finished;
	}

	public void setFinished(Boolean finished){
		this.finished = finished;
	}
	
	public Set<Product> getProducts(){
		return products;
	}

	public void setProducts(Set<Product> products){
		this.products = products;
	}
	
	public Set<Process> getSubPocesses(){
		return subPocesses;
	}

	public void setSubPocesses(Set<Process> subPocesses){
		this.subPocesses = subPocesses;
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