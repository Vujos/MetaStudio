package app.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import app.models.TeamRole;
import app.repositories.TeamRoleRepository;

@Service
public class TeamRoleService {

    @Autowired
    private TeamRoleRepository teamRoleRepo;

    public TeamRoleService() {
    }

    public Iterable<TeamRole> getTeamRoles() {
        return teamRoleRepo.findAll();
    }

    public Optional<TeamRole> getTeamRoleById(Long id) {
        return teamRoleRepo.findById(id);
    }

    public void addTeamRole(TeamRole teamRole) {
        teamRoleRepo.save(teamRole);
    }

    public void removeTeamRole(Long id) {
        Optional<TeamRole> teamRole = teamRoleRepo.findById(id);
        teamRoleRepo.delete(teamRole.get());
    }

    public void updateTeamRole(Long id, TeamRole teamRole) {
        Optional<TeamRole> Tea = teamRoleRepo.findById(id);
        if(Tea.isPresent()) {
            teamRole.setId(Tea.get().getId());
            teamRoleRepo.save(teamRole);
        }
    }

}
