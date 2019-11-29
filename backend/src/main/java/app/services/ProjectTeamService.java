package app.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import app.models.ProjectTeam;
import app.repositories.ProjectTeamRepository;

@Service
public class ProjectTeamService {

    @Autowired
    private ProjectTeamRepository projectTeamRepo;

    public ProjectTeamService() {
    }

    public Iterable<ProjectTeam> getProjectTeams() {
        return projectTeamRepo.findAll();
    }

    public Optional<ProjectTeam> getProjectTeamById(Long id) {
        return projectTeamRepo.findById(id);
    }

    public void addProjectTeam(ProjectTeam projectTeam) {
        projectTeamRepo.save(projectTeam);
    }

    public void removeProjectTeam(Long id) {
        Optional<ProjectTeam> projectTeam = projectTeamRepo.findById(id);
        projectTeamRepo.delete(projectTeam.get());
    }

    public void updateProjectTeam(Long id, ProjectTeam projectTeam) {
        Optional<ProjectTeam> Pro = projectTeamRepo.findById(id);
        if(Pro.isPresent()) {
            projectTeam.setId(Pro.get().getId());
            projectTeamRepo.save(projectTeam);
        }
    }

}
