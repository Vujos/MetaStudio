package app.services;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import app.models.Activity;
import app.models.Board;
import app.models.Skill;
import app.models.SkillGeneral;
import app.models.Team;
import app.models.User;
import app.repositories.SkillGeneralRepository;
import app.repositories.SkillRepository;
import app.repositories.UserRepository;

@Service
public class UserService {

    @Autowired
    MongoTemplate mongoTemplate;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ActivityService activityService;

    @Autowired
    private BoardService boardService;

    @Autowired
    private SkillGeneralRepository skillGeneralRepo;

    @Autowired
    private SkillRepository skillRepo;

    public UserService() {
    }

    public Iterable<User> getUsers() {
        return userRepo.findAll();
    }

    public Optional<User> getUserById(String id) {
        Optional<User> user = userRepo.findById(id);
        if (user.isPresent()) {
            user.get().getBoards().removeIf(obj -> obj.getDeleted() == true);
            user.get().getSkills().removeIf(obj -> obj.getDeleted() == true);
        }
        return user;
    }

    public Optional<User> getUserByUsername(String username) {
        Optional<User> user = userRepo.findByUsername(username);
        if (user.isPresent()) {
            user.get().getBoards().removeIf(obj -> obj.getDeleted() == true);
            user.get().getSkills().removeIf(obj -> obj.getDeleted() == true);
        }
        return user;
    }

    public Optional<User> getUserByEmail(String email) {
        Optional<User> user = userRepo.findByEmail(email);
        if (user.isPresent()) {
            user.get().getBoards().removeIf(obj -> obj.getDeleted() == true);
            user.get().getSkills().removeIf(obj -> obj.getDeleted() == true);
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
            for (Activity activity : user.getActivities()) {
                if (activity.getId() == null) {
                    activityService.addActivity(activity);
                }
            }
            for (Board template : user.getTemplates()) {
                if (template.getId() == null) {
                    boardService.addBoard(template);
                }
            }
            for (Skill skill : user.getSkills()) {
                skillRepo.save(skill);
            }
            userRepo.save(user);
        }
    }

    public void updateUserWithPassword(String id, User user) {
        Optional<User> oldUser = userRepo.findById(id);
        if (oldUser.isPresent()) {
            user.setId(oldUser.get().getId());
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            for (Activity activity : user.getActivities()) {
                if (activity.getId() == null) {
                    activityService.addActivity(activity);
                }
            }
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
        if (user.isPresent()) {
            user.get().getBoards().removeIf(obj -> obj.getDeleted() == true);
        }
        return user.get().getBoards();
    }

    public Iterable<Board> getAllBoards(String email) {
        ArrayList<Board> boards = new ArrayList<>();
        Optional<User> user = userRepo.findByEmail(email);
        if (user.isPresent()) {
            user.get().getBoards().removeIf(obj -> obj.getDeleted() == true);
            Set<String> ids = ((Collection<Board>) user.get().getBoards()).stream().map(obj -> obj.getId())
                    .collect(Collectors.toSet());
            boards = user.get().getBoards();
            for (Team team : user.get().getTeams()) {
                java.util.List<Board> complement = ((Collection<Board>) team.getBoards()).stream()
                        .filter(obj -> !ids.contains(obj.getId())).collect(Collectors.toList());
                boards.addAll(complement);
            }
        }
        return boards;
    }

    public Iterable<Board> getBoardsByUserId(String id) {
        Optional<User> user = userRepo.findById(id);
        if (user.isPresent()) {
            user.get().getBoards().removeIf(obj -> obj.getDeleted() == true);
        }
        return user.get().getBoards();
    }

    public Iterable<Board> getAllBoardsByUserId(String id) {
        ArrayList<Board> boards = new ArrayList<>();
        Optional<User> user = userRepo.findById(id);
        if (user.isPresent()) {
            user.get().getBoards().removeIf(obj -> obj.getDeleted() == true);
            Set<String> ids = ((Collection<Board>) user.get().getBoards()).stream().map(obj -> obj.getId())
                    .collect(Collectors.toSet());
            boards = user.get().getBoards();
            for (Team team : user.get().getTeams()) {
                java.util.List<Board> complement = ((Collection<Board>) team.getBoards()).stream()
                        .filter(obj -> !ids.contains(obj.getId())).collect(Collectors.toList());
                boards.addAll(complement);
            }
        }
        return boards;
    }

    public void leaveBoard(String boardId, String userId) {
        Query query = Query.query(Criteria.where("$id").is(new ObjectId(boardId)));
        Update update = new Update().pull("boards", query);
        mongoTemplate.updateMulti(Query.query(Criteria.where("_id").is(new ObjectId(userId))), update, "users");

        query = Query.query(Criteria.where("$id").is(new ObjectId(userId)));
        update = new Update().pull("users", query);
        mongoTemplate.updateMulti(Query.query(Criteria.where("_id").is(new ObjectId(boardId))), update, "boards");
    }

    public Iterable<Team> getTeams(String email) {
        Optional<User> user = userRepo.findByEmail(email);
        if (user.isPresent()) {
            user.get().getTeams().removeIf(obj -> obj.getDeleted() == true);
        }
        return user.get().getTeams();
    }

    public void leaveTeam(String teamId, String userId) {
        Query query = Query.query(Criteria.where("$id").is(new ObjectId(teamId)));
        Update update = new Update().pull("teams", query);
        mongoTemplate.updateMulti(Query.query(Criteria.where("_id").is(new ObjectId(userId))), update, "users");

        query = Query.query(Criteria.where("$id").is(new ObjectId(userId)));
        update = new Update().pull("members", query);
        mongoTemplate.updateMulti(Query.query(Criteria.where("_id").is(new ObjectId(teamId))), update, "teams");
    }

    public String runPython(String x, String y, String query) {
        String[] cmd = { "python", "C:/Users/stank/Desktop/a.py", x, y, query };
        Process p;
        String s = null;
        try {
            p = Runtime.getRuntime().exec(cmd);
            BufferedReader stdInput = new BufferedReader(new InputStreamReader(p.getInputStream()));

            BufferedReader stdError = new BufferedReader(new InputStreamReader(p.getErrorStream()));

            // System.out.println("Here is the standard output of the command:");
            while ((s = stdInput.readLine()) != null) {
                // System.out.println(s);
                return s;
            }

            // System.out.println("Here is the standard error of the command (if any):");
            while ((s = stdError.readLine()) != null) {
                System.out.println(s);
                return s;
            }
            return s;
        } catch (IOException e) {
            e.printStackTrace();
            return s;
        }
    }

    public Optional<User> getUserBySkills(String boardId, Integer listIndex, Integer cardIndex,
            ArrayList<Skill> skills) {
        if (skills.size() == 0) {
            return Optional.empty();
        }
        Optional<Board> board = boardService.getBoardByIdInternalServer(boardId);
        ArrayList<User> users = new ArrayList<>();
        if (board.isPresent()) {
            users.addAll(board.get().getUsers());
            for (ArrayList<User> teamUsers : board.get().getTeams().stream().map(team -> team.getMembers())
                    .collect(Collectors.toList())) {
                users.addAll(teamUsers);
            }
        }
        Set<String> usersOnCardIds = ((Collection<User>) board.get().getLists().get(listIndex).getCards().get(cardIndex)
                .getMembers()).stream().map(obj -> obj.getId()).collect(Collectors.toSet());
        users.removeIf(obj -> usersOnCardIds.contains(obj.getId()));
        if (users.size() == 0) {
            return Optional.empty();
        }
        List<String> yy = users.stream().map(user -> user.getId()).collect(Collectors.toList());
        ArrayList<Integer> y = new ArrayList<>();
        for (int i = 0; i < yy.size(); i++) {
            y.add(i);
        }
        List<SkillGeneral> allSkills = skillGeneralRepo.findAll();
        ArrayList<ArrayList<Integer>> x = new ArrayList<>();
        ArrayList<Integer> userSkills = new ArrayList<>();

        for (User user : users) {
            for (SkillGeneral skillGeneral : allSkills) {
                boolean exists = false;
                for (Skill skill : user.getSkills()) {
                    if (skill.getName().getId().equals(skillGeneral.getId())) {
                        userSkills.add(1);
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    userSkills.add(0);
                }
            }
            ArrayList<Integer> userSkillsCopy = new ArrayList<Integer>();
            userSkillsCopy.addAll(userSkills);
            x.add(userSkillsCopy);
            userSkills.clear();
        }
        ArrayList<ArrayList<Integer>> q = new ArrayList<>();
        ArrayList<Integer> query = new ArrayList<>();
        for (SkillGeneral skillGeneral : allSkills) {
            boolean exists = false;
            for (Skill skill : skills) {
                if (skill.getName().getId().equals(skillGeneral.getId())) {
                    query.add(1);
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                query.add(0);
            }
        }
        q.add(query);
        String result = runPython(x.toString(), y.toString(), q.toString());
        Optional<User> user = getUserById(yy.get(Integer.parseInt(result.substring(1, result.length() - 1))));
        if (user.isPresent()) {
            user.get().getBoards().removeIf(obj -> obj.getDeleted() == true);
        }
        return user;
    }

}
