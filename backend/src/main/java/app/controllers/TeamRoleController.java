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

import app.models.TeamRole;
import app.services.TeamRoleService;
import app.utils.View.HideOptionalProperties;

@CrossOrigin(origins={"http://localhost:4200"})
@RestController
@RequestMapping("/teamrole")
public class TeamRoleController {

    @Autowired
    TeamRoleService teamRoleService;

    @JsonView(HideOptionalProperties.class)
    @RequestMapping()
    public ResponseEntity<Iterable<TeamRole>> getTeamRoles() {
        return new ResponseEntity<Iterable<TeamRole>>(teamRoleService.getTeamRoles(), HttpStatus.OK);
    }

    @JsonView(HideOptionalProperties.class)
    @RequestMapping(value="/{id}", method=RequestMethod.GET)
    public ResponseEntity<TeamRole> getTeamRoleById(@PathVariable Long id) {
        Optional<TeamRole> teamRole = teamRoleService.getTeamRoleById(id);
        if(teamRole.isPresent()) {
            return new ResponseEntity<TeamRole>(teamRole.get(), HttpStatus.OK);
        }
        return new ResponseEntity<TeamRole>(HttpStatus.NOT_FOUND);
    }

    @RequestMapping(value="", method=RequestMethod.POST)
    public ResponseEntity<TeamRole> addTeamRole(@RequestBody TeamRole TeamRoles) {
        teamRoleService.addTeamRole(TeamRoles);
        return new ResponseEntity<TeamRole>(TeamRoles, HttpStatus.CREATED);
    }

    @RequestMapping(value="/{id}", method=RequestMethod.PUT)
    public ResponseEntity<TeamRole> updateTeamRole(@PathVariable Long id, @RequestBody TeamRole TeamRoles) {
        teamRoleService.updateTeamRole(id, TeamRoles);
        return new ResponseEntity<TeamRole>(TeamRoles, HttpStatus.CREATED);
    }

    @RequestMapping(value="/{id}", method=RequestMethod.DELETE)
    public ResponseEntity<TeamRole> removeTeamRole(@PathVariable Long id) {
        try {
            teamRoleService.removeTeamRole(id);
        }catch (Exception e) {
            return new ResponseEntity<TeamRole>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<TeamRole>(HttpStatus.NO_CONTENT);
    }

}
