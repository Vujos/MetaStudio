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

import app.models.Project;
import app.services.ProjectService;
import app.utils.View.HideOptionalProperties;

@CrossOrigin(origins={"http://localhost:4200"})
@RestController
@RequestMapping("/project")
public class ProjectController {

    @Autowired
    ProjectService projectService;

    @JsonView(HideOptionalProperties.class)
    @RequestMapping()
    public ResponseEntity<Iterable<Project>> getProjects() {
        return new ResponseEntity<Iterable<Project>>(projectService.getProjects(), HttpStatus.OK);
    }

    @JsonView(HideOptionalProperties.class)
    @RequestMapping(value="/{id}", method=RequestMethod.GET)
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        Optional<Project> project = projectService.getProjectById(id);
        if(project.isPresent()) {
            return new ResponseEntity<Project>(project.get(), HttpStatus.OK);
        }
        return new ResponseEntity<Project>(HttpStatus.NOT_FOUND);
    }

    @RequestMapping(value="", method=RequestMethod.POST)
    public ResponseEntity<Project> addProject(@RequestBody Project Projects) {
        projectService.addProject(Projects);
        return new ResponseEntity<Project>(Projects, HttpStatus.CREATED);
    }

    @RequestMapping(value="/{id}", method=RequestMethod.PUT)
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project Projects) {
        projectService.updateProject(id, Projects);
        return new ResponseEntity<Project>(Projects, HttpStatus.CREATED);
    }

    @RequestMapping(value="/{id}", method=RequestMethod.DELETE)
    public ResponseEntity<Project> removeProject(@PathVariable Long id) {
        try {
            projectService.removeProject(id);
        }catch (Exception e) {
            return new ResponseEntity<Project>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<Project>(HttpStatus.NO_CONTENT);
    }

}
