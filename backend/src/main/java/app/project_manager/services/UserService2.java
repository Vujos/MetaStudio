package app.project_manager.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import app.project_manager.models.Board;
import app.project_manager.models.User;
import app.project_manager.repositories.UserRepository2;

@Service
public class UserService2 {

    @Autowired
    private UserRepository2 userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserService2() {
    }

    public Iterable<User> getUsers() {
        return userRepo.findAll();
    }

    public Optional<User> getUserById(String id) {
        return userRepo.findById(id);
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepo.findByUsername(username);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    public Optional<User> getUserByQuery(String query) {
        if (query.contains("@")) {
            return getUserByEmail(query);
        } else {
            return getUserByUsername(query);
        }
    }

    public HttpStatus addUser(User user) {
        Optional<User> oldUserEmail = userRepo.findByEmail(user.getEmail());
        Optional<User> oldUserUsername = userRepo.findByUsername(user.getUsername());
        if (oldUserEmail.isPresent()) {
            return HttpStatus.CONFLICT;
        } 
        else if (oldUserUsername.isPresent()){
            return HttpStatus.NOT_ACCEPTABLE;
        }
        else {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            userRepo.save(user);
            return HttpStatus.CREATED;
        }
    }

    public void removeUser(String id) {
        Optional<User> user = userRepo.findById(id);
        userRepo.delete(user.get());
    }

    public void updateUser(String id, User user) {
        Optional<User> oldUser = userRepo.findById(id);
        if (oldUser.isPresent()) {
            user.setId(oldUser.get().getId());
            userRepo.save(user);
        }
    }

    public void updateUserByEmail(String email, User user) {
        Optional<User> oldUser = userRepo.findByEmail(email);
        if (oldUser.isPresent()) {
            user.setId(oldUser.get().getId());
            userRepo.save(user);
        }
    }

    public Iterable<Board> getBoards(String email) {
        Optional<User> user = userRepo.findByEmail(email);
        return user.get().getBoards();
    }

}
