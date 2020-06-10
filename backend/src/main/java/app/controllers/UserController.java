package app.controllers;

import java.util.ArrayList;
import java.util.HashMap;
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

import app.models.Board;
import app.models.Skill;
import app.models.Team;
import app.models.User;
import app.services.LoginService;
import app.services.UserService;

@CrossOrigin(origins = { "http://localhost:4200" })
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    LoginService loginService;

    @RequestMapping(path = "/login", method = RequestMethod.POST)
    public ResponseEntity<HashMap<String, String>> login(@RequestBody User user) {
        return loginService.login(user);
    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public ResponseEntity<User> addUser(@RequestBody User Users) {
        return new ResponseEntity<User>(Users, userService.addUser(Users));
    }

    @RequestMapping()
    public ResponseEntity<Iterable<User>> getUsers() {
        return new ResponseEntity<Iterable<User>>(userService.getUsers(), HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        Optional<User> user = userService.getUserById(id);
        if (user.isPresent()) {
            return new ResponseEntity<User>(user.get(), HttpStatus.OK);
        }
        return new ResponseEntity<User>(HttpStatus.NOT_FOUND);
    }

    @RequestMapping(value = "/query/{query}", method = RequestMethod.GET)
    public ResponseEntity<User> getUserByQuery(@PathVariable String query) {
        Optional<User> user = userService.getUserByQuery(query);
        if (user.isPresent()) {
            return new ResponseEntity<User>(user.get(), HttpStatus.OK);
        }
        return new ResponseEntity<User>(HttpStatus.NOT_FOUND);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User user) {
        userService.updateUser(id, user);
        return new ResponseEntity<User>(userService.getUserById(id).get(), HttpStatus.CREATED);
    }

    @RequestMapping(value = "/update/{id}", method = RequestMethod.PUT)
    public ResponseEntity<User> updateUserWithPassword(@PathVariable String id, @RequestBody User user) {
        userService.updateUserWithPassword(id, user);
        return new ResponseEntity<User>(user, HttpStatus.CREATED);
    }

    @MessageMapping("/users/update/{email}")
    public ResponseEntity<HttpStatus> updateUserWebSocket(@DestinationVariable String email) throws Exception {
        return new ResponseEntity<HttpStatus>(HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<User> removeUser(@PathVariable String id) {
        try {
            userService.removeUser(id);
        } catch (Exception e) {
            return new ResponseEntity<User>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<User>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "/boards/{email}", method = RequestMethod.GET)
    public ResponseEntity<Iterable<Board>> getBoards(@PathVariable String email) {
        return new ResponseEntity<Iterable<Board>>(userService.getBoards(email), HttpStatus.OK);
    }

    @RequestMapping(value = "/leaveBoard/{boardId}/{userId}", method = RequestMethod.DELETE)
    public ResponseEntity<User> leaveBoard(@PathVariable String boardId, @PathVariable String userId) {
        try {
            userService.leaveBoard(boardId, userId);
        } catch (Exception e) {
            return new ResponseEntity<User>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<User>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "/teams/{email}", method = RequestMethod.GET)
    public ResponseEntity<Iterable<Team>> getTeams(@PathVariable String email) {
        return new ResponseEntity<Iterable<Team>>(userService.getTeams(email), HttpStatus.OK);
    }

    @RequestMapping(value = "/leaveTeam/{teamId}/{userId}", method = RequestMethod.DELETE)
    public ResponseEntity<User> leaveTeam(@PathVariable String teamId, @PathVariable String userId) {
        try {
            userService.leaveTeam(teamId, userId);
        } catch (Exception e) {
            return new ResponseEntity<User>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<User>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "/{boardId}/skills", method = RequestMethod.POST)
    public ResponseEntity<User> getUserBySkills(@PathVariable String boardId, @RequestBody ArrayList<Skill> skills) {
        Optional<User> user = userService.getUserBySkills(boardId, skills);
        if (user.isPresent()) {
            return new ResponseEntity<User>(user.get(), HttpStatus.OK);
        }
        return new ResponseEntity<User>(HttpStatus.NOT_FOUND);
    }

}
