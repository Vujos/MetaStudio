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

import app.models.UserProjectTeam;
import app.services.UserProjectTeamService;
import app.utils.View.HideOptionalProperties;

@CrossOrigin(origins={"http://localhost:4200"})
@RestController
@RequestMapping("/userprojectteam")
public class UserProjectTeamController {

    @Autowired
    UserProjectTeamService userProjectTeamService;

    @JsonView(HideOptionalProperties.class)
    @RequestMapping()
    public ResponseEntity<Iterable<UserProjectTeam>> getUserProjectTeams() {
        return new ResponseEntity<Iterable<UserProjectTeam>>(userProjectTeamService.getUserProjectTeams(), HttpStatus.OK);
    }

    @JsonView(HideOptionalProperties.class)
    @RequestMapping(value="/{id}", method=RequestMethod.GET)
    public ResponseEntity<UserProjectTeam> getUserProjectTeamById(@PathVariable Long id) {
        Optional<UserProjectTeam> userProjectTeam = userProjectTeamService.getUserProjectTeamById(id);
        if(userProjectTeam.isPresent()) {
            return new ResponseEntity<UserProjectTeam>(userProjectTeam.get(), HttpStatus.OK);
        }
        return new ResponseEntity<UserProjectTeam>(HttpStatus.NOT_FOUND);
    }

    @RequestMapping(value="", method=RequestMethod.POST)
    public ResponseEntity<UserProjectTeam> addUserProjectTeam(@RequestBody UserProjectTeam UserProjectTeams) {
        userProjectTeamService.addUserProjectTeam(UserProjectTeams);
        return new ResponseEntity<UserProjectTeam>(UserProjectTeams, HttpStatus.CREATED);
    }

    @RequestMapping(value="/{id}", method=RequestMethod.PUT)
    public ResponseEntity<UserProjectTeam> updateUserProjectTeam(@PathVariable Long id, @RequestBody UserProjectTeam UserProjectTeams) {
        userProjectTeamService.updateUserProjectTeam(id, UserProjectTeams);
        return new ResponseEntity<UserProjectTeam>(UserProjectTeams, HttpStatus.CREATED);
    }

    @RequestMapping(value="/{id}", method=RequestMethod.DELETE)
    public ResponseEntity<UserProjectTeam> removeUserProjectTeam(@PathVariable Long id) {
        try {
            userProjectTeamService.removeUserProjectTeam(id);
        }catch (Exception e) {
            return new ResponseEntity<UserProjectTeam>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<UserProjectTeam>(HttpStatus.NO_CONTENT);
    }

}
