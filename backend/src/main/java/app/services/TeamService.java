package app.services;

import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import app.models.Team;
import app.models.User;
import app.repositories.TeamRepository;

@Service
public class TeamService {

    @Autowired
    MongoTemplate mongoTemplate;

    @Autowired
    private TeamRepository teamRepo;

    @Autowired
    private SimpMessagingTemplate template;

    public TeamService() {
    }

    public Iterable<Team> getTeams() {
        return teamRepo.findAll();
    }

    public Optional<Team> getTeamByIdInternalServer(String id) {
        Optional<Team> team = teamRepo.findById(id);
        if (team.isPresent()) {
            team.get().getMembers().removeIf(obj -> obj.getDeleted() == true);
            team.get().getBoards().removeIf(obj -> obj.getDeleted() == true);
        }
        return team;
    }

    public Optional<Team> getTeamById(String id, String email) {
        Optional<Team> team = teamRepo.findByIdAndDeleted(id, false);
        if (team.isPresent()) {
            for (User user : team.get().getMembers()) {
                if (user.getEmail().equals(email)) {
                    team.get().getMembers().removeIf(obj -> obj.getDeleted() == true);
                    team.get().getBoards().removeIf(obj -> obj.getDeleted() == true);
                    return team;
                }
            }
        }
        return Optional.empty();
    }

    public HttpStatus addTeam(Team team) {
        teamRepo.save(team);
        return HttpStatus.CREATED;
    }

    public void removeTeam(String id) {
        Optional<Team> team = teamRepo.findByIdAndDeleted(id, false);
        if (team.isPresent()) {
            for (User user : team.get().getMembers()) {
                Query query = Query.query(Criteria.where("$id").is(new ObjectId(team.get().getId())));
                Update update = new Update().pull("teams", query);
                mongoTemplate.updateMulti(Query.query(Criteria.where("_id").is(new ObjectId(user.getId()))), update,
                        "users");
            }
        }
    }

    public void updateTeam(String id, Team team) {
        Optional<Team> oldTeam = teamRepo.findByIdAndDeleted(id, false);
        if (oldTeam.isPresent()) {
            team.setId(oldTeam.get().getId());
            teamRepo.save(team);
        }
    }

    public ResponseEntity<Team> updateTeamWebSocket(String id, Team team) {
        if (team.getDeleted() == true) {
            removeTeam(id);
            for (User user : team.getMembers()) {
                template.convertAndSend("/topic/users/update/" + user.getEmail(),
                        new ResponseEntity<>(HttpStatus.NO_CONTENT));
            }
            updateTeam(id, team);
            template.convertAndSend("/topic/teams/update/" + id,
                        new ResponseEntity<>(HttpStatus.NO_CONTENT));
            return new ResponseEntity<Team>(HttpStatus.NO_CONTENT);
        }
        updateTeam(id, team);
        Optional<Team> updatedTeam = getTeamByIdInternalServer(id);
        if (updatedTeam.isPresent()) {
            return new ResponseEntity<Team>(updatedTeam.get(), HttpStatus.CREATED);
        }
        return new ResponseEntity<Team>(HttpStatus.NOT_FOUND);
    }

    public void leaveBoard(String boardId, String teamId) {
        Query query = Query.query(Criteria.where("$id").is(new ObjectId(boardId)));
        Update update = new Update().pull("boards", query);
        mongoTemplate.updateMulti(Query.query(Criteria.where("_id").is(new ObjectId(teamId))), update, "teams");

        query = Query.query(Criteria.where("$id").is(new ObjectId(teamId)));
        update = new Update().pull("teams", query);
        mongoTemplate.updateMulti(Query.query(Criteria.where("_id").is(new ObjectId(boardId))), update, "boards");
    }

}
