package app.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import app.models.User;
import app.repositories.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;

    public UserService() {
    }

    public Iterable<User> getUsers() {
        return userRepo.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepo.findById(id);
    }

    public void addUser(User user) {
        userRepo.save(user);
    }

    public void removeUser(Long id) {
        Optional<User> user = userRepo.findById(id);
        userRepo.delete(user.get());
    }

    public void updateUser(Long id, User user) {
        Optional<User> Use = userRepo.findById(id);
        if(Use.isPresent()) {
            user.setId(Use.get().getId());
            userRepo.save(user);
        }
    }

}
