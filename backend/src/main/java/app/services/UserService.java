package app.services;

import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import app.models.Board;
import app.models.Team;
import app.models.User;
import app.repositories.UserRepository;

@Service
public class UserService {

    @Autowired
    MongoTemplate mongoTemplate;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserService() {
    }

    public Iterable<User> getUsers() {
        return userRepo.findAll();
    }

    public Optional<User> getUserById(String id) {
        Optional<User> user = userRepo.findById(id);
        if(user.isPresent()){
            user.get().getBoards().removeIf(obj -> obj.getDeleted() == true);
        }
        return user;
    }

    public Optional<User> getUserByUsername(String username) {
        Optional<User> user = userRepo.findByUsername(username);
        if(user.isPresent()){
            user.get().getBoards().removeIf(obj -> obj.getDeleted() == true);
        }
        return user;
    }

    public Optional<User> getUserByEmail(String email) {
        Optional<User> user = userRepo.findByEmail(email);
        if(user.isPresent()){
            user.get().getBoards().removeIf(obj -> obj.getDeleted() == true);
        }
        return user;
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
        } else if (oldUserUsername.isPresent()) {
            return HttpStatus.NOT_ACCEPTABLE;
        } else {
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
            user.setPassword(oldUser.get().getPassword());
            userRepo.save(user);
        }
    }

    public void updateUserWithPassword(String id, User user) {
        Optional<User> oldUser = userRepo.findById(id);
        if (oldUser.isPresent()) {
            user.setId(oldUser.get().getId());
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            userRepo.save(user);
        }
    }

    public void updateUserByEmail(String email, User user) {
        Optional<User> oldUser = userRepo.findByEmail(email);
        if (oldUser.isPresent()) {
            user.setId(oldUser.get().getId());
            user.setPassword(oldUser.get().getPassword());
            userRepo.save(user);
        }
    }

    public Iterable<Board> getBoards(String email) {
        Optional<User> user = userRepo.findByEmail(email);
        if(user.isPresent()){
            user.get().getBoards().removeIf(obj -> obj.getDeleted() == true);
        }
        return user.get().getBoards();
    }

    public void leaveBoard(String boardId, String userId) {
        Query query = Query.query( Criteria.where( "$id" ).is( new ObjectId(boardId) ) );
        Update update = new Update().pull("boards", query );
        mongoTemplate.updateMulti( Query.query( Criteria.where( "_id" ).is( new ObjectId(userId) ) ), update, "users" );

        query = Query.query( Criteria.where( "$id" ).is( new ObjectId(userId) ) );
        update = new Update().pull("users", query );
        mongoTemplate.updateMulti( Query.query( Criteria.where( "_id" ).is( new ObjectId(boardId) ) ), update, "boards" );
    }

    public Iterable<Team> getTeams(String email) {
        Optional<User> user = userRepo.findByEmail(email);
        if(user.isPresent()){
            user.get().getTeams().removeIf(obj -> obj.getDeleted() == true);
        }
        return user.get().getTeams();
    }

    public void leaveTeam(String teamId, String userId) {
        Query query = Query.query( Criteria.where( "$id" ).is( new ObjectId(teamId) ) );
        Update update = new Update().pull("teams", query );
        mongoTemplate.updateMulti( Query.query( Criteria.where( "_id" ).is( new ObjectId(userId) ) ), update, "users" );

        query = Query.query( Criteria.where( "$id" ).is( new ObjectId(userId) ) );
        update = new Update().pull("members", query );
        mongoTemplate.updateMulti( Query.query( Criteria.where( "_id" ).is( new ObjectId(teamId) ) ), update, "teams" );
    }

}
