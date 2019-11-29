package app.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import app.models.UserProjectTeam;

@Repository
public interface UserProjectTeamRepository extends JpaRepository<UserProjectTeam, Long> {

}