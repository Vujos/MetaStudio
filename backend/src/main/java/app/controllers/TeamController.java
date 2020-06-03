package app.controllers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import app.models.Team;
import app.models.User;
import app.services.TeamService;

@CrossOrigin(origins = { "http://localhost:4200" })
@RestController
@RequestMapping("/api/teams")
public class TeamController {

    @Autowired
    UserController userController;

    @Autowired
    TeamService teamService;

    @RequestMapping()
    public ResponseEntity<Iterable<Team>> getTeams() {
        return new ResponseEntity<Iterable<Team>>(teamService.getTeams(), HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}/{email}", method = RequestMethod.GET)
    public ResponseEntity<Team> getTeamById(@PathVariable String id, @PathVariable String email) {
        Optional<Team> team = teamService.getTeamById(id, email);
        if (team.isPresent()) {
            return new ResponseEntity<Team>(team.get(), HttpStatus.OK);
        }
        return new ResponseEntity<Team>(HttpStatus.NOT_FOUND);
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public ResponseEntity<Team> addTeam(@RequestBody Team team) {
        return new ResponseEntity<Team>(team, teamService.addTeam(team));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Team> updateTeam(@PathVariable String id, @RequestBody Team team) {
        return teamService.updateTeamWebSocket(id, team);
    }

    @MessageMapping("/teams/update/{id}")
    public ResponseEntity<HttpStatus> updateTeamWebSocket(@DestinationVariable String id) throws Exception {
        return new ResponseEntity<HttpStatus>(HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Team> removeTeam(@PathVariable String id) {
        try {
            teamService.removeTeam(id);

        } catch (Exception e) {
            return new ResponseEntity<Team>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<Team>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "/leaveBoard/{boardId}/{teamId}", method = RequestMethod.DELETE)
    public ResponseEntity<User> leaveBoard(@PathVariable String boardId, @PathVariable String teamId) {
        try {
            teamService.leaveBoard(boardId, teamId);
        } catch (Exception e) {
            return new ResponseEntity<User>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<User>(HttpStatus.NO_CONTENT);
    }

}
