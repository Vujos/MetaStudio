package app.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Column;
import app.utils.View.ShowProcess;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonView;
import javax.persistence.OneToMany;


@Entity
public class SDLC {

	@Column(length=128, nullable = false)
	private String name;

	@JsonView(ShowProcess.class)
	@OneToMany(mappedBy="SDLC")
	private Set<Process> processes;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;

	public SDLC() {}

	public SDLC(Set<Process> processes, Long id){
		this.processes = processes;
		this.id = id;
	}

	public String getName(){
		return name;
	}

	public void setName(String name){
		this.name = name;
	}
	
	public Set<Process> getProcesses(){
		return processes;
	}

	public void setProcesses(Set<Process> processes){
		this.processes = processes;
	}
	
	public Long getId(){
		return id;
	}

	public void setId(Long id){
		this.id = id;
	}
	
}