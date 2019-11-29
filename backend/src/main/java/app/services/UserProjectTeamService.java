package app.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import app.models.UserProjectTeam;
import app.repositories.UserProjectTeamRepository;

@Service
public class UserProjectTeamService {

    @Autowired
    private UserProjectTeamRepository userProjectTeamRepo;

    public UserProjectTeamService() {
    }

    public Iterable<UserProjectTeam> getUserProjectTeams() {
        return userProjectTeamRepo.findAll();
    }

    public Optional<UserProjectTeam> getUserProjectTeamById(Long id) {
        return userProjectTeamRepo.findById(id);
    }

    public void addUserProjectTeam(UserProjectTeam userProjectTeam) {
        userProjectTeamRepo.save(userProjectTeam);
    }

    public void removeUserProjectTeam(Long id) {
        Optional<UserProjectTeam> userProjectTeam = userProjectTeamRepo.findById(id);
        userProjectTeamRepo.delete(userProjectTeam.get());
    }

    public void updateUserProjectTeam(Long id, UserProjectTeam userProjectTeam) {
        Optional<UserProjectTeam> Use = userProjectTeamRepo.findById(id);
        if(Use.isPresent()) {
            userProjectTeam.setId(Use.get().getId());
            userProjectTeamRepo.save(userProjectTeam);
        }
    }

}
