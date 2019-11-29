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

import app.models.ProjectTeam;
import app.services.ProjectTeamService;
import app.utils.View.HideOptionalProperties;

@CrossOrigin(origins={"http://localhost:4200"})
@RestController
@RequestMapping("/projectteam")
public class ProjectTeamController {

    @Autowired
    ProjectTeamService projectTeamService;

    @JsonView(HideOptionalProperties.class)
    @RequestMapping()
    public ResponseEntity<Iterable<ProjectTeam>> getProjectTeams() {
        return new ResponseEntity<Iterable<ProjectTeam>>(projectTeamService.getProjectTeams(), HttpStatus.OK);
    }

    @JsonView(HideOptionalProperties.class)
    @RequestMapping(value="/{id}", method=RequestMethod.GET)
    public ResponseEntity<ProjectTeam> getProjectTeamById(@PathVariable Long id) {
        Optional<ProjectTeam> projectTeam = projectTeamService.getProjectTeamById(id);
        if(projectTeam.isPresent()) {
            return new ResponseEntity<ProjectTeam>(projectTeam.get(), HttpStatus.OK);
        }
        return new ResponseEntity<ProjectTeam>(HttpStatus.NOT_FOUND);
    }

    @RequestMapping(value="", method=RequestMethod.POST)
    public ResponseEntity<ProjectTeam> addProjectTeam(@RequestBody ProjectTeam ProjectTeams) {
        projectTeamService.addProjectTeam(ProjectTeams);
        return new ResponseEntity<ProjectTeam>(ProjectTeams, HttpStatus.CREATED);
    }

    @RequestMapping(value="/{id}", method=RequestMethod.PUT)
    public ResponseEntity<ProjectTeam> updateProjectTeam(@PathVariable Long id, @RequestBody ProjectTeam ProjectTeams) {
        projectTeamService.updateProjectTeam(id, ProjectTeams);
        return new ResponseEntity<ProjectTeam>(ProjectTeams, HttpStatus.CREATED);
    }

    @RequestMapping(value="/{id}", method=RequestMethod.DELETE)
    public ResponseEntity<ProjectTeam> removeProjectTeam(@PathVariable Long id) {
        try {
            projectTeamService.removeProjectTeam(id);
        }catch (Exception e) {
            return new ResponseEntity<ProjectTeam>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<ProjectTeam>(HttpStatus.NO_CONTENT);
    }

}
