package app.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import app.models.Project;
import app.repositories.ProjectRepository;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepo;

    public ProjectService() {
    }

    public Iterable<Project> getProjects() {
        return projectRepo.findAll();
    }

    public Optional<Project> getProjectById(Long id) {
        return projectRepo.findById(id);
    }

    public void addProject(Project project) {
        projectRepo.save(project);
    }

    public void removeProject(Long id) {
        Optional<Project> project = projectRepo.findById(id);
        projectRepo.delete(project.get());
    }

    public void updateProject(Long id, Project project) {
        Optional<Project> Pro = projectRepo.findById(id);
        if(Pro.isPresent()) {
            project.setId(Pro.get().getId());
            projectRepo.save(project);
        }
    }

}
