package app.controllers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.annotation.JsonView;

import app.models.ProjectTeamProject;
import app.services.ProjectTeamProjectService;
import app.utils.View.HideOptionalProperties;

@CrossOrigin(origins={"http://localhost:4200"})
@RestController
@RequestMapping("/projectteamproject")
public class ProjectTeamProjectController {

    @Autowired
    ProjectTeamProjectService projectTeamProjectService;

    @JsonView(HideOptionalProperties.class)
    @RequestMapping()
    public ResponseEntity<Iterable<ProjectTeamProject>> getProjectTeamProjects() {
        return new ResponseEntity<Iterable<ProjectTeamProject>>(projectTeamProjectService.getProjectTeamProjects(), HttpStatus.OK);
    }

    @JsonView(HideOptionalProperties.class)
    @RequestMapping(value="/{id}", method=RequestMethod.GET)
    public ResponseEntity<ProjectTeamProject> getProjectTeamProjectById(@PathVariable Long id) {
        Optional<ProjectTeamProject> projectTeamProject = projectTeamProjectService.getProjectTeamProjectById(id);
        if(projectTeamProject.isPresent()) {
            return new ResponseEntity<ProjectTeamProject>(projectTeamProject.get(), HttpStatus.OK);
        }
        return new ResponseEntity<ProjectTeamProject>(HttpStatus.NOT_FOUND);
    }

    @RequestMapping(value="", method=RequestMethod.POST)
    public ResponseEntity<ProjectTeamProject> addProjectTeamProject(@RequestBody ProjectTeamProject ProjectTeamProjects) {
        projectTeamProjectService.addProjectTeamProject(ProjectTeamProjects);
        return new ResponseEntity<ProjectTeamProject>(ProjectTeamProjects, HttpStatus.CREATED);
    }

    @RequestMapping(value="/{id}", method=RequestMethod.PUT)
    public ResponseEntity<ProjectTeamProject> updateProjectTeamProject(@PathVariable Long id, @RequestBody ProjectTeamProject ProjectTeamProjects) {
        projectTeamProjectService.updateProjectTeamProject(id, ProjectTeamProjects);
        return new ResponseEntity<ProjectTeamProject>(ProjectTeamProjects, HttpStatus.CREATED);
    }

    @RequestMapping(value="/{id}", method=RequestMethod.DELETE)
    public ResponseEntity<ProjectTeamProject> removeProjectTeamProject(@PathVariable Long id) {
        try {
            projectTeamProjectService.removeProjectTeamProject(id);
        }catch (Exception e) {
            return new ResponseEntity<ProjectTeamProject>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<ProjectTeamProject>(HttpStatus.NO_CONTENT);
    }

}
