package app.project_manager.controllers;

import java.util.HashMap;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import app.project_manager.models.Board;
import app.project_manager.models.User;
import app.project_manager.services.LoginService2;
import app.project_manager.services.UserService2;

@CrossOrigin(origins = { "http://localhost:4200" })
@RestController
@RequestMapping("/api/users")
public class UserController2 {

    @Autowired
    UserService2 userService;

    @Autowired
	LoginService2 loginService;

	@RequestMapping(path = "/login", method = RequestMethod.POST)
	public ResponseEntity<HashMap<String, String>> login(@RequestBody User user) {
		return loginService.login(user);
    }
    
    @RequestMapping(value="/register", method=RequestMethod.POST)
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
        return new ResponseEntity<User>(user, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/update/{id}", method = RequestMethod.PUT)
    public ResponseEntity<User> updateUserWithPassword(@PathVariable String id, @RequestBody User user) {
        userService.updateUserWithPassword(id, user);
        return new ResponseEntity<User>(user, HttpStatus.CREATED);
    }

    @MessageMapping("/users/update/{email}")
    public ResponseEntity<User> updateUserWebSocket(@DestinationVariable String email, @Payload User user)
            throws Exception {
        userService.updateUserByEmail(email, user);
        return new ResponseEntity<User>(user, HttpStatus.CREATED);
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

}
