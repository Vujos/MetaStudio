package app.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import app.models.ProjectTeamProject;
import app.repositories.ProjectTeamProjectRepository;

@Service
public class ProjectTeamProjectService {

    @Autowired
    private ProjectTeamProjectRepository projectTeamProjectRepo;

    public ProjectTeamProjectService() {
    }

    public Iterable<ProjectTeamProject> getProjectTeamProjects() {
        return projectTeamProjectRepo.findAll();
    }

    public Optional<ProjectTeamProject> getProjectTeamProjectById(Long id) {
        return projectTeamProjectRepo.findById(id);
    }

    public void addProjectTeamProject(ProjectTeamProject projectTeamProject) {
        projectTeamProjectRepo.save(projectTeamProject);
    }

    public void removeProjectTeamProject(Long id) {
        Optional<ProjectTeamProject> projectTeamProject = projectTeamProjectRepo.findById(id);
        projectTeamProjectRepo.delete(projectTeamProject.get());
    }

    public void updateProjectTeamProject(Long id, ProjectTeamProject projectTeamProject) {
        Optional<ProjectTeamProject> Pro = projectTeamProjectRepo.findById(id);
        if(Pro.isPresent()) {
            projectTeamProject.setId(Pro.get().getId());
            projectTeamProjectRepo.save(projectTeamProject);
        }
    }

}
